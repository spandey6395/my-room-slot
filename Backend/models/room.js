import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  capacity: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // We'll store time in 'HH:mm' format
    required: true,
  },
  endTime: {
    type: String, // We'll store time in 'HH:mm' format
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
