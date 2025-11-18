import UserData from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export const getAllUserData = async(req, res) => {
   const user = await UserData.find();
    if (!user) return res.status(204).json({ 'message': 'No data found.' });
    res.json(user);
};

export const authenticateUser = async (req, res) => {
  const { username, password } = req.query;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Both Username and password are required" });

  const loggedinUser = await UserData.findOne({ username: username });
  console.log("loggedinUser---", loggedinUser);
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
