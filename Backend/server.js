import express from "express";
import cors from "cors";
import { initDB } from "./src/models/db.js";
import { validateFields, isAdmin } from "./src/middleware/middleware.js";
import {
  registerUser,
  loginUser,
  addRoom,
  addItems,
  addLoan,
  addBooking,
  getAllUsers,
  getAllRooms,
  getAllItems,
  getAllLoans,
  getAllBookings,
} from "./src/routes/userRoutes.js";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Initialize DB connection
initDB();

// Register User Route
app.post(
  "/register",
  validateFields(["name", "username", "phone", "password"]),
  registerUser
);

// Login User Route
app.post("/login", validateFields(["username", "password"]), loginUser);

// Add Room Route
app.post(
  "/add-room",
  isAdmin,
  validateFields(["room_name", "capacity"]),
  addRoom
);

// Add Items Route
app.post(
  "/add-items",
  isAdmin,
  validateFields([
    "name",
    "description",
    "available_quantity",
    "total_quantity",
  ]),
  addItems
);

// Add Loan Route
app.post(
  "/add-loan",
  validateFields([
    "user_id",
    "item_id",
    "status",
    "borrow_date",
    "return_date",
  ]),
  addLoan
);

// Add Booking Route
app.post(
  "/add-booking",
  validateFields([
    "room_id",
    "user_id",
    "booking_date",
    "start_time",
    "end_time",
    "status",
  ]),
  addBooking
);

// Get All Users Route
app.get("/users", getAllUsers);

// Get All Rooms Route
app.get("/rooms", getAllRooms);

// Get All Items Route
app.get("/items", getAllItems);

// Get All Loans Route
app.get("/loans", getAllLoans);

// Get All Bookings Route
app.get("/bookings", getAllBookings);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
