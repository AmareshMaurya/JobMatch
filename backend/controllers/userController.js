import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// Register user
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill in the full form!"));
  }

  // Check if the email is already registered
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }

  // Create and save the new user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  // Send JWT token and respond with success
  sendToken(user, 201, res, "User Registered Successfully!");
});

// Fetch all users from the database without any restrictions
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  // Fetch all users from the database
  const users = await User.find();  
  
  // Check if users were found
  if (!users || users.length === 0) {
    return next(new ErrorHandler("No users found!", 404));
  }

  // Respond with the list of users
  res.status(200).json({
    success: true,
    users,
  });
});

// Add new user
export const addUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill in the full form!"));
  }

  // Check if the email is already registered
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }

  // Create and save the new user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    message: "User added successfully!",
    user,
  });
});

// Delete user
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  console.log("Attempting to delete user with ID:", userId);  // Log the userId to confirm

  // Find the user and delete them
  const user = await User.findByIdAndDelete(userId);
  
  if (!user) {
    console.error("User not found with ID:", userId);  // Additional error log to diagnose
    return next(new ErrorHandler("User not found!", 404));  // Handle case where user doesn't exist
  }

  console.log("User deleted:", user);  // Log successful deletion
  res.status(200).json({
    success: true,
    message: "User deleted successfully!",
  });
});

// User login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role!"));
  }

  // Find the user by email and select the password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  // Compare entered password with stored password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  // Check if the user's role matches the one requested (can be 'admin', 'job_seeker', 'employer')
  if (user.role !== role) {
    return next(new ErrorHandler(`Invalid role! You are a ${user.role}`, 403));
  }

  // Send JWT token and respond with success
  sendToken(user, 200, res, `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Logged In Successfully!`);
});

// Logout user
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully!",
    });
});

// Get logged-in user details
// In userController.js
export const getUser = catchAsyncErrors((req, res, next) => {
  console.log("getUser route hit"); // Log to check if the route is being executed
  const user = req.user;
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});


export const fetchUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id); // Assuming `req.user` is set after authentication
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }
  res.status(200).json({ user });
});
