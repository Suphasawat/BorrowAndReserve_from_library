import express from "express";
import cors from "cors";
import { initDB } from "./src/models/db.js";
import { validateFields, isAdmin } from "./src/middleware/middleware.js";
import {
  registerUser,
  loginUser,
  addEquipment,
  room_avaible,
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
app.get("/room_avaible", room_avaible);
app.post("/admin/equipment", [isAdmin, validateFields(["equipment_name", "total_quantity"])], addEquipment);
app.post("/admin/items", [isAdmin, validateFields(["name", "description", "total_quantity"])], addItem);
app.post("/admin/rooms", [isAdmin, validateFields(["room_name", "capacity"])], addRoom);
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
app.put(
  "/notifications/read/:userId",
  validateFields(["userId"]),
  markNotificationsAsRead
);
app.put(
  "/bookings/update-status",
  validateFields(["booking_id", "new_status"]),
  updateBookingStatus
);
app.get("/settings/:userId", getSettings);
app.put("/settings/:userId",validateFields(["userId"]), updateSettings);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
