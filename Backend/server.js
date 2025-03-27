import express from "express";
import cors from "cors";
import { initDB } from "./src/models/db.js";
import { validateFields, isAdmin } from "./src/middleware/middleware.js";
import {
  registerUser,
  loginUser,
  addItem,
  addRoom,
  getRooms,
  getSchedule,
  bookRoom,
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
app.post(
  "/admin/items",
  [
    isAdmin,
    validateFields([
      "name",
      "description",
      "available_quantity",
      "total_quantity",
    ]),
  ],
  addItem
);
app.post(
  "/admin/rooms",
  [isAdmin, validateFields(["room_name", "capacity"])],
  addRoom
);
app.get("/rooms", getRooms);
app.get("/schedule", getSchedule);
app.post(
  "/book",
  validateFields([
    "user_id",
    "booking_date",
    "room_id",
    "start_time",
    "end_time",
  ]),
  bookRoom
);
app.get("/items", getItems);
app.get("/queue/:itemId", getQueue);
app.get("/loans/:userId", getLoans); // กำลังแก้
app.get("/notifications/:userId", getNotifications);
app.post(
  "/notifications/send",
  validateFields(["user_id", "message"]),
  sendNotification
);
app.post(
  "/notifications/read/:user_id",
  validateFields(["user_id"]),
  markNotificationsAsRead
);
app.post(
  "/bookings/update-status",
  validateFields(["booking_id", "status"]),
  updateBookingStatus
);
app.get("/settings/:user_id", getSettings);
app.post(
  "/settings",
  validateFields(["user_id", "theme", "notifications_enabled"]),
  updateSettings
);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
