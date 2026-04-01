require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

// Health Check for Render
app.get("/healthz", (req, res) => res.sendStatus(200));

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to serve
}));

// Better CORS config
const corsOptions = {
  origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Security Check
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", limiter);

// Ensure uploads folder exists
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Static folder for uploaded images
app.use("/uploads", express.static(uploadsPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/mini-social")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
