import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import roomRoutes from "./routes/roomRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/rooms", roomRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/roomdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("Server Error");
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
