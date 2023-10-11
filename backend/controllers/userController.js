const User = require("../models/userModel");
const ResetToken = require("../models/resetTokenModel");
const sendEmail = require("../utils/sendEmail");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields.");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters.");
  }

  //Check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been used.");
  }

  //Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //Generate Token
  const token = generateToken(user._id);

  //Send HTTP-only cookie
  //-The first argument is the name of the cookie
  //-The second argument is the value of your cookie
  //-The third argument is describe how we are going to save our cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1 day
    sameSite: "none", //-This means that our front end and back end can have different URLs.
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password.");
  }

  //Check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found, please sign up.");
  }

  //User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //Generate Token
  const token = generateToken(user._id);

  if (passwordIsCorrect) {
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
  }

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email and password");
  }
});

//Logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "Successfully logged out.",
  });
});

//Get a single User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Get login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  //verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  }
});

//Update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user_id);
  if (user) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        ...req.body,
      }
    ).select("-password");
    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(404);
    throw new Error("User not found, please sign up.");
  }

  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old password and new password.");
  }

  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password change successfully.");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

//Send reset email
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Email does not exist");
  }

  //Check if the old reset token exists, and delete it.
  let oldResetToken = await ResetToken.findOne({
    userId: user._id,
  });
  if (oldResetToken) {
    await ResetToken.deleteOne();
  }

  //resetToken String
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  //Hashed resetToken
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //save the resetToken to the database
  await new ResetToken({
    userId: user._id,
    token: hashedResetToken,
    createAt: Data.now(),
    expiresAt: Data.now() + 30 * (60 * 1000), //30 minutes
  }).save();

  //reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  //reset Email
  const message = `
  <h2>Hello ${user.name} </h2>
    <p>Please use the url below to reset your password</p>
    <p>This reset link is valid for only 30 minutes</p>
    // it's all about tracking user clicks
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards....</p>
    <p>eInvent Team</p>
  `;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset email sent" });
  } catch (err) {
    res.status(500);
    throw new Error("Email not sent, please try again.");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const userToken = await ResetToken.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  const user = await User.findOne({
    _id: userToken.userId,
  });

  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password reset successfully, please login.",
  });

  //delete the token that is stored in DB
  if (userToken) {
    await userToken.deleteOne();
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
