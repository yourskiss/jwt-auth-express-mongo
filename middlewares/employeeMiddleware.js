import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";

// Protect private pages
export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.redirect("/emp/login?token=missing");

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.redirect("/emp/login?token=invalid");
    req.user = user;
    next();
  });
};

// Redirect logged-in users away from guest pages
export const guestToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next();

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err) => {
    if (err) return next();
    res.redirect("/emp/dashboard");
  });
};
