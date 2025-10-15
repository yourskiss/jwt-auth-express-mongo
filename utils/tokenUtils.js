import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN;

// Helper: sign tokens
export const generateAccessToken = (payload) =>  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
export const generateRefreshToken = (payload) =>  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

// Verify tokens
export const verifyAccessToken = (token) =>  jwt.verify(token, ACCESS_SECRET);
export const verifyRefreshToken = (token) =>  jwt.verify(token, REFRESH_SECRET);

export const decodedToken = (token) => jwt.verify(token, REFRESH_SECRET);

// Convert "7d" → milliseconds
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
export const NODE_ENV = process.env.NODE_ENV;
export const TOKEN_HTTP_ONLY = process.env.TOKEN_HTTP_ONLY;
export const SAMESITE_COOKIES = process.env.SAMESITE_COOKIES;