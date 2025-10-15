// controllers/employeeController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import employeeModel from "./../models/employeeModels.js"
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN);
const REFRESH_TOKEN_EXPIRES_IN = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN);
const TOKEN_HTTP_ONLY = process.env.TOKEN_HTTP_ONLY;
const SAMESITE_COOKIES = process.env.SAMESITE_COOKIES;
let refreshTokens = [];

// RENDER REGISTER PAGE
export const registerRender = (req, res) => {
  res.render("employee/register", { message: null });
};

// REGISTER NEW EMPLOYEE
export const registerHandel = async (req, res) => {
  const { fullname, mobile, email, password } = req.body;
  if (!fullname || !mobile || !email || !password) {
      return res.render("employee/register", { message: "All fields are required" });
  }
  try {
    const existingEmail = await employeeModel.findOne({ 'contact.email': email });
    if (existingEmail) {
      return res.render("employee/register", { message: `Email already registered - ${existingEmail.contact.email}` });
    }
    const existingMobile = await employeeModel.findOne({ 'contact.mobile': mobile });
    if (existingMobile) {
      return res.render("employee/register", { message: `Mobile already registered - ${existingMobile.contact.mobile}` });
    }

    const ua = req.useragent || {};
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new employeeModel({ 
        fullname, 
        contact:{mobile, email}, 
        password: [{value: hashedPassword, at: new Date()}], 
        updateHistory: {
          updatetype:'Create',
          by:null,
          at: new Date(),
          device: ua.isMobile ? 'Mobile' : ua.isTablet ? 'Tablet' : 'Desktop',
          platform: ua.platform,
          os: ua.os,
          browser: ua.browser,
          browserVersion: ua.version,
          ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.connection.remoteAddress
        }
    });
     await newEmployee.save();
    /*
    const savedEmployee = await newEmployee.save();
    savedEmployee.updateHistory[0].by = savedEmployee._id;
    await savedEmployee.save();
    console.log("success - ", savedEmployee);
    */

    res.redirect("/emp/login");
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      console.error("Validation Error(s):", messages);
      return res.render("employee/register", { message: messages.join(", ") });
    }
    console.error("Register error:", err);
    res.render("employee/register", { message: "Server error. Try again." });
  }
};

// RENDER LOGIN PAGE
export const loginRender = (req, res) => {
  res.render("employee/login", { message: null });
};

// LOGIN EMPLOYEE
export const loginHandel = async (req, res) => {
  const { email, password } = req.body;
  // Validation
  if (!email || !password) {
      return res.render("employee/login", { message: "All fields are required" });
  }
  try {
    // Find employee by email
    const result = await employeeModel
      .findOne({ "contact.email": email })
      .select("+password.value"); // since password.value is select: false

    if (!result || !result.password || !result.password.length) {
      return res.render("employee/login", { message: "Invalid email" });
    }

    const hashedPassword = result.password[result.password.length - 1].value;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.render("employee/login", { message: "Invalid  password" });
    }

    // ✅ Generate JWT tokens
    const payload = { 
      id: result._id, 
      employeeId: result.employeeId, 
      fullname: result.fullname, 
      email: result.contact.email, 
      mobile: result.contact.mobile 
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

    refreshTokens.push(refreshToken); // store refresh token temporarily

    // ✅ Send tokens as cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: TOKEN_HTTP_ONLY,
      maxAge: ACCESS_TOKEN_EXPIRES_IN,
      sameSite: SAMESITE_COOKIES,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: TOKEN_HTTP_ONLY,
      maxAge: REFRESH_TOKEN_EXPIRES_IN,
      sameSite: SAMESITE_COOKIES,
    });

    // Optionally log login attempt
    const ua = req.useragent || {};
    result.loginHistory = result.loginHistory || [];
    result.loginHistory.push({
      at: new Date(),
      device: ua.isMobile ? "Mobile" : ua.isTablet ? "Tablet" : "Desktop",
      platform: ua.platform,
      os: ua.os,
      browser: ua.browser,
      browserVersion: ua.version,
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    });
    await result.save();

    // ✅ Render dashboard or redirect
    res.redirect("/emp/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res.render("employee/login", { message: "Server error. Try again." });
  }
};

// REFRESH TOKEN ENDPOINT
export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    console.error("Refresh token not valid");
    return res.redirect("/emp/login");
  }
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
       console.error("Invalid refresh token: ", err.message);
      return res.redirect("/emp/login");
    }  
    const payloads = {
      id: result._id, 
      employeeId: user.employeeId, 
      fullname: user.fullname, 
      email: user.email, 
      mobile: user.mobile 
    }
    const newAccessToken = jwt.sign(
      { payloads },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
    res.cookie("accessToken", newAccessToken, {
      httpOnly: TOKEN_HTTP_ONLY,
      maxAge: ACCESS_TOKEN_EXPIRES_IN,
      sameSite: SAMESITE_COOKIES,
    });
    console.log("Access token refreshed");
    res.redirect("/emp/dashboard"); // ✅ IMPORTANT: redirect back
  });
};

// LOGOUT
export const logoutEmployee = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.redirect("/emp/login?logout");
};

// dashboard
export const dashboardRender = (req, res) => {
  res.send(`<p>Welcome ${req.user.fullname} - <a href="/emp/logout">Logout</a></p>
    <h1>Dashboard</h1>
    <p> ${req.user.employeeId} || ${req.user.email} || ${req.user.mobile}</p>
    <p><a href="/emp/profile">Profile</a> || <a href="/emp/dashboard">Dashboard</a></p>
`);
}

// profile
export const profileRender = (req, res) => {
  res.send(`<p>Welcome ${req.user.fullname} - <a href="/emp/logout">Logout</a></p>
    <h1>Profile</h1>
    <p> ${req.user.employeeId} || ${req.user.email} || ${req.user.mobile}</p>
    <p><a href="/emp/profile">Profile</a> || <a href="/emp/dashboard">Dashboard</a></p>
`);
}