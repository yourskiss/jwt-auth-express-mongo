// middlewares/employeeMiddleware.js
 import {
  ACCESS_SECRET, REFRESH_SECRET,
  generateAT, generateRT,
  verifyAT, verifyRT,
  setATC, setRTC, getATC, getRTC, isATC, isRTC, removeATC, removeRTC,
  ACCESS_MS, REFRESH_MS,
  NODE_ENV, TOKEN_HTTP_ONLY, SAMESITE_COOKIES
} from "./../utils/tokenUtils.js";



// Redirect logged-in users away from guest pages
export const guestToken = (req, res, next) => {
  const isAT = isATC(req);
  const getAT = getATC(req);
  if (!isAT) {
    return next();
  }
  try {
    const payload = verifyAT(getAT); // Assumes this throws if invalid
    if (payload) {
      return res.redirect("/emp/dashboard");
    }
  } catch (err) {
    console.log("guestToken middleware error:", err);
  }
  return next(); // Allow access if token is invalid
};


 

export const verifyToken = (req, res, next) => {
  const isAT = isATC(req);
  const getAT = getATC(req);
  if (!isAT) {
    return attemptAutoLogin(req, res, next);
  }
  try {
    const payload = verifyAT(getAT); 
    req.user = payload;
    return next();
  } catch (err) {
    console.log("employeeMiddleware - verifyToken -", err);
    return attemptAutoLogin(req, res, next);
  }
};





const attemptAutoLogin = (req, res, next) => {
  const isRT = isRTC(req);
  const getRT = getRTC(req);
  if (!isRT) {
    return res.redirect("/emp/login?no-refresh-token");
  }
  return res.redirect("/emp/refresh");
  /*
  try {
    const payload = verifyRT(getRT); 
    const newAccessToken = generateAT(payload);
    setATC(res, newAccessToken);
    req.user = payload;
    console.log("employeeMiddleware - attemptAutoLogin - success", { isRT, getRT, payload });
    return next(); 
  } catch (err) {
    console.log("employeeMiddleware - attemptAutoLogin - error", err);
    return res.redirect("/emp/login"); // ✅ Ensure response is handled
  }
    */
};
