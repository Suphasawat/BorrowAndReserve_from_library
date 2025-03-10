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

// Function to initialize database
const initDB = () => {
  const sql = `
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    phone CHAR(9) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Rooms (
    room_id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
  );

  CREATE TABLE IF NOT EXISTS RoomBookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER REFERENCES Rooms(room_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status TEXT CHECK (status IN ('Booked', 'Cancelled', 'Expired')) DEFAULT 'Booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Equipment (
    equipment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_name TEXT NOT NULL,
    total_quantity INTEGER NOT NULL,
    available_quantity INTEGER NOT NULL CHECK (available_quantity >= 0)
  );

  CREATE TABLE IF NOT EXISTS EquipmentBookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER REFERENCES Equipment(equipment_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    queue_position INTEGER NOT NULL,
    expected_wait_time TEXT, 
    return_due TIMESTAMP,
    status TEXT CHECK (status IN ('Waiting', 'In Use', 'Returned', 'Cancelled')) DEFAULT 'Waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    available_quantity INTEGER NOT NULL DEFAULT 1,
    total_quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES Items(id) ON DELETE CASCADE,
    queue_position INTEGER NOT NULL DEFAULT 1,
    status TEXT CHECK (status IN ('pending', 'borrowed', 'returned', 'cancelled')) DEFAULT 'pending',
    borrow_date DATE,
    due_date DATE,
    return_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES Items(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES Items(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
  );
  `;

  db.exec(sql, (err) => {
    if (err) console.error("Error initializing database:", err.message);
    else console.log("Database initialized.");
  });
};

initDB();

// Helper function to run database queries with Promises
const runQuery = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const allQuery = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

// Middleware to validate request body
const validateFields = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ message: `Missing required field: ${field}` });
    }
  }
  next();
};

// User registration endpoint
app.post(
  "/register",
  validateFields(["name", "username", "password"]),
  async (req, res) => {
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
  }
);

// User login endpoint
app.post(
  "/login",
  validateFields(["username", "password"]),
  async (req, res) => {
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
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  }
);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
