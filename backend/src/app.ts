import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Adding Cors
const allowedOrigins = process.env.CORS_ORIGIN!.split(",");

app.use(
  cors({
    origin: allowedOrigins, // Allow requests from this origin
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"], // Allowed methods
    credentials: true, // If you need cookies or auth headers
  })
);

// Sample Route: Test Database Connection
app.get("/", (req, res) => {
  res.status(200).send({
    MSG: "Everything is working fine!",
  });
});

// API Calls

// Health Route
app.get("/health", (req, res) => {
    res.status(200).json({
        msg: "Your backend is running."
    })
})


// Export app for use in index.ts
export default app;