import express from "express";
import cors from "cors";
import { initDB } from "./src/models/db.js";
import { validateFields, isAdmin } from "./src/middleware/middleware.js";
import {
  registerUser,
  loginUser,
  addEquipment,
  addItem,
  addRoom,
  getRooms,
  getSchedule,
  bookRoom,
  cancelBooking,
  getItems,
  getQueue,
  getLoans,
  sendNotification,
  getNotifications,
  markNotificationsAsRead,
  updateBookingStatus,
  getSettings,
  updateSettings,
} from "./src/routes/userRoutes.js";

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

initDB();

app.post(
  "/register",
  validateFields(["name", "username", "phone", "password"]),
  registerUser
);
app.post("/login", validateFields(["username", "password"]), loginUser);
app.post("/admin/equipment", isAdmin, addEquipment);
app.post("/admin/items", isAdmin, addItem);
app.post("/admin/rooms", isAdmin, addRoom);
app.get("/rooms", getRooms);
app.get("/schedule", getSchedule);
app.post(
  "/book",
  validateFields(["user_id", "room_id", "start_time", "end_time"]),
  bookRoom
);
app.post("/cancel", validateFields(["booking_id"]), cancelBooking);
app.get("/items", getItems);
app.get("/queue/:itemId", getQueue);
app.get("/loans/:userId", getLoans);
app.get("/notifications/:userId", getNotifications);
app.put("/notifications/read/:userId", markNotificationsAsRead);
app.put("/bookings/update-status", updateBookingStatus);
app.get("/settings/:userId", getSettings);
app.put("/settings/:userId", updateSettings);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
