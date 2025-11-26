import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contacts.js";
import favoriteRoutes from "./routes/favorites.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://phonebookapp-frontend.onrender.com",
    /\.onrender\.com$/,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/favorites", favoriteRoutes);

// API info route
app.get("/api", (req, res) => {
  res.json({
    message: "Phonebook API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth (POST /register, POST /login, GET /me)",
      contacts: "/api/contacts (GET, POST, PUT, DELETE)",
      favorites: "/api/favorites (GET, POST, DELETE)",
    },
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Phonebook API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      contacts: "/api/contacts",
      favorites: "/api/favorites",
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;

app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});
