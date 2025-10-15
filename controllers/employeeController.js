// controllers/employeeController.js
import bcrypt from "bcrypt";
import employeeModel from "./../models/employeeModels.js"
import RefreshTokeModel from "../models/refreshTokenModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  ACCESS_MS,
  REFRESH_MS,
  NODE_ENV,
  TOKEN_HTTP_ONLY,
  SAMESITE_COOKIES,
  decodedToken
} from "./../utils/tokenUtils.js";


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



export const loginHandel = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.render("employee/login", { message: "All fields are required" });

    const employee = await employeeModel
      .findOne({ "contact.email": email })
      .select("+password.value");
    if (!employee || !employee.password?.length)
      return res.render("employee/login", { message: "Invalid credentials" });

    const hash = employee.password.at(-1).value;
    const valid = await bcrypt.compare(password, hash);
    if (!valid) return res.render("employee/login", { message: "Invalid password" });

    const payload = {
      id: employee._id,
      employeeId: employee.employeeId,
      fullname: employee.fullname,
      email: employee.contact.email,
      mobile: employee.contact.mobile,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const ua = req.useragent || {};
    await RefreshTokeModel.create({
      employeeId: employee._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_MS),
      revoked: false, 
      revokedAt: null,
      userAgent: {
        device: ua.isMobile ? "Mobile" : ua.isTablet ? "Tablet" : "Desktop",
        platform: ua.platform,
        os: ua.os,
        browser: ua.browser,
        browserVersion: ua.version,
        ip : req.headers["x-forwarded-for"] || req.connection.remoteAddress
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: TOKEN_HTTP_ONLY,
      secure: NODE_ENV === "production",
      sameSite: SAMESITE_COOKIES,
      maxAge: ACCESS_MS,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: TOKEN_HTTP_ONLY,
      secure: NODE_ENV === "production",
      sameSite: SAMESITE_COOKIES,
      maxAge: REFRESH_MS,
    });

    res.redirect("/emp/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res.render("employee/login", { message: "Server error. Try again." });
  }
};

// REFRESH TOKEN ENDPOINT
export const refreshAccessToken = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;
    if (!oldToken) return res.redirect("/emp/login?no-refreshToken-cookies");

    // Step 1: Check token in DB
    const stored = await RefreshTokeModel.findOne({ token: oldToken });
    if (!stored || stored.revoked) return res.redirect("/emp/login?no-token-valid");

    // Step 2: Verify JWT token
    const decoded = verifyRefreshToken(oldToken); // assumes it throws on failure
    if (!decoded || !decoded.id) return res.redirect("/emp/login?invalid-refresh-token");

    // Step 3: Rotate tokens
    const newAccessToken = generateAccessToken(decoded);
    const newRefreshToken = generateRefreshToken(decoded);

    // Step 4: Revoke old token
    await RefreshTokeModel.updateOne(
      { token: oldToken },
      { revoked: true, revokedAt: new Date(), replacedByToken: newRefreshToken }
    );

    // Step 5: Store new refresh token
    const ua = req.useragent || {};
    await RefreshTokeModel.create({
      employeeId: stored.employeeId, // ✅ Correct field
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_MS),
      userAgent: {
        device: ua.isMobile ? "Mobile" : ua.isTablet ? "Tablet" : "Desktop",
        platform: ua.platform,
        os: ua.os,
        browser: ua.browser,
        browserVersion: ua.version,
        ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      },
    });

    // Step 6: Send cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: TOKEN_HTTP_ONLY,
      secure: NODE_ENV === "production",
      sameSite: SAMESITE_COOKIES,
      maxAge: ACCESS_MS,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: TOKEN_HTTP_ONLY,
      secure: NODE_ENV === "production",
      sameSite: SAMESITE_COOKIES,
      maxAge: REFRESH_MS,
    });

    res.redirect("/emp/dashboard");
  } catch (err) {
    console.error("Token refresh error:", err);
    res.redirect("/emp/login?error");
  }
};

// LOGOUT
export const logoutHandal = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await RefreshTokeModel.updateOne({ token: refreshToken },{ revoked: true, revokedAt: new Date() });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/emp/login?logout");
  } catch (err) {
    console.error("Logout error:", err);
    res.redirect("/emp/login");
  }
};

// LOGOUT All Devices
export const logoutFromAll = async (req, res) => {
   try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      // Verify token to extract employeeId
      const dt = decodedToken(refreshToken)

      // Revoke ALL tokens for that employee
      await RefreshTokeModel.updateMany(
        { employeeId: dt.id },
        { $set: { revoked: true, revokedAt: new Date() } }
      );
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/emp/login?logout");
  } catch (err) {
    console.error("Logout error:", err);
    res.redirect("/emp/login");
  }
};



// dashboard
export const dashboardRender = (req, res) => {
  res.send(`<p>Welcome ${req.user.fullname} - <a href="/emp/logout">Logout</a> || <a href="/emp/logout-all">Logout All</a></p>
    <h1>Dashboard</h1>
    <p> ${req.user.employeeId} || ${req.user.email} || ${req.user.mobile}</p>
    <p><a href="/emp/profile">Profile</a> || <a href="/emp/dashboard">Dashboard</a></p>
`);
}

// profile
export const profileRender = (req, res) => {
  res.send(`<p>Welcome ${req.user.fullname} - <a href="/emp/logout">Logout</a> || <a href="/emp/logout-all">Logout All</a></p>
    <h1>Profile</h1>
    <p> ${req.user.employeeId} || ${req.user.email} || ${req.user.mobile}</p>
    <p><a href="/emp/profile">Profile</a> || <a href="/emp/dashboard">Dashboard</a></p>
`);
}