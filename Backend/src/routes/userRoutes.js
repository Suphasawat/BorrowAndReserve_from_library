import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { runQuery, allQuery } from "../models/queries.js";

export const registerUser = async (req, res) => {
  try {
    const { name, username, phone, password } = req.body;
    const hashedPassword = await argon2.hash(password);

    await runQuery(
      `INSERT INTO Users (name, username, phone, password) VALUES (?, ?, ?, ?)`,
      [name, username, phone, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// User login endpoint
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await allQuery(`SELECT * FROM Users WHERE username = ?`, [
      username,
    ]);

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await argon2.verify(user[0].password, password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user[0].id, username: user[0].username },
      "secret",
      { expiresIn: "15m" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const addRoom = async (req, res) => {
  try {
    const { room_name, capacity } = req.body;
    await runQuery(`INSERT INTO Rooms (room_name, capacity) VALUES (?, ?)`, [
      room_name,
      capacity,
    ]);
    res.status(201).json({ message: "Room added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding room", error: error.message });
  }
};

export const addItems = async (req, res) => {
  try {
    const { name, description, available_quantity, total_quantity } = req.body;
    await runQuery(
      `INSERT INTO Items (name, description, available_quantity, total_quantity) VALUES (?, ?, ?, ?)`,
      [name, description, available_quantity, total_quantity]
    );
    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding item", error: error.message });
  }
};

export const addLoan = async (req, res) => {
  try {
    const { user_id, item_id, status, borrow_date, return_date } = req.body;

    // ตรวจสอบว่าไอเท็มมีจำนวนเพียงพอหรือไม่
    const item = await allQuery(
      `SELECT available_quantity FROM Items WHERE id = ?`,
      [item_id]
    );

    if (item.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item[0].available_quantity <= 0) {
      return res.status(400).json({ message: "Item is out of stock" });
    }

    // เพิ่มข้อมูลการยืม
    await runQuery(
      `INSERT INTO Loans (user_id, item_id, status, borrow_date, return_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, item_id, status, borrow_date, return_date]
    );

    // อัปเดตจำนวน available_quantity ลดลง 1
    await runQuery(
      `UPDATE Items SET available_quantity = available_quantity - 1 WHERE id = ?`,
      [item_id]
    );

    res.status(201).json({ message: "Loan added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding loan", error: error.message });
  }
};

export const addBooking = async (req, res) => {
  try {
    const { room_id, user_id, booking_date, start_time, end_time, status } =
      req.body;

    // ตรวจสอบว่าห้องที่ต้องการจองว่างหรือไม่
    const room = await allQuery(
      `SELECT is_available FROM Rooms WHERE room_id = ?`,
      [room_id]
    );

    if (room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room[0].is_available) {
      return res.status(400).json({ message: "Room is not available" });
    }

    // เพิ่มข้อมูลการจอง
    await runQuery(
      `INSERT INTO RoomBookings (room_id, user_id, booking_date, start_time, end_time, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [room_id, user_id, booking_date, start_time, end_time, status]
    );

    // อัปเดต is_available ของห้องเป็น false
    await runQuery(`UPDATE Rooms SET is_available = FALSE WHERE room_id = ?`, [
      room_id,
    ]);

    res.status(201).json({ message: "Booking added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding booking", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await allQuery(`SELECT * FROM Users`);
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    // ดึงข้อมูลห้องทั้งหมด
    let rooms = await allQuery(`SELECT * FROM Rooms`);

    // ตรวจสอบการจองที่หมดอายุ
    const now = new Date().toISOString(); // เวลาปัจจุบันในรูปแบบ ISO

    // อัปเดตห้องที่หมดอายุให้ว่าง
    await runQuery(
      `UPDATE Rooms 
       SET is_available = TRUE 
       WHERE room_id IN (
         SELECT room_id FROM RoomBookings WHERE end_time <= ? AND status = 'Booked'
       )`,
      [now]
    );

    // อัปเดตสถานะการจองที่หมดอายุเป็น "Expired"
    await runQuery(
      `UPDATE RoomBookings 
       SET status = 'Expired' 
       WHERE end_time <= ? AND status = 'Booked'`,
      [now]
    );

    // ดึงข้อมูลห้องอีกครั้งหลังจากอัปเดต
    rooms = await allQuery(`SELECT * FROM Rooms`);

    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await allQuery(`SELECT * FROM Items`);
    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
};

export const getAllLoans = async (req, res) => {
  try {
    const loans = await allQuery(`SELECT * FROM Loans`);
    res.status(200).json(loans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching loans", error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await allQuery(`SELECT * FROM RoomBookings`);
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};
