import axios from "axios";

const API_URL = "http://192.168.1.15:5000";

export const registerUser = async (name, username, phone, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      username,
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error register user");
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    return response.data.token;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error login user");
  }
};
