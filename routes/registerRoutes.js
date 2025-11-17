import express from "express";
import { registerNewUser } from "../controllers/registerController.js";

const routes = express.Router();

routes.post("/", registerNewUser);

export default routes;