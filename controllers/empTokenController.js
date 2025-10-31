// controllers/empTokenController.js
import RefreshTokenModel from "../models/empTokenModel.js";
import {
  ACCESS_SECRET, REFRESH_SECRET,
  generateAT, generateRT,
  verifyAT, verifyRT,
  setATC, setRTC, getATC, getRTC, isATC, isRTC, removeATC, removeRTC,
  ACCESS_MS, REFRESH_MS,
  NODE_ENV, TOKEN_HTTP_ONLY, SAMESITE_COOKIES
} from "./../utils/tokenUtils.js";


// create new token
export async function tokenCreate(req, res, payload) {
  // Step 1: Generate Token
  const accessToken = generateAT(payload);
  const refreshToken = generateRT(payload);
  const ua = req.useragent || {};
  try {
      // Step 2: Insert new token
      const result = await RefreshTokenModel.create({
            employeeId: payload.employeeId,
            token: refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_MS),
            revoked: false, 
            revokedAt: null,
            replacedByToken:null,
            tokenType:'Create',
            userAgent : {
                at: new Date(),
                device: ua.isMobile ? 'Mobile' : ua.isTablet ? 'Tablet' : 'Desktop',
                platform: ua.platform,
                os: ua.os,
                browser: ua.browser,
                browserVersion: ua.version,
                ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.connection.remoteAddress
            }
      });
      if (!result) {
        // throw new Error("Token Not created");
        console.error(`Token Not created`);
      } else{
        // Step 3: Set Cookies
        setATC(res, accessToken);
        setRTC(res, refreshToken);
        console.log(`Token created`);
      }
  } catch (err) {
    // throw new Error(`Token creation failed`, err);
    console.error(`Token creation failed in login - ${err}`);
  }
}

 
export async function tokenRemoke(token, res) {
  try {
    // Step 1: Revoke the token in DB
    const result = await RefreshTokenModel.updateOne(
      { token: token },
      { revoked: true, revokedAt: new Date() }
    );

    if (result.modifiedCount === 0) {
      console.warn(`Token not revoked - token may not exist or is already revoked.`);
    } else {
      console.log(`Token revoked successfully.`);
    }
    // Step 2: Remove cookies
      removeATC(res);
      removeRTC(res);
      return res.redirect("/emp/login");

  } catch (err) {
    console.error(`Token revoke failed: ${err.message}`);
  }
}


export async function tokenAllRemoke(req, res) {
  const isRT = isRTC(req);
  const getRT = getRTC(req);
  if (!isRT) {
    console.error("No refresh token found in cookies");
    return res.redirect("/emp/login"); // Or send appropriate response
  }
  try {
    const payload = verifyRT(getRT); // Ensure this uses jwt.verify, not decode
    console.log("payload tokenAllRevoke -", payload);

    // Step 1: Revoke ALL refresh tokens for this employee
    const result = await RefreshTokenModel.updateMany(
      { employeeId: payload.employeeId },
      { $set: { revoked: true, revokedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      console.warn(`No tokens were revoked for employeeId: ${payload.employeeId}`);
    } else {
      console.log(`Revoked ${result.modifiedCount} tokens for employeeId: ${payload.employeeId}`);
    }
    // Step 2: Clear auth cookies
    removeATC(res);
    removeRTC(res);

    // Step 3: Redirect or respond
    return res.redirect("/emp/login"); // Or res.status(200).json({ message: "All sessions revoked" })

  } catch (err) {
    console.error("tokenAllRevoke error:", err.message);
    return res.redirect("/emp/login"); // Fallback redirect on failure
  }
}


 

export async function tokenRotate(req, res) {
  const isRT = isRTC(req);
  const getRT = getRTC(req);
  if (!isRT) {
    console.error("No refresh token found in cookies");
    return res.redirect("/emp/login");
   // return res.status(401).send("No refresh token found in cookies");
  }

  let payload = null;
  try {
    payload = verifyRT(getRT); // Must throw on invalid/expired
  } catch (err) {
    console.error("Invalid refresh token:", err.message);
    removeATC(res);
    removeRTC(res);
     return res.redirect("/emp/login");
    // return res.status(401).send("Invalid refresh token");
  }

  // Step 1: Fetch the old token record
  const existing = await RefreshTokenModel.findOne({ token: getRT });

  if (!existing) {
    console.error("Refresh token does not exist in DB");
    removeATC(res);
    removeRTC(res);
     return res.redirect("/emp/login");
   // return res.status(401).send("Invalid refresh token");
  }

  // Step 1b: Optional extra checks (uncomment if needed)
  if (existing.revoked) {
    console.error("Refresh token already revoked");
    removeATC(res);
    removeRTC(res);
     return res.redirect("/emp/login");
    // return res.status(401).send("Refresh token already revoked");
  }

  if (existing.expiresAt < new Date()) {
    console.error("Refresh token expired");
    removeATC(res);
    removeRTC(res);
     return res.redirect("/emp/login");
    // return res.status(401).send("Refresh token expired");
  }

  // Step 2: Generate new tokens
  const newAccessToken = generateAT(payload);
  const newRefreshToken = generateRT(payload);
  const ua = req.useragent || {};

  // Step 3: Revoke the old token
  existing.revoked = true;
  existing.revokedAt = new Date();
  existing.replacedByToken = newRefreshToken;
  await existing.save();
  
  // Step 4: Save the new refresh token
  try {
    const result = await RefreshTokenModel.create({
      employeeId: payload.employeeId,
      token: newRefreshToken, // 🔁 FIXED: was mistakenly storing old token before
      expiresAt: new Date(Date.now() + REFRESH_MS),
      revoked: false,
      revokedAt: null,
      replacedByToken: null,
      tokenType:'Rotate',
      userAgent: {
        at: new Date(),
        device: ua.isMobile ? 'Mobile' : ua.isTablet ? 'Tablet' : 'Desktop',
        platform: ua.platform,
        os: ua.os,
        browser: ua.browser,
        browserVersion: ua.version,
        ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.connection.remoteAddress
      }
    });

    if (!result) {
      console.error(`Token not created for employeeId: ${payload.employeeId}. Please try again`);
      removeATC(res);
      removeRTC(res);
      return res.redirect("/emp/login");
     // return res.status(500).send("Token creation failed");
    }

    // Step 5: Set new cookies
    setATC(res, newAccessToken);
    setRTC(res, newRefreshToken);
    console.log("Tokens rotated successfully for:", payload.employeeId);
    // return res.status(200).send("Token rotation successful");
    return res.redirect("/emp/dashboard");  

  } catch (err) {
    console.error(`${payload.employeeId} - Token creation failed: ${err.message}`);
    return res.status(500).send("Internal Server Error");
  }
}
