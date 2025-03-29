import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getAllRooms } from "../services/api"; // ใช้ฟังก์ชัน getAllRooms จาก API
import { useNavigation } from "@react-navigation/native"; // ใช้สำหรับการนำทาง

const RoomScreen = ({ route }) => {
  const navigation = useNavigation(); // ใช้สำหรับการนำทาง
  const [rooms, setRooms] = useState([]); // สถานะสำหรับเก็บข้อมูลห้อง
  const [loading, setLoading] = useState(true); // สถานะสำหรับการโหลดข้อมูล
  const [error, setError] = useState(null); // สถานะสำหรับข้อผิดพลาด

  const token = route?.params?.token; // ป้องกันการเข้าถึงค่าที่เป็น undefined
  if (!token) {
    alert("Token is missing! Please log in again.");
    navigation.navigate("Login"); // นำทางกลับไปยัง LoginScreen หากไม่มี token
  }

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getAllRooms(token);
        console.log("Rooms data:", data);
        setRooms(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRooms();
  }, [token]);

  console.log("Rooms state:", rooms); // ดูค่า rooms ที่ตั้งค่าแล้ว

  // ถ้ายังโหลดข้อมูลอยู่จะแสดง Loading
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // ถ้ามีข้อผิดพลาดจะแสดงข้อความผิดพลาด
  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  // ฟังก์ชันในการ render ห้องแต่ละห้องใน FlatList
  const renderRoom = ({ item }) => {
    console.log("Rendering room:", item); // ตรวจสอบข้อมูลที่จะแสดงในแต่ละ item
    if (!item.room_id || !item.room_name || !item.capacity) {
      return null; // ถ้ามีค่าอะไรที่ผิดพลาดให้ไม่ render ห้องนั้น
    }

    return (
      <View style={styles.roomContainer}>
        <Text style={styles.roomName}>{item.room_name}</Text>
        <Text>Capacity: {item.capacity}</Text>
        <Text
          style={
            item.available
              ? styles.roomAvailableText
              : styles.roomUnavailableText
          }
        >
          Available: {item.is_available ? "Yes" : "No"}
        </Text>
        {/* แสดงข้อมูล available */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item, index) => {
          if (item._id) {
            return item.room_id.toString(); // ใช้ _id ถ้ามี
          } else if (item.room_name) {
            return item.room_name.toString(); // ใช้ room_name ถ้ามี
          } else {
            return `default_key_${index}`; // fallback ที่ดีกว่า
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  roomContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f0f0f0", // เพิ่มสีพื้นหลังเพื่อดูว่า component แสดงอยู่หรือไม่
  },
  roomName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  roomAvailableText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "green", // สีเขียวสำหรับห้องว่าง
  },
  roomUnavailableText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "red", // สีแดงสำหรับห้องไม่ว่าง
  },
});

export default RoomScreen;
