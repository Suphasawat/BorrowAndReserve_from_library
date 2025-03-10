const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;
app.use(express.json());

const db = new sqlite3.Database("./LibDB.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
  else console.log("Connected to the database.");
});

// Function to create tables
const initDB = () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS Rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
)`,
    `CREATE TABLE IF NOT EXISTS RoomBookings (
    booking_id SERIAL PRIMARY KEY,
    room_id INT REFERENCES Rooms(room_id) ON DELETE CASCADE,
    user_id INT NOT NULL,  
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Booked', 'Cancelled', 'Expired')) DEFAULT 'Booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,
    `CREATE TABLE IF NOT EXISTS Equipment (
    equipment_id SERIAL PRIMARY KEY,
    equipment_name VARCHAR(255) NOT NULL,
    total_quantity INT NOT NULL,
    available_quantity INT NOT NULL CHECK (available_quantity >= 0)
)`,
    `CREATE TABLE IF NOT EXISTS EquipmentBookings (
    booking_id SERIAL PRIMARY KEY,
    equipment_id INT REFERENCES Equipment(equipment_id) ON DELETE CASCADE,
    user_id INT NOT NULL,  -- ควรอ้างอิงกับตาราง Users
    queue_position INT NOT NULL,
    expected_wait_time INTERVAL,
    return_due TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('Waiting', 'In Use', 'Returned', 'Cancelled')) DEFAULT 'Waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,
    `CREATE TABLE IF NOT EXISTS Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL, 
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
)`,
  ];

  db.serialize(() => {
    tables.forEach((query) => {
      db.run(query, (err) => {
        if (err) console.error("Error creating table:", err.message);
      });
    });
  });
};

initDB(); // Initialize tables

// Helper function to run database queries with Promises
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// User registration endpoint
app.post("/register", async (req, res) => {
  try {
    const { name, email: username, phone, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await argon2.hash(password);

    await runQuery(
      `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`,
      [name, username, phone, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
