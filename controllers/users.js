import User from "../models/users.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import userAndTokenResponse from "../helpers/userAndTokenResponse.js";
import { nanoid } from "nanoid";
import validator from "email-validator";
import emailTemplate from "../helpers/email.js";
import { SendVerificationLink} from "../middlewares/Email.js";
import bcrypt from "bcrypt";
import * as config from "../config/config.js"
/* Create New User Account = POST /api/v1/users/signup */


export const preSignup = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Email validation
  if (!validator.validate(email)) {
    return res.json({ error: "A valid email address is required" });
  }

  // Password validations
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{5,30}$/;
  if (!password) {
    return res.json({ error: "Password is required" });
  }
  if (password.length < 5 || password.length > 30) {
    return res.json({ error: "Password should be between 5 and 30 characters long" });
  }
  if (!passwordRegex.test(password)) {
    return res.json({
      error:
        "Password must contain at least one capital letter, one number, and one special character (excluding comma and period)",
    });
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({
      error: "This email is already taken, please choose a different email address",
    });
  }

  // Generate a unique username
  const username = `${email.split("@")[0]}_${Date.now()}`;

  // Hash password before sending email
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a token for verification link
  const token = jwt.sign({ email, password: hashedPassword }, process.env.JWT_SECRET, {
    expiresIn: "4h",
  });

  try {
    // Send verification link with the token
    const verificationLink = `http://localhost:8080/api/v1/users/signup?token=${token}`;
    await SendVerificationLink(email, verificationLink);

    return res.json({
      success: true,
      message: "Verification link has been sent to your email address",
      username, // Return the generated username
    });
  } catch (error) {
    console.error("Error sending verification link:", error);
    return res.json({ error: "Failed to send verification link" });
  }
});


/* Signup decode credentails & save user = POST /api/v1/users/signup */

export const signup = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Decode the token to get email and password
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, password } = decoded;

    // Check if the user already exists (to prevent overwriting existing users)
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already verified or exists" });
    }

    // Save the user only after verification
    const newUser = new User({
      username: `${email.split("@")[0]}_${Date.now()}`, // Dynamically generated username
      email,
      password,  // Use the decoded password (hashed)
      isVerified: true,  // Mark the user as verified
    });

    // Save the new user to the database
    await newUser.save();

    // Redirect to the dashboard or show success
    return res.redirect('http://localhost:3000/dashboard'); // Redirect to your activation page or dashboard

  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};


/* Login with Credentials = POST /api/v1/users/login */



// export const login = asyncHandler(async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // Ensure both email and password are provided
//     if (!email || !password) {
//       return res.status(400).json({ error: "Both fields are required" });
//     }

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "User not found with provided email" });
//     }

//     // Debug logs
//     console.log("Entered Password:", password);
//     console.log("Stored Password Hash:", user.password);

//     // Compare passwords
//     const isMatch = await user.matchPasswords(password);
//     console.log("Password Match Result:", isMatch);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Password is incorrect" });
//     }

//     // Bypass status check to allow login even if status is false
//      if (user.status) {
//       return res.status(403).json({ error: "Your account is blocked. Contact admin" });
//     }

//     // Generate and send token (You can implement a token generation here)
//     userAndTokenResponse(req, res, user);

//   } catch (err) {
//     console.error("Login Error:", err);
//     return res.status(500).json({ error: "Something went wrong... Try again" });
//   }
// });

export const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Both fields required
    if (!email || !password) {
      return res.status(400).json({ error: "Both fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found with provided email" });
    }

    // Compare passwords
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Password is incorrect" });
    }

    // Account status check
    if (user.status) {
      return res.status(403).json({ error: "Your account is blocked. Contact admin." });
    }

    // Send success response
    userAndTokenResponse(req, res, user);
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Something went wrong... Try again." });
  }
});




// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     /* 1. Email is required */
//     if (!email) {
//       return res.json({ error: "Email is required" });
//     }

