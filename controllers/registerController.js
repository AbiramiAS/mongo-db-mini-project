import UserData from "../model/users.js";
import bcrypt from "bcrypt";

export const registerNewUser = async (req, res) => {
  const { username, password } = req.query;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Both Username and password are required." });
  const existingUser = await UserData.findOne({ username: username }).exec();
  console.log("existingUser", existingUser);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserData.create({
    "username": username,
    "roles": { User: 2001 },
    "password": hashedPassword
  });

  res
    .status(201)
    .json({ message: "New User registered successfully", user: newUser });
};

export default {
  registerNewUser,
};
