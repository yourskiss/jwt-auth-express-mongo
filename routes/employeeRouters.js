// routes/employeeRouters.js
import express from "express";
const router = express.Router();

import {
  registerRender, registerHandel,
  loginRender, loginHandel,
  refreshAccessToken,
  logoutHandal, logoutFromAll,
  dashboardRender, profileRender
} from "./../controllers/employeeController.js"
import { verifyToken, guestToken } from "./../middlewares/employeeMiddleware.js"

router.get("/register", guestToken, registerRender);
router.post("/register", guestToken, registerHandel);
router.get("/", guestToken, loginRender);
router.get("/login", guestToken, loginRender);
router.post("/login", guestToken, loginHandel);
 router.get("/refresh", refreshAccessToken);
router.get("/logout", logoutHandal);
router.get("/logout-all", logoutFromAll);
router.get("/dashboard", verifyToken, dashboardRender);
router.get("/profile", verifyToken, profileRender);

const employeeRoutes = router;
export default employeeRoutes;
