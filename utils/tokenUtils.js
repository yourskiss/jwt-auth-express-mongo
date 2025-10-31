// utils/tokenUtils.js
import jwt from "jsonwebtoken";

export const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRES_IN;
export const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN;
export const NODE_ENV = process.env.NODE_ENV;
export const TOKEN_HTTP_ONLY = process.env.TOKEN_HTTP_ONLY;
export const SAMESITE_COOKIES = process.env.SAMESITE_COOKIES;


const sanitizePayload = (payload) => {
  const clean = { ...payload };
  delete clean.exp;
  delete clean.iat;
  return clean;
};

// sign tokens
export const generateAT = (payload) =>  jwt.sign(sanitizePayload(payload), ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
export const generateRT = (payload) =>  jwt.sign(sanitizePayload(payload), REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

// Verify tokens
 export const verifyAT = (token) =>  jwt.verify(token, ACCESS_SECRET);
 export const verifyRT = (token) =>  jwt.verify(token, REFRESH_SECRET);

// set token in cookies 
export const setATC = (res, token) => res.cookie("accessToken", token, {
              httpOnly: TOKEN_HTTP_ONLY,
              secure: NODE_ENV === "production",
              sameSite: SAMESITE_COOKIES,
              maxAge: ACCESS_MS,
});
export const setRTC = (res,token) => res.cookie("refreshToken", token, {
              httpOnly: TOKEN_HTTP_ONLY,
              secure: NODE_ENV === "production",
              sameSite: SAMESITE_COOKIES,
              maxAge: REFRESH_MS,
});

// get token from cookies
export const getATC = (req) => req.cookies.accessToken || null;
export const getRTC = (req) => req.cookies.refreshToken || null;

export const isATC = (req) => !!req.cookies.accessToken;
export const isRTC = (req) => !!req.cookies.refreshToken;

// remove token from cookies  
export const removeATC = (res) => res.clearCookie("accessToken");
export const removeRTC = (res) => res.clearCookie("refreshToken");



// Convert → milliseconds
export const expiryToMs = (value) => {
  const match = /^(\d+)([smhd])?$/.exec(value);
  const num = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case "m": return num * 60 * 1000;
    case "h": return num * 60 * 60 * 1000;
    case "d": return num * 24 * 60 * 60 * 1000;
    default: return num * 1000;
  }
};
export const ACCESS_MS = expiryToMs(ACCESS_EXPIRY);
export const REFRESH_MS = expiryToMs(REFRESH_EXPIRY);
