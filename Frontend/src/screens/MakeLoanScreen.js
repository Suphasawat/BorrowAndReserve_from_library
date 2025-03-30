// import React, { useState } from "react";
// import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
// import { useNavigation } from "@react-navigation/native"; // ใช้สำหรับการนำทาง
// import { addLoan } from "../services/api";
// import axios from "axios";

// const API_URL = "http://192.168.1.15:5000"; // URL ของ API

// const makeLoanScreen = ({ route, navigation }) => {
//   // Get username and token from route parameters
//   const { username, token } = route.params || {};

//   const [item_id, setItemId] = useState(""); // สถานะสำหรับ item_id
//   const [borrow_date, setBorrowDate] = useState(""); // สถานะสำหรับ borrow_date
//   const [due_date, setDueDate] = useState(""); // สถานะสำหรับ due_date
//   const [status, setStatus] = useState(""); // สถานะสำหรับ loan status
//   const [return_date, setReturnDate] = useState(""); // สถานะสำหรับ return_date
//   const [loading, setLoading] = useState(false); // สถานะการโหลด

//   const handleSubmit = async () => {
//     if (!username || !item_id || !borrow_date || !due_date || !status) {
//       Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_URL}/add-loan`,
//         {
//           user_id: username, // ใช้ username เป็น user_id
//           item_id,
//           status,
//           borrow_date,
//           due_date,
//           return_date,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       Alert.alert("การยืมเสร็จสมบูรณ์");
//       navigation.goBack(); // กลับไปหน้าก่อนหน้านี้
//     } catch (error) {
//       Alert.alert("เกิดข้อผิดพลาดในการยืม", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* No need for a userId input field anymore */}
//       <TextInput
//         style={styles.input}
//         placeholder="Item ID"
//         value={item_id}
//         onChangeText={setItemId}
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Borrow Date (YYYY-MM-DD)"
//         value={borrow_date}
//         onChangeText={setBorrowDate}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Due Date (YYYY-MM-DD)"
//         value={due_date}
//         onChangeText={setDueDate}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Loan Status"
//         value={status}
//         onChangeText={setStatus}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Return Date (YYYY-MM-DD)"
//         value={return_date}
//         onChangeText={setReturnDate}
//       />
//       <Button
//         title={loading ? "Processing..." : "Submit Loan"}
//         onPress={handleSubmit}
//         disabled={loading}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingLeft: 8,
//   },
// });

// export default makeLoanScreen;

import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";
import { addLoan, getAllUsers } from "../services/api";

const makeLoanScreen = ({ route }) => {
  const { username, token } = route.params || {};

  const [item_id, setItemId] = useState(""); // สถานะสำหรับ item_id
  const [borrow_date, setBorrowDate] = useState(""); // สถานะสำหรับ borrow_date
  const [due_date, setDueDate] = useState(""); // สถานะสำหรับ due_date
  const [status, setStatus] = useState(""); // สถานะสำหรับ loan status
  const [return_date, setReturnDate] = useState(""); // สถานะสำหรับ return_date

  const handleSubmit = async () => {
    const userId = await getAllUsers(token);
    const user = userId.find((user) => user.username === username);
    if (!user) {
      alert("User not found");
      return;
    }
    const user_id = user.id;
    if (!item_id || !borrow_date || !due_date || !status) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await addLoan(
        user_id,
        item_id,
        status,
        borrow_date,
        due_date,
        return_date,
        token
      );
      alert("Loan added successfully!");
      navigation.navigate("Item", { token });
    } catch (error) {
      alert("Error adding loan:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* No need for a userId input field anymore */}
      <TextInput
        style={styles.input}
        placeholder="Item ID"
        value={item_id}
        onChangeText={setItemId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Borrow Date (YYYY-MM-DD)"
        value={borrow_date}
        onChangeText={setBorrowDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={due_date}
        onChangeText={setDueDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Loan Status"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Return Date (YYYY-MM-DD)"
        value={return_date}
        onChangeText={setReturnDate}
      />
      <Button title="Submit Loan" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
  },
});

export default makeLoanScreen;
