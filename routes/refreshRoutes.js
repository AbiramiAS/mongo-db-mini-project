import express from "express";
import { getRefreshToken } from "../controllers/refreshController.js";

const refreshRoutes = express.Router();

refreshRoutes.get("/", getRefreshToken);

export default refreshRoutes