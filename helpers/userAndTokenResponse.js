import jwt from 'jsonwebtoken';
import * as config from "../config/config.js";

const userAndTokenResponse = (req, res, user) => {
  // Generate an access token (expires in 4 hours)
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "4h" });

  // Generate a refresh token (expires in 7 days)
  const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });

  // Hide sensitive data
  user.password = undefined;
  user.resetCode = undefined;

  // Return the user object, access token, and refresh token
  return res.status(200).json({
    user,
    token,
    refreshToken,
  });
}

export default userAndTokenResponse;
