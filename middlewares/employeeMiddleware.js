// middlewares/employeeMiddleware.js
import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";


export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.redirect("/emp/login?token-not");

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.redirect("/emp/login?token-error");
    req.user = user;
    next();
  });
};

export const guestToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next(); // no token → proceed to login page

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(); // token invalid/expired → continue to login
    return res.redirect("/emp/dashboard"); // token valid → redirect to dashboard
  });
};