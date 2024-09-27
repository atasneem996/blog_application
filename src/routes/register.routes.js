import { Router } from "express";

const router = Router();

import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

router.post("/register", registerUser);

router.post("/login", loginUser);

// Secured routes
router.post("/logout", verifyJWT, logoutUser);
export default router;
