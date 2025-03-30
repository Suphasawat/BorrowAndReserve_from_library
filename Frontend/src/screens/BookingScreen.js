// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   FlatList,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import {
//   getAllRooms,
//   addBooking,
//   updateRoomAvailability,
//   getAllUsers,
// } from "../services/api";

// const BookingScreen = ({ route }) => {
//   const { token, username } = route.params || {}; // รับค่าจาก params
//   const [rooms, setRooms] = useState([]);

//   useEffect(() => {
//     console.log("Token:", token, "Username:", username);
//     fetchRooms();
//   }, [username]);

//   useEffect(() => {
//     console.log("Updated Rooms:", rooms);
//   }, [rooms]);

//   const fetchRooms = async () => {
//     try {
//       const response = await getAllRooms(token);
//       console.log("Fetched Rooms:", response);

//       const availableRooms = response?.filter((room) => room.is_available);
//       setRooms(availableRooms || []);
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     }
//   };

//   const handleBooking = async (room_id) => {
//     const users = await getAllUsers(token); // ดึงข้อมูลผู้ใช้ทั้งหมด
//     const user_id = users.find((user) => user.username === username)?.id; // ค้นหาผู้ใช้จาก username
//     console.log("User ID:", user_id); // Log user ID

//     if (!room_id || !username?.trim()) {
//       Alert.alert("Error", "Missing room ID or user ID");
//       return;
//     }

//     try {
//       console.log("Booking Room:", room_id, "User ID:", username);

//       const bookingResponse = await addBooking(
//         room_id,
//         username,
//         new Date().toISOString().split("T")[0],
//         "10:00",
//         "12:00",
//         "Booked",
//         token
//       );

//       console.log("Booking Response:", bookingResponse);

//       console.log("Updating room availability...");
//       const updateResponse = await updateRoomAvailability(
//         false,
//         room_id,
//         token
//       );
//       console.log("Update Request Data:", { is_available: false, room_id });

//       Alert.alert("Success", "Booking successful!");
//       fetchRooms(); // โหลดข้อมูลใหม่
//     } catch (error) {
//       console.error("Booking Error:", error);
//       Alert.alert("Error", "Failed to book room");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Available Rooms</Text>

//       <FlatList
//         data={rooms}
//         keyExtractor={(item, index) =>
//           item?.room_id ? item.room_id.toString() : index.toString()
//         }
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text style={styles.roomName}>
//               {item.room_name || "Unknown Room"}
//             </Text>
//             <Text style={styles.text}>Capacity: {item.capacity || "N/A"}</Text>
//             <Text style={styles.text}>Room ID: {item.room_id || "N/A"}</Text>

//             <TouchableOpacity
//               style={[
//                 styles.bookButton,
//                 (!item?.room_id || !username?.trim()) && styles.disabledButton,
//               ]}
//               onPress={() => handleBooking(item?.room_id)}
//               disabled={!item?.room_id || !username?.trim()}
//             >
//               <Text style={styles.buttonText}>Book Now</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 15,
//     textAlign: "center",
//     color: "#333",
//   },
//   card: {
//     padding: 20,
//     backgroundColor: "#ffffff",
//     marginBottom: 15,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   roomName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 5,
//     color: "#222",
//   },
//   text: {
//     fontSize: 16,
//     color: "#555",
//     marginBottom: 5,
//   },
//   bookButton: {
//     backgroundColor: "#007bff",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   disabledButton: {
//     backgroundColor: "#cccccc",
//   },
// });

// export default BookingScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { addBooking, getAllUsers, getAllRooms } from "../services/api";
import { useNavigation } from "@react-navigation/native";

const BookingScreen = ({ route }) => {
  const { username, token } = route.params || {};

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, [token, username]);

  const fetchRooms = async () => {
    try {
      const response = await getAllRooms(token);
      console.log("Fetched Rooms:", response);

      const availableRooms = response;
      console.log("Available Rooms:", availableRooms);

      setRooms(availableRooms || []);
      console.log("Rooms state:", rooms);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleBooking = async (room_id) => {
    const users = await getAllUsers(token);
    const user = users.find((user) => user.username === username);
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }
    const user_id = user.id;

    // กำหนดค่าวันที่และเวลา
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 1); // บวก 1 วัน

    const booking_date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const start_time = now.toISOString(); // เวลาปัจจุบัน
    const end_time = futureDate.toISOString(); // เวลาผ่านไป 14 วัน
    const status = "Booked"; // กำหนดสถานะ

    try {
      await addBooking(
        room_id,
        user_id,
        booking_date,
        start_time,
        end_time,
        status,
        token
      );
      Alert.alert("Success", "Booking successful!");

      // รีเฟรชห้องที่สามารถจองได้หลังจากการจองสำเร็จ
      fetchRooms();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Rooms</Text>

      <FlatList
        data={rooms}
        keyExtractor={(item, index) =>
          item?.room_id ? item.room_id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.roomName}>
              {item.room_name || "Unknown Room"}
            </Text>
            <Text style={styles.text}>Capacity: {item.capacity || "N/A"}</Text>
            <Text style={styles.text}>Room ID: {item.room_id || "N/A"}</Text>
            <Text style={styles.text}>
              Available: {item.is_available ? "Yes" : "No"}
            </Text>

            <TouchableOpacity
              style={[
                styles.bookButton,
                (!item?.room_id || !username?.trim()) && styles.disabledButton,
                !item.is_available && styles.disabledButton, // disable if not available
              ]}
              onPress={() => handleBooking(item?.room_id)}
              disabled={
                !item?.room_id || !username?.trim() || !item.is_available // disable button if the room is not available
              }
            >
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  card: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  roomName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#222",
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  bookButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc", // gray color for disabled button
  },
});

export default BookingScreen;
