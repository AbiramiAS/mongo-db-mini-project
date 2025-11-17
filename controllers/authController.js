import { userData } from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fsPromise from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const userDB = {
  users: userData,
  setUsers: function (data) {
    this.users = data;
  },
};

export const getAllUserData = (req, res) => {
  res.json(userData);
};

export const authenticateUser = async (req, res) => {
  const { username, password } = req.query;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Both Username and password are required" });

  const loggedinUser = userData.find((user) => user.username === username);
  const matchFound = loggedinUser
    ? await bcrypt.compare(password, loggedinUser.password)
    : null;
  if (!matchFound) return res.status(401).json("Unauthorized Access");
  if (matchFound) {
    const userRole = loggedinUser != undefined ? Object.values(loggedinUser.roles) : null;
    const accessToken = jwt.sign(
      { "User Details" : { "username": loggedinUser.username, "roles": userRole } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "90s" }
    );
    const refreshToken = jwt.sign(
      { username: loggedinUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await fsPromise.writeFile(
      path.join(__dirname, "..", "model", "users.js"),
      `export const userData = ${JSON.stringify(userDB.users, null, 2)};`
    );
    userDB.setUsers(loggedinUser, refreshToken);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ message: "Authentication successful", Token: accessToken });
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default {
  authenticateUser,
  getAllUserData
};
