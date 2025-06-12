import React, { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai"; // Import the close icon
import { FaUserCircle } from "react-icons/fa"; // Import account logo
import { Card, CardContent, Typography, Box, Avatar, Divider, Grid, Stack } from "@mui/material";
import { styled } from "@mui/system";
import { FaEnvelope, FaPhone, FaBriefcase } from "react-icons/fa";

// Styled components for the dropdown
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: "auto",
  background: "linear-gradient(to left, #ffffff,rgb(193, 193, 193))",
  transition: "0.3s",
  border: "3px solid black", // Adds a 2px solid blue border
  borderRadius: "8px", // Optional: adds rounded corners for better aesthetics
  position: "relative", // Set position relative for absolute positioning of inner border
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)"
  },
  padding: "15px", // Padding for the inner content to create space for the inner border
  "::before": {
    content: '""', // Empty content for the pseudo-element
    position: "absolute",
    top: "6px", // 3px gap from top
    left: "6px", // 3px gap from left
    right: "6px", // 3px gap from right
    bottom: "6px", // 3px gap from bottom
    border: "3px solid red", // 2px blue border inside
    borderRadius: "8px", // Optional: keeps the rounded corners for the inner border
    pointerEvents: "none", // Prevents interaction with the pseudo-element
  }
}));



const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: "auto",
  marginBottom: 2,
  border: "4px solid #fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
}));

const InfoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 2,
  marginBottom: 1
}));

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manage dropdown state
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const dropdownRef = useRef(null); // Create a reference for the dropdown

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/logout", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Ensure cookies are sent
        });

        toast.success(response.data.message);

        // Clear token, cookies, and session storage
        localStorage.removeItem("token");
        sessionStorage.clear(); // Clear sessionStorage if any session data is stored
        document.cookie.split(";").forEach((cookie) => {
          document.cookie = cookie.trim().split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
        });

        // Update authorization state and redirect
        setIsAuthorized(false);
        navigateTo("/login");
      } catch (error) {
        toast.error(error.response.data.message);
        setIsAuthorized(false);
      }
    } else {
      toast.error("You are not logged in.");
      navigateTo("/login");
    }
  };

  // Close dropdown if click happens outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close the dropdown if click happens outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
      <div className="container">
        <div className="logo" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/pngegg.png" alt="logo" />
          <span style={{ fontWeight: "bold", fontSize: "24px", marginBottom: "9px", color: "white" }}>
            JobMatch
          </span>
        </div>

        {/* Navbar Menu */}
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
            <Link to={"/"} onClick={() => setShow(false)}>HOME</Link>
          </li>
          <li>
            <Link to={"/job/getall"} onClick={() => setShow(false)}>ALL JOBS</Link>
          </li>
          <li>
            <Link to={"/applications/me"} onClick={() => setShow(false)}>
              {user && user.role === "Employer" ? "APPLICANT'S APPLICATIONS" : "MY APPLICATIONS"}
            </Link>
          </li>
          {user && user.role === "Employer" && (
            <>
              <li>
                <Link to={"/job/post"} onClick={() => setShow(false)}>POST NEW JOB</Link>
              </li>
              <li>
                <Link to={"/job/me"} onClick={() => setShow(false)}>VIEW YOUR JOBS</Link>
              </li>
            </>
          )}

          {/* User Info and Dropdown */}
          {isAuthorized && user && (
            <div className="user-info" style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
              <div
                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown
              >
                <FaUserCircle size={30} color="red" />
                <div style={{ color: "red", fontSize: "16px", marginLeft: "10px" }}>
                  {user.name}
                </div>
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: "0",
                    zIndex: 1000,
                  }}
                >
                  <StyledCard elevation={3}>
                    <CardContent>
                      <Stack spacing={3} alignItems="center">
                        <Box textAlign="center">
                          {/* Use FaUserCircle as default avatar */}
                          <Avatar sx={{ width: 120, height: 120, bgcolor: "#f5f5f5" }}>
                            <FaUserCircle size={70} color="gray" />
                          </Avatar>
                          <Typography variant="h5" component="h1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                            {user.name}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {user.role}
                          </Typography>
                        </Box>

                        <Divider flexItem />

                        <Grid container spacing={2} sx={{ px: 2 }}>
                          <Grid item xs={12}>
                            <InfoContainer>
                              <FaEnvelope size={20} color="#666" />
                              <Typography variant="body1" sx={{ ml: 1 }}>{user.email}</Typography> {/* Added spacing */}
                            </InfoContainer>
                          </Grid>

                          <Grid item xs={12}>
                            <InfoContainer>
                              <FaPhone size={20} color="#666" />
                              <Typography variant="body1" sx={{ ml: 1 }}>{user.phone}</Typography> {/* Added spacing */}
                            </InfoContainer>
                          </Grid>

                          <Grid item xs={12}>
                            <InfoContainer>
                              <FaBriefcase size={20} color="#666" />
                              <Typography variant="body1" sx={{ ml: 1 }}>{user.role}</Typography> {/* Added spacing */}
                            </InfoContainer>
                          </Grid>
                        </Grid>

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          style={{
                            marginTop: "10px",
                            background: "#ff4c4c",
                            border: "none",
                            color: "#fff",
                            padding: "10px 15px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            width: "100%",
                            fontSize: "16px",
                            fontWeight: "bold",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff1a1a")}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4c4c")}
                        >
                          LOGOUT
                        </button>
                      </Stack>
                    </CardContent>
                  </StyledCard>
                </div>
              )}
            </div>
          )}
        </ul>

        {/* Hamburger Menu Icon */}
        <div className="hamburger" onClick={() => setShow(!show)}>
          {show ? <AiOutlineClose /> : <GiHamburgerMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
