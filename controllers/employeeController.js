// controllers/employeeController.js
import employeeModel from "./../models/employeeModels.js"
import { logsUpdate } from "./empUpdateHistoryController.js";
import { logsLogin } from "./empLoginHistoryController.js";
import { tokenAllRemoke, tokenCreate, tokenRemoke, tokenRotate } from "./empTokenController.js";

import { hashedPassword, comparePassword } from '../utils/password.js';
 import {isRTC, getRTC} from "./../utils/tokenUtils.js";

 
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

    let hasshedWithSaltPassword = await hashedPassword(password);
    const newEmployee = new employeeModel({ 
        fullname, 
        contact:{mobile, email}, 
        password: [{value: hasshedWithSaltPassword, at: new Date()}], 
    });
    await newEmployee.save();
    await logsUpdate(req, newEmployee.employeeId, 'Create');

    res.redirect("/emp/login");
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      console.error("Validation Error(s):", messages);
      return res.render("employee/register", { message: messages.join(", ") });
    }
    console.error("Register Server error:", err);
    res.render("employee/register", { message: "Server error. Try again." });
  }
};

// RENDER LOGIN PAGE
export const loginRender = (req, res) => {
  res.render("employee/login", { message: null });
};


// login Handel
export const loginHandel = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("employee/login", { message: "All fields are required" });
  }
  try {
    const employee = await employeeModel.findOne({ "contact.email": email }).select("+password.value");
    if (!employee || !employee.password?.length) {
      return res.render("employee/login", { message: "Invalid credentials" });
    }
    const hash = employee.password.at(-1).value;
    const isMatch = await comparePassword(password, hash); 
    if (!isMatch) {
      return res.render("employee/login", { message: "Invalid password" });
    }
    const payload = {
      id: employee._id,
      employeeId: employee.employeeId,
      fullname: employee.fullname,
      email: employee.contact.email,
      mobile: employee.contact.mobile,
    };
    await tokenCreate(req, res, payload);
    await logsLogin(req, employee.employeeId);
    res.redirect("/emp/dashboard");
  } catch (err) {
    console.error("Login Server error:", err);
    return res.render("employee/login", { message: "Server error. Try again." });
  }
};

// REFRESH TOKEN ENDPOINT
export const refreshAccessToken = async (req, res) => {
  const isRT = isRTC(req);
  if (!isRT) return res.redirect("/emp/login");
  try {
    await tokenRotate(req, res);
    console.log("refresh redirect now dashboard"); 
    res.redirect("/emp/dashboard");
  } catch (err) {
    console.error("Token refresh error:", err);
    res.redirect("/emp/login?error");
  }
};
 




// LOGOUT
export const logoutHandal = async (req, res) => {
  try {
    const isRT = isRTC(req);
    const getRT = getRTC(req);
    if (isRT) {
      await tokenRemoke(getRT, res);
    }
    res.redirect("/emp/login?logout");
  } catch (err) {
    console.error("Logout error:", err);
    res.redirect("/emp/login");
  }
};

// LOGOUT All Devices
export const logoutFromAll = async (req, res) => {
   try {
    const isRT = isRTC(req);
    if (isRT) {
      await tokenAllRemoke(req, res);
    }
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