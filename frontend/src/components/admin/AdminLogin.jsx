import React, { useState, useEffect } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useTheme } from "@mui/material/styles";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import logo from "/careerconnect-white.png"; // Import the logo image

const adminSignIn = async (formData) => {
  try {
    const response = await axios.post("http://localhost:4000/api/v1/user/login", formData, {
      headers: {
        "Content-Type": "application/json", // Ensure proper content type
      },
    });

    // Log the response to debug
    console.log(response);

    return response.data; // Return the response data (including token)
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export default function AdminLogin({ authenticateAdmin }) {
  const [email, setEmail] = useState(""); // Email for login
  const [password, setPassword] = useState(""); // Password for login
  const theme = useTheme();
  const navigate = useNavigate(); // Use the navigate hook to redirect after login

  const handleLogin = (e) => {
    e.preventDefault();

    const formData = {
      email: email, // Email used for login
      password: password,
      role: "admin", // Role set to 'admin' for admin login
    };

    adminSignIn(formData)
      .then((data) => {
        // Log the data to debug
        console.log("Login successful:", data);

        // Ensure we only authenticate if we have a token
        if (data.token) {
          authenticateAdmin(data.token); // Pass the token to authenticateAdmin

          // Store the token in localStorage for persistence
          localStorage.setItem("adminToken", data.token);

          // Redirect to admin panel
          navigate("/admin/panel"); // Redirect to the admin panel
        } else {
          console.error("No token received in response.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error.message);
        // Display an error message to the user if needed
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/panel"); // Redirect to the admin panel if logged in
    }
  }, [navigate]);

  return (
    <AppProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          background: "linear-gradient(180deg, #E4F3E3 0%, #5CA9E9 100%)", // Gradient background
        }}
      >
        <img
          src={logo}
          alt="Career Connect Logo"
          style={{ maxWidth: "200px", marginBottom: "20px" }} // Adjust size and margin
        />

        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Admin Login
        </Typography>

        <form onSubmit={handleLogin} style={{ width: "300px" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email} // Binding the email value
            onChange={(e) => setEmail(e.target.value)} // Handling change for email
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password} // Binding the password value
            onChange={(e) => setPassword(e.target.value)} // Handling change for password
            sx={{ marginBottom: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    </AppProvider>
  );
}