//     /* 2. find user with provided email */
//     const user = await User.findOne({ email });
//     if (!user) {
//       res.json({
//         error: `Could not find user with that email:${email}`,
//       });
//     } else {
//       /* 3. Generate a random reset code and save it to the database */
//       const resetCode = nanoid();
//       user.resetCode = resetCode;
//       user.save();
//       /* 4. Generate a token based on reset code */
//       const token = jwt.sign({ resetCode }, process.env.JWT_SECRET, {
//         expiresIn: "1h",
//       });
//       /* 5. Send clickable link this token based on reset code to email address */
//       config.AWSSES.sendEmail(
//         emailTemplate(
//           email,
//           `
//       <h3> Reset Password Link </h3> 
//       <p> Please click the link below to Access your account. </p>
//       <a style='color: orange; font-weight: bold' href='${config.CLIENT_URL}/User/access-account/${token}'> Access my account </a> 
//       `,
//           config.REPLY_TO,
//           "Using this Reset link to Access your Account"
//         ),
//         (err, data) => {
//           if (err) {
//             console.log(err);
//             res.status(500).json({ ok: false });
//           } else {
//             console.log(data);
//             res.status(200).json({ ok: true });
//           }
//         }
//       );
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       error: "Something went wrong... Try again",
//     });
//   }
// };


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Email is required
    if (!email) {
      return res.json({ error: "Email is required" });
    }

    // 2. Find user with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: `Could not find user with that email: ${email}`,
      });
    }

    // 3. Generate a random reset code and save it to the database
    const resetCode = nanoid();
    user.resetCode = resetCode;
    await user.save();

    // 4. Generate a token based on the reset code
    const token = jwt.sign({ resetCode }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // 5. Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Use Gmail or another email service
      auth: {
        user:" sa0071429@gmail.com",  // Your email
        pass: "sidq yasf mmvm bqss",  // Your email password or app-specific password
      },
    });

    // 6. Send the reset link to the user's email
    const mailOptions = {
      from: "sa0071429@gmail.com",
      to: email,
      subject: 'Reset Password Link',
      html: `
        <h3> Reset Password Link </h3> 
        <p> Please click the link below to Access your account. </p>
        <a style='color: orange; font-weight: bold' href='${config.CLIENT_URL}/User/access-account/${token}'> Access my account </a> 
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ ok: false, message: 'Error sending email' });
      } else {
        console.log(info);
        return res.status(200).json({ ok: true, message: 'Password reset link sent!' });
      }
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong... Try again",
    });
  }
};

/* Access Account after forgetting pasword */
export const accessAccount = async (req, res) => {
  try {
    /* 1. grab the token (resetCode) & verify with jwt */
    const { resetCode } = jwt.verify(req.body.resetCode, process.env.JWT_SECRET);
    /* 2. query database to find the user matching resetCode & udpate it */
    const user = await User.findOneAndUpdate({ resetCode }, { resetCode: "" });
    /* 3.generate the token & refresh token & send user */
    console.log(user);

    userAndTokenResponse(req, res, user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong... Try again",
    });
  }
};

export const loggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    res.json({ error: "UnUserorized User" });
  }
};

/* Public Profile  */
export const userProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    user.password = undefined;
    user.resetCode = undefined;
    res.status(200).json({
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: `This User ${req.params.username} not found` });
  }
};

/* Update User Password (logged user only)  */


export const updatePassword = async (req, res) => {
  try {
    /* 1. Take User Old and New password */
    const { oldPassword, newPassword } = req.body;

    //2. Password validations
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{5,30}$/;

    if (!oldPassword || !newPassword) {
      return res.json({ error: "Both old and new passwords are required" });
    }

    if (newPassword.length < 5 || newPassword.length > 30) {
      return res.json({ error: "Password should be between 5 and 30 characters long" });
    }

    if (oldPassword == newPassword) {
      return res.json({ error: "Old and New Password should not be same" });
    }

    // 3. Find the user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.json({ error: "User not found" });
    }

    // 3. Check if the old password matches with stored db password
    const isMatch = await user.matchPasswords(oldPassword);

    if (!isMatch) {
      return res.json({ error: "Old password is incorrect" });
    }

    if (!passwordRegex.test(newPassword)) {
      return res.json({
        error:
          "Password must contain at least one capital letter, one number, and one special character (excluding comma and period)",
      });
    }

    // 4. Hash the new password and save it
    // This will trigger the 'pre-save' middleware for hashing
    user.password = newPassword;
    await user.save();

    res.json({ ok: true, message: "Your password has been changed" });
  } catch (err) {
    res.json({ error: "An error occurred while updating the password" });
  }
};


/* Update User Porfile (logged user only)  */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    user.password = undefined;
    user.resetCode = undefined;
    res.json({ data: user });
  } catch (err) {
    console.log(err);
    if (err.codeName === "DuplicateKey") {
      return res.json({ error: `Username or Email is already taken please chose different` });
    } else {
      return res.json({ error: "Un-Authorized User" });
    }
  }
};



















