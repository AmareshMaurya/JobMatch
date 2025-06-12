import express from "express";
import { login, register, logout, getUser, getAllUsers, addUser, deleteUser } from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login); // Admin login route
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);

// Protect the '/admin/users' route with the 'isAdmin' middleware
router.get("/admin/users", isAuthenticated, isAdmin, getAllUsers);  // Admin-only route
router.post("/admin/users", isAuthenticated, isAdmin, addUser); // Add user route
router.delete("/admin/users/:id", deleteUser); // Delete user route

export default router;
