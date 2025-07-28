import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

// Routes
import authRoutes from "./routes/authRoute";
import workspaceRoutes from "./routes/workspaceRoutes";
import taskRoutes from "./routes/taskRoutes"

const app = express();

// Middleware
app.use(express.json());

// Adding Cors
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:8080", "http://localhost:8080/socket.io"];
console.log(allowedOrigins)

app.use(
  cors({
    origin: allowedOrigins, // Allow requests from this origin
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"], // Allowed methods
    credentials: true, // If you need cookies or auth headers
  })
);

// Sample Route: Test Database Connection
app.get("/", (req, res) => {
  res.status(200).send({
    MSG: "Everything is working fine!",
  });
});

// Health Route
app.get("/health", (req, res) => {
    res.status(200).json({
        msg: "Your backend is running."
    })
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/tasks", taskRoutes);




// Export app for use in index.ts
export default app;