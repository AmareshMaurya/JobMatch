import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import bg from "/loginbg.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  
  // Get context values
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending login request to backend
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Fetch user data after login
      const userResponse = await axios.get("http://localhost:4000/api/v1/user/getuser", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        withCredentials: true,
      });

      // Update context with user data
      setUser(userResponse.data.user);
      setIsAuthorized(true);  // Set the state to true after successful login

      // Reset form fields
      setEmail("");
      setPassword("");
      setRole("");

      toast.success("Logged in successfully!");

      // Directly navigate to the home page after successful login
      return <Navigate to="/" />; // Redirect to home page
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // If the user is already authorized, redirect to home
  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <section 
        className="authPage" 
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh", // Ensure it covers the full viewport height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="container" style={{ marginLeft:"30px",maxWidth: "400px", padding: "20px", backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px" }}>
          <div className="header">
            <h3>Login to your account</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Login As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Employer">Employer</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" onClick={handleLogin}>
              Login
            </button>
            <Link to={"/register"}>Register Now</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/login.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Login;
