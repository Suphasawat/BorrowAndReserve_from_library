import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getAllItems } from "../services/api"; // ใช้ฟังก์ชัน getAllItems จาก API
import { useNavigation } from "@react-navigation/native"; // ใช้สำหรับการนำทาง
import { useFocusEffect } from "@react-navigation/native";

const ItemScreen = ({ route }) => {
  const navigation = useNavigation(); // ใช้สำหรับการนำทาง
  const { username, token } = route.params || {}; // ดึงค่า username และ token จาก params
  const [items, setItems] = useState([]);
  const [item_id, setItemId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchItems = async () => {
        try {
          const data = await getAllItems(token);
          console.log("Items data:", data);
          const item = data.id;
          console.log("Item ID:", item);

          setItems(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchItems();
    }, [token])
  );

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

  // ฟังก์ชันในการ render item แต่ละตัวใน FlatList
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.text}>{item.description}</Text>
      <Text style={styles.text}>
        Available: {item.available_quantity} / Total: {item.total_quantity}
      </Text>
      <Text style={styles.text}>ID: {item.id}</Text>

      <TouchableOpacity
        style={styles.loanButton}
        onPress={() => {
          navigation.navigate("MakeLoan", {
            item_id: item.id,
            token,
            username,
          });
        }}
      >
        <Text style={styles.buttonText}>Loan Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Items</Text>
      <FlatList
        data={items} // ข้อมูลที่จะแสดง
        renderItem={renderItem} // ฟังก์ชันในการ render แต่ละรายการ
        keyExtractor={(item) => (item._id ? item._id.toString() : "default-id")} // ตรวจสอบว่า _id มีค่าไหม
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
  itemName: {
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
  loanButton: {
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
});

export default ItemScreen;
