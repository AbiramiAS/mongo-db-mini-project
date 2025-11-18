import UserData from "../model/users.js";
import jwt from "jsonwebtoken";

export const getRefreshToken = async (req, res) => {
  const cookies = req.cookies;
;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const existingUser = await UserData.findOne(
    { refreshToken }).exec();

  if (!existingUser) return res.sendStatus(403);

  //JWT token verification
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || existingUser.username !== decoded.username)
      return res.sendStatus(403);
    const userRoles = Object.values(existingUser.roles);
    const accessToken = jwt.sign(
      { "User Details": { username: existingUser.username, roles: userRoles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "90s" }
    );
    res.json({userRoles, accessToken });
  });
};
export default getRefreshToken;
