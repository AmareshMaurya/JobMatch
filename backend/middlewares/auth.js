import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Middleware to check if user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  console.log("Received token:", token); // Log the token
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log token verification errors
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});




// In your auth.js middleware
// In your auth.js middleware
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();  // Proceed if the user is an admin
  }
  return res.status(403).json({ message: "Access denied" });  // Forbidden for non-admin users
};

