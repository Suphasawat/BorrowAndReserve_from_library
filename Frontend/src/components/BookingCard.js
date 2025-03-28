import React from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";

const BookingCard = ({ bookingData }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>การจองห้อง #{bookingData.room_id}</Text>
      <Text style={styles.detailText}>ผู้ใช้: {bookingData.user_id}</Text>
      <Text style={styles.detailText}>
        เวลาเริ่ม: {moment(bookingData.start_time).format("HH:mm")}
      </Text>
      <Text style={styles.detailText}>
        เวลาสิ้นสุด: {moment(bookingData.end_time).format("HH:mm")}
      </Text>
      <Text style={styles.detailText}>สถานะ: {bookingData.status}</Text>
      <Text style={styles.detailText}>
        วันที่จอง: {moment(bookingData.created_at).format("DD/MM/YYYY HH:mm")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 4,
  },
});

export default BookingCard;
