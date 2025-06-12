import mongoose from "mongoose"; 

const dbConnection = () => {
  mongoose.connect(process.env.DB_URL, {
    dbName: "JobMatch",
  }).then(() => {
    console.log("MongoDB Connected");
  }).catch((error) => {
    console.error("Failed to connect:", error);
  });
};

export default dbConnection;
