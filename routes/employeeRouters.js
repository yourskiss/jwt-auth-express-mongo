// routes/employeeRouters.js
import express from "express";
const router = express.Router();

import {
  registerRender, registerHandel,
  loginRender, loginHandel,
  refreshAccessToken,
  logoutEmployee,
  dashboardRender, profileRender
} from "./../controllers/employeeController.js"

import { verifyToken, guestToken } from "./../middlewares/employeeMiddleware.js"

router.get("/register", guestToken, registerRender);
router.post("/register", guestToken, registerHandel);
router.get("/login", guestToken, loginRender);
router.post("/login", guestToken, loginHandel);
router.get("/refresh", refreshAccessToken);
router.get("/logout", logoutEmployee);
router.get("/dashboard", verifyToken, dashboardRender);
router.get("/profile", verifyToken, profileRender);

const employeeRoutes = router;
export default employeeRoutes;
