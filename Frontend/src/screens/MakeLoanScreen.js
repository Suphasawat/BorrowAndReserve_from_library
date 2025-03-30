// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, TextInput, Button } from "react-native";
// import { addLoan, getAllUsers } from "../services/api";

// const makeLoanScreen = ({ route }) => {
//   const { username, token } = route.params || {};

//   const [item_id, setItemId] = useState(""); // สถานะสำหรับ item_id
//   const [borrow_date, setBorrowDate] = useState(""); // สถานะสำหรับ borrow_date
//   const [due_date, setDueDate] = useState(""); // สถานะสำหรับ due_date
//   const [status, setStatus] = useState(""); // สถานะสำหรับ loan status
//   const [return_date, setReturnDate] = useState(""); // สถานะสำหรับ return_date

//   const handleSubmit = async () => {
//     const userId = await getAllUsers(token);
//     const user = userId.find((user) => user.username === username);
//     if (!user) {
//       alert("User not found");
//       return;
//     }
//     const user_id = user.id;
//     if (!item_id || !borrow_date || !due_date || !status) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       const response = await addLoan(
//         user_id,
//         item_id,
//         status,
//         borrow_date,
//         due_date,
//         return_date,
//         token
//       );
//       alert("Loan added successfully!");
//       navigation.navigate("Item", { token });
//     } catch (error) {
//       alert("Error adding loan:", error.message);
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
//       <Button title="Submit Loan" onPress={handleSubmit} />
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

import React, { useState } from "react";
import { View, StyleSheet, Button, TextInput, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addLoan, getAllUsers } from "../services/api";

const MakeLoanScreen = ({ route, navigation }) => {
  const { username, token, item_id } = route.params || {}; // Receive item_id from params

  const [borrow_date, setBorrowDate] = useState("");
  const [return_date, setReturnDate] = useState("");

  const [showBorrowDatePicker, setShowBorrowDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate, dateType) => {
    const currentDate = selectedDate || new Date();
    if (dateType === "borrow") {
      setBorrowDate(currentDate.toISOString().split("T")[0]);
    } else if (dateType === "return") {
      setReturnDate(currentDate.toISOString().split("T")[0]);
    }
    if (dateType === "borrow") setShowBorrowDatePicker(false);
    if (dateType === "return") setShowReturnDatePicker(false);
  };

  const handleSubmit = async () => {
    const userId = await getAllUsers(token);
    const user = userId.find((user) => user.username === username);
    if (!user) {
      alert("User not found");
      return;
    }
    const user_id = user.id;
    if (!item_id || !borrow_date || !return_date) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const status = "borrowed"; // Automatically set status as "borrowed"

      // Call API to add loan request
      await addLoan(user_id, item_id, status, borrow_date, return_date, token);

      alert("Loan added successfully!");
      navigation.navigate("Item", { token }); // Navigate back to item list
    } catch (error) {
      alert("Error adding loan:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Item ID: {item_id}</Text>{" "}
      {/* Display item_id to confirm selection */}
      <Button
        title="Select Borrow Date"
        onPress={() => setShowBorrowDatePicker(true)}
      />
      {showBorrowDatePicker && (
        <DateTimePicker
          testID="borrowDatePicker"
          value={new Date(borrow_date || new Date())}
          mode="date"
          display="default"
          onChange={(event, selectedDate) =>
            handleDateChange(event, selectedDate, "borrow")
          }
        />
      )}
      <Text>Borrow Date: {borrow_date}</Text>
      <Button
        title="Select Return Date"
        onPress={() => setShowReturnDatePicker(true)}
      />
      {showReturnDatePicker && (
        <DateTimePicker
          testID="returnDatePicker"
          value={new Date(return_date || new Date())}
          mode="date"
          display="default"
          onChange={(event, selectedDate) =>
            handleDateChange(event, selectedDate, "return")
          }
        />
      )}
      <Text>Return Date: {return_date}</Text>
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

export default MakeLoanScreen;
