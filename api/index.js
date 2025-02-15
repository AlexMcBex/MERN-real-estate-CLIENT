import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
dotenv.config();
import path from "path";

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("=== Connected to MongoDB ===");
  })
  .catch((err) => {
    console.log(`!!! ${err} !!!`);
  });


const __dirname = path.resolve()


const app = express();
// express.json turns undefined info to json format info
app.use(express.json());

app.use(cookieParser())

app.listen(3000, () => {
  console.log("=== Server running on port 3000 ===");
});

// API User Route
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);


// AFTER api routes
app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client', 'dist', 'index.html'))
})

// middleware for error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
