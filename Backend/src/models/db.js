import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("database.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
  else console.log("Connected to the database.");
});

// Function to initialize database
export const initDB = () => {
  const Tables = `
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
      booking_date DATE,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      status TEXT CHECK (status IN ('Booked', 'Cancelled', 'Expired')) DEFAULT 'Booked',
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
      status TEXT CHECK (status IN ('pending', 'borrowed', 'returned', 'cancelled')) DEFAULT 'pending',
      borrow_date DATE,
      return_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.exec(Tables, (err) => {
    if (err) console.error("Error initializing database:", err.message);
    else console.log("Database initialized.");
  });
};
