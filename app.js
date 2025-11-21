require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// Normalize helper: remove trailing slash if present
const normalizeOrigin = (u) =>
  typeof u === "string" ? u.replace(/\/+$/, "") : u;

// Build allowed origins, normalize them, filter falsy
const allowedOrigins = [
  "http://localhost:5174",
  "https://personal-task-manager-three-ivory.vercel.app",
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .map(normalizeOrigin);

// Optional: log the allowed origins for debugging (remove in production if you want)
console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      } else {
        console.log(
          `CORS blocked origin: ${origin} (normalized: ${normalizedOrigin})`
        );
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    // allow common headers (optional if you set them elsewhere)
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Make sure preflight requests get handled
app.options("*", cors());

app.use(express.json());

const taskRoute = require("./routes/taskRoute");
app.use("/api/tasks", taskRoute);

const Start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

Start();
