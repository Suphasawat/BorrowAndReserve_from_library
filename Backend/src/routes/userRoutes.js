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

export const room_avaible = async (res) => {
  try {
    await allQuery(
      `SELECT * FROM Rooms WHERE is_available = 1`,
      [],
      (err, rooms) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error getting rooms", error: err.message });
        res.json({ availableRooms: rooms });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting rooms", error: error.message });
  }
};

export const addEquipment = async (req, res) => {
  try {
    const { equipment_name, total_quantity } = req.body;
    if (!equipment_name || !total_quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `INSERT INTO Equipment (equipment_name, total_quantity, available_quantity) VALUES (?, ?, ?)`;
    await runQuery(sql, [equipment_name, total_quantity, total_quantity]);
    res.status(201).json({ message: "Equipment added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding equipment", error: error.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { name, description, total_quantity } = req.body;
    if (!name || !total_quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `INSERT INTO Items (name, description, total_quantity, available_quantity) VALUES (?, ?, ?, ?)`;
    await runQuery(sql, [
      name,
      description || "",
      total_quantity,
      total_quantity,
    ]);
    res.status(201).json({ message: "Item added", item_id: this.lastID });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding item", error: error.message });
  }
};

export const addRoom = async (req, res) => {
  try {
    const { room_name, capacity } = req.body;
    if (!room_name || !capacity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `INSERT INTO Rooms (room_name, capacity, is_available) VALUES (?, ?, ?)`;
    await runQuery(sql, [room_name, capacity, 1]);
    res.status(201).json({ message: "Room added", room_id: this.lastID });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding room", error: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const sql = "SELECT * FROM Rooms WHERE is_available = 1";
    await allQuery(sql, [], (err, rooms) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rooms);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting rooms", error: error.message });
  }
};

export const getSchedule = async (req, res) => {
  try {
    const sql = `
    SELECT r.room_id, r.room_name, rb.start_time, rb.end_time, rb.status 
    FROM Rooms r
    LEFT JOIN RoomBookings rb ON r.room_id = rb.room_id
    WHERE rb.status IS NULL OR rb.status != 'Booked'
  `;
    await allQuery(sql, [], (err, schedule) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(schedule);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting schedule", error: error.message });
  }
};

export const bookRoom = async (req, res) => {
  try {
    const { user_id, room_id, start_time, end_time } = req.body;
    if (!user_id || !room_id || !start_time || !end_time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ตรวจสอบว่าห้องนี้ยังว่างไหม
    const checkSQL = `SELECT * FROM RoomBookings WHERE room_id = ? AND status = 'Booked' 
                    AND ((start_time <= ? AND end_time >= ?) OR (start_time <= ? AND end_time >= ?))`;

    await allQuery(
      checkSQL,
      [room_id, start_time, start_time, end_time, end_time],
      (err, booking) => {
        if (err) return res.status(500).json({ error: err.message });
        if (booking)
          return res
            .status(400)
            .json({ message: "Room is already booked during this time" });
      }
    );

    // ดำเนินการจอง
    const sql = `
      INSERT INTO RoomBookings (room_id, user_id, start_time, end_time, status) 
      VALUES (?, ?, ?, ?, 'Booked')
    `;
    await runQuery(sql, [room_id, user_id, start_time, end_time]);
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Room booked successfully",
      booking_id: this.lastID,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error booking room", error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const sql = `DELETE FROM RoomBookings WHERE booking_id = ?`;

    await runQuery(sql, [booking_id]);
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling booking", error: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const sql = "SELECT id, name, available_quantity FROM Items";
    await allQuery(sql, [], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(items);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting items", error: error.message });
  }
};

export const getQueue = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const sql = `
    SELECT Q.position, U.name, L.due_date
    FROM Queue Q
    JOIN Users U ON Q.user_id = U.id
    LEFT JOIN Loans L ON Q.item_id = L.item_id AND L.status = 'borrowed'
    WHERE Q.item_id = ? ORDER BY Q.position ASC
  `;
    await allQuery(sql, [itemId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const estimatedTime =
        rows.length > 0 ? `ประมาณ ${rows.length * 30} นาที` : "ไม่มีคิวรอ";
      res.json({ queue: rows, estimated_time: estimatedTime });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting queue", error: error.message });
  }
};

export const getLoans = async (req, res) => {
  try {
    const userId = req.params.userId;
    const sql = `
    SELECT I.name, L.due_date, 
    (JULIANDAY(L.due_date) - JULIANDAY('now')) * 24 AS hours_remaining
   FROM Loans L
   JOIN Items I ON L.item_id = I.id
   WHERE L.user_id = ? AND L.status = 'borrowed'
  `;
    await allQuery(sql, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting loans", error: error.message });
  }
};

// ฟังก์ชันส่งการแจ้งเตือนเข้า Database
export const sendNotification = async (user_id, message) => {
  try {
    const sql = `INSERT INTO Notifications (user_id, message) VALUES (?, ?)`;
    await runQuery(sql, [user_id, message]);
    if (err) {
      console.error("Error sending notification:", err.message);
    } else {
      console.log("Notification sent:", message);
      io.emit(`notification_${user_id}`, { message });
    }
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

// API ดึงการแจ้งเตือนของผู้ใช้
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const sql = `SELECT notification_id, message, sent_at, is_read FROM Notifications WHERE user_id = ? ORDER BY sent_at DESC`;
    await allQuery(sql, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting notifications", error: error.message });
  }
};

// API อัปเดตการอ่านแจ้งเตือน
export const markNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const sql = `UPDATE Notifications SET is_read = TRUE WHERE user_id = ?`;
    await runQuery(sql, [userId]);
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notifications as read", error });
  }
};

// ตรวจสอบสถานะการจองเปลี่ยนแปลง
export const updateBookingStatus = async (req, res) => {
  try {
    const { booking_id, new_status } = req.body;

    const sql = `UPDATE RoomBookings SET status = ? WHERE booking_id = ?`;
    await runQuery(sql, [new_status, booking_id]);
    if (err) return res.status(500).json({ error: err.message });

    if (new_status === "cancel") {
      sendNotification(row.user_id, `📢 การจองห้องของคุณถูกยกเลิก`);
    } else {
      sendNotification(
        row.user_id,
        `📢 สถานะการจองของคุณเปลี่ยนเป็น '${new_status}'`
      );
    }

    res.json({ message: "Booking status updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking status", error: error.message });
  }
};

// API ดึงค่าการตั้งค่าของผู้ใช้
export const getSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const sql = `SELECT theme, notifications_enabled FROM Settings WHERE user_id = ?`;
    await allQuery(sql, [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) {
        return res.json({ theme: "light", notifications_enabled: true }); // ค่าเริ่มต้น
      }
      res.json(rows[0]);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting settings", error: error.message });
  }
};

// API อัปเดตการตั้งค่า
export const updateSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { theme, notifications_enabled } = req.body;

    const sql = `INSERT INTO Settings (user_id, theme, notifications_enabled) VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET theme = excluded.theme, notifications_enabled = excluded.notifications_enabled`;
    await runQuery(sql, [userId, theme, notifications_enabled]);
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating settings", error: error.message });
  }
};
