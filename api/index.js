import textroute from "./routes/text.js";
import userroute from "./routes/user.js";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express();
dotenv.config();
const mongoconnect = async () => {
  try {
    await mongoose.connect(process.env.MongoUrl);
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
};

app.use(cors());
app.use(fileUpload());
app.use(express.json());

app.use("/api/text", textroute);
app.use("/api/auth", userroute);
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
app.listen(4000, () => {
  mongoconnect();
  console.log("Servers up");
});
