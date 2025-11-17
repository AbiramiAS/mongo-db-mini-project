import { userData } from "../model/users.js";
import bcrypt from "bcrypt";
import fsPromise from "fs/promises";
import path, { dirname } from "path";

const userDB = {
  users: userData,
  setUsers: function (data) {
    this.users = data;
  },
};

export const registerNewUser = async (req, res) => {
  const { username, password } = req.query;
  const existingUser = userDB.users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    "username": username,
    "roles": { User: 2001 },
    "password": hashedPassword,
  };
  userDB.setUsers([...userDB.users, newUser]);
  await fsPromise.writeFile(
    path.join(dirname.name, "..", "model", "users.js"),
    `export const userData = ${JSON.stringify(userDB.users, null, 2)};`
  );
  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
};

export default {
  registerNewUser,
};
