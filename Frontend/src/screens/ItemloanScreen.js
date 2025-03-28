import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BorrowEquipmentCard from "../components/BorrowEquipmentCard";
import iconSet from "@expo/vector-icons/build/Fontisto";

const ItemloanScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [equipment, setEquipment] = useState([
    {
      id: "1",
      name: "แล็ปท็อป HP Pavilion",
      description:
        "แล็ปท็อปสำหรับการใช้งานทั่วไป เหมาะสำหรับการทำรายงานและการนำเสนอ",
      available: "2/5",
      status: "พร้อมให้ยืม",
    },
    {
      id: "2",
      name: "กล้อง Canon DSLR",
      description: "กล้อง DSLR สำหรับการถ่ายภาพคุณภาพสูง พร้อมเลนส์มาตรฐาน",
      available: "มีคิว",
      status: "มีคิว",
    },
    // เพิ่มอุปกรณ์อื่น ๆ ที่นี่
  ]);

  return (
    <View style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Items</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.replace("Profile")}>
            <Ionicons
              name="person-circle-outline"
              size={28}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ช่องค้นหา */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาอุปกรณ์"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* รายการอุปกรณ์ */}
      <View style={styles.equipmentList}>
        <Text style={styles.equipmentListTitle}>อุปกรณ์ทั้งหมด</Text>
        <FlatList
          data={equipment}
          renderItem={({ item }) => (
            <BorrowEquipmentCard equipmentData={item} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#122620", // Matching LibraryScreen header style
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white", // Matching LibraryScreen header title style
  },
  headerIcons: {
    flexDirection: "row",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  equipmentList: {
    padding: 16,
  },
  equipmentListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  icon: {
    marginLeft: 15,
  },
});

export default ItemloanScreen;
