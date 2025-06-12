import app from "./app.js";
import cloudinary from "cloudinary";
import { config } from "dotenv"; 

// Load environment variables from .env
config(); 

// Log the Cloudinary environment variables to debug
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if Cloudinary was configured successfully
cloudinary.v2.api.ping((error, result) => {
  if (error) {
    console.error("Cloudinary connection failed:", error);
  } else {
    console.log("Cloudinary connected successfully:", result);
  }
});

// Export the Express app as a serverless function (Vercel's requirement)
export default (req, res) => {
  app(req, res); // Pass the request and response to the Express app
};
