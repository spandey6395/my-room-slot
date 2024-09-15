import express from "express";
import { createRoom, searchRoom } from "../controllers/roomController.js";

const router = express.Router();

// Route to create a new room
router.post("/create", createRoom);

// Route to search for rooms by features or roomId
router.get("/search", searchRoom);

export default router;
