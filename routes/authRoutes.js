import express from "express";
import {
  authenticateUser,
  getAllUserData,
} from "../controllers/authController.js";

const router = express.Router();

router.route("/").post(authenticateUser).get(getAllUserData);

export default router;
