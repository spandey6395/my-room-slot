import Room from "../models/room.js";

// // Search for rooms based on features or roomId

export const searchRoom = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Build a query that searches across multiple fields (username, mobile, roomId, features)
    const query = {
      $or: [
        { username: { $regex: search, $options: "i" } }, // Case-insensitive search
        // { mobile: { $regex: search, $options: "i" } }, // Case-insensitive search
        { roomId: { $regex: search, $options: "i" } }, // Case-insensitive search
        // { features: { $in: [search] } }, // Features as an arra
        { features: { $elemMatch: { $regex: new RegExp(search, "i") } } },
      ],
    };

    // Find rooms based on the constructed query
    const rooms = await Room.find(query);

    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }

    // Remove duplicate rooms based on roomId
    const uniqueRooms = rooms.filter(
      (room, index, self) =>
        index === self.findIndex((r) => r._doc.roomId === room._doc.roomId)
    );

    return res.status(200).json({ rooms: uniqueRooms });
  } catch (error) {
    console.error("Error searching rooms:", error.message);
    return res
      .status(500)
      .json({ error: "Server error while searching rooms" });
  }
};

const convertToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to check for time conflicts
const isTimeConflict = (newStart, newEnd, existingStart, existingEnd) => {
  const newStartMinutes = convertToMinutes(newStart);
  const newEndMinutes = convertToMinutes(newEnd);
  const existingStartMinutes = convertToMinutes(existingStart);
  const existingEndMinutes = convertToMinutes(existingEnd);

  return (
    newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes
  );
};

// Create a new Room Booking with Date and Time Slots
export const createRoom = async (req, res) => {
  try {
    const {
      capacity,
      features,
      username,
      mobile,
      date,
      startTime,
      endTime,
      roomId,
    } = req.body;

    // Check if any existing booking conflicts with the new booking on the same date
    const existingBookings = await Room.find({ roomId, date });

    for (let booking of existingBookings) {
      if (
        isTimeConflict(startTime, endTime, booking.startTime, booking.endTime)
      ) {
        return res.status(400).json({
          error: `The room is already booked from ${booking.startTime} to ${booking.endTime} on this date.`,
        });
      }
    }

    // Create new room booking if no conflicts
    const newRoom = new Room({
      capacity,
      features,
      username,
      mobile,
      date,
      startTime,
      endTime,
      roomId,
    });
    await newRoom.save();

    return res
      .status(201)
      .json({ message: "Room booked successfully", room: newRoom });
  } catch (error) {
    console.error("Error creating room:", error.message);
    return res.status(500).json({ error: "Server error while creating room" });
  }
};
