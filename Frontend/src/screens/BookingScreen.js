import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";
import {
  getAllRooms,
  addBooking,
  updateRoomAvailability,
} from "../services/api";

const BookingScreen = ({ route }) => {
  const { token, username } = route.params || {}; // รับค่าจาก params
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    console.log("Token:", token, "Username:", username); // ตรวจสอบค่าที่ได้รับ

    fetchRooms();
  }, [username]);

  const fetchRooms = async () => {
    try {
      const response = await getAllRooms(token);
      setRooms(response.filter((room) => room.is_available));
      console.log("Rooms:", response); // ตรวจสอบข้อมูลห้องที่ได้รับ
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleBooking = async (room_id) => {
    if (!room_id || !username) {
      Alert.alert("Error", "Missing room ID or user ID");
      return;
    }

    try {
      console.log("Booking Room:", room_id, "User ID:", username);

      const bookingResponse = await addBooking(
        room_id,
        username, // ส่ง username เป็น user_id
        new Date().toISOString().split("T")[0],
        "10:00",
        "12:00",
        "Booked",
        token
      );

      console.log("Booking Response:", bookingResponse);

      await updateRoomAvailability(room_id, false, token);

      Alert.alert("Success", "Booking successful!");
      fetchRooms();
    } catch (error) {
      console.error("Booking Error:", error);
      Alert.alert("Error", "Failed to book room");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Available Rooms
      </Text>

      <FlatList
        data={rooms || []}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              backgroundColor: "#f9f9f9",
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>
              {item.room_name || "Unknown Room"}
            </Text>
            <Text>Capacity: {item.capacity || "N/A"}</Text>
            <Button
              title="Book Now"
              onPress={() => handleBooking(item?.id)}
              disabled={!item?.id || !username} // เช็ค userId และ roomId
            />
          </View>
        )}
      />
    </View>
  );
};

export default BookingScreen;
