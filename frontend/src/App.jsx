import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; // Import Navigate for redirection
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import AdminLogin from "./components/admin/AdminLogin";
import AdminPanel from "./components/admin/adminpanel"; // Updated import for Admin Panel

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // To handle admin authentication

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get("http://localhost:4000/api/v1/user/getuser", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
          setUser(response.data.user);
          setIsAuthorized(true);
        } catch (error) {
          setIsAuthorized(false);
        }
      };
      fetchUser();
    }
  }, []);  // Only run once when the component mounts
    // Fetch user data only once when the component mounts
  
  
   // Fetch user data only once when the component mounts

  // Handle admin login authentication
  const authenticateAdmin = (token) => {
    // Store token in local storage (or context/state)
    localStorage.setItem("adminToken", token);
    setIsAdminAuthenticated(true);
  };

  // Check if token exists for authentication (on page reload or refresh)
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        {/* Only display Navbar and Footer for non-admin and non-login routes */}
        {window.location.pathname !== "/admin/panel" && window.location.pathname !== "/admin/login" && <Navbar />}

        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main Application Routes */}
          <Route path="/" element={isAuthorized ? <Home /> : <Navigate to="/login" />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />

          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={<AdminLogin authenticateAdmin={authenticateAdmin} />}
          />
          
          {/* Redirect automatically to admin panel if authenticated */}
          <Route
            path="/admin/panel"
            element={
              isAdminAuthenticated ? (
                <AdminPanel />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Only display Footer for non-admin and non-login routes */}
        {window.location.pathname !== "/admin/panel" && window.location.pathname !== "/admin/login" && <Footer />}

        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
