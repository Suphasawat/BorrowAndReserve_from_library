import axios from "axios";

const API_URL = "http://192.168.1.15:5000"; // URL ของ API ของคุณ

// Register User API
export const registerUser = async (name, username, phone, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      username,
      phone,
      password,
    });
    return response.data; // จะส่งคืนข้อมูลที่ได้รับจาก API
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error registering user");
  }
};

// Login User API
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data.token; // ส่งคืน JWT Token หลังจากที่เข้าสู่ระบบสำเร็จ
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error logging in user");
  }
};

// Add Room API
export const addRoom = async (room_name, capacity, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-room`,
      { room_name, capacity },
      {
        headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
      }
    );
    return response.data; // ส่งคืนข้อมูลการเพิ่มห้อง
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error adding room");
  }
};

// Add Item API
export const addItems = async (
  name,
  description,
  available_quantity,
  total_quantity,
  token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-items`,
      { name, description, available_quantity, total_quantity },
      {
        headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
      }
    );
    return response.data; // ส่งคืนข้อมูลการเพิ่มรายการ
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error adding item");
  }
};

// Add Loan API
export const addLoan = async (
  user_id,
  item_id,
  status,
  borrow_date,
  return_date,
  token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-loan`,
      { user_id, item_id, status, borrow_date, return_date },
      {
        headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
      }
    );
    return response.data; // ส่งคืนข้อมูลการเพิ่มการยืม
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error adding loan");
  }
};

// Add Booking API
export const addBooking = async (
  room_id,
  user_id,
  booking_date,
  start_time,
  end_time,
  status,
  token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-booking`,
      { room_id, user_id, booking_date, start_time, end_time, status },
      {
        headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
      }
    );
    return response.data; // ส่งคืนข้อมูลการเพิ่มการจอง
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error adding booking");
  }
};

// Get All Users API (for admins)
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
    });
    return response.data; // ส่งคืนข้อมูลผู้ใช้ทั้งหมด
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching users");
  }
};

export const getAllRooms = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/rooms`, {
      headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
    });
    return response.data; // ส่งคืนข้อมูลห้องทั้งหมด
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching rooms");
  }
};

export const getAllItems = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/items`, {
      headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
    });
    return response.data; // ส่งคืนข้อมูลรายการทั้งหมด
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching items");
  }
};

export const getAllLoans = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/loans`, {
      headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
    });
    return response.data; // ส่งคืนข้อมูลการยืมทั้งหมด
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching loans");
  }
};

export const getAllBookings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` }, // ใช้ token สำหรับการยืนยันตัวตน
    });
    return response.data; // ส่งคืนข้อมูลการจองทั้งหมด
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching bookings");
  }
};
