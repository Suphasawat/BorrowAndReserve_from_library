import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getAllItems } from "../services/api"; // ใช้ฟังก์ชัน getAllItems จาก API
import { useNavigation } from "@react-navigation/native"; // ใช้สำหรับการนำทาง
import { useFocusEffect } from "@react-navigation/native";

const ItemScreen = ({ route }) => {
  const navigation = useNavigation(); // ใช้สำหรับการนำทาง
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = route.params?.token; // รับ token จาก route params

  useFocusEffect(
    React.useCallback(() => {
      const fetchItems = async () => {
        try {
          const data = await getAllItems(token);
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
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>
        Available: {item.available_quantity} / Total: {item.total_quantity}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
    padding: 10,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ItemScreen;
