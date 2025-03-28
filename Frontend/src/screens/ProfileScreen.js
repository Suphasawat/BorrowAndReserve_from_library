import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>โปรไฟล์</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
                      <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                      <Ionicons name="person-circle-outline" size={24} color="black" />
                    </TouchableOpacity>
        </View>
      </View>

      {/* ข้อมูลผู้ใช้ */}
      <View style={styles.userInfo}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // แทนที่ด้วย URL รูปโปรไฟล์
          style={styles.profileImage}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userUsername}>john</Text>
        </View>
      </View>

      {/* การตั้งค่า */}
      <View style={styles.settings}>
        <Text style={styles.settingsTitle}>การตั้งค่า</Text>
        <View style={styles.settingItem}>
          <Ionicons name="moon-outline" size={24} color="gray" />
          <Text style={styles.settingText}>โหมดมืด</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            style={styles.settingSwitch}
          />
        </View>
        <View style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="gray" />
          <Text style={styles.settingText}>การแจ้งเตือน</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            style={styles.settingSwitch}
          />
        </View>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("Login")}>
          <Ionicons name="log-out-outline" size={24} color="gray" />
          <Text style={styles.settingText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>

      {/* ติดต่อเรา */}
      <View style={styles.contact}>
        <Text style={styles.contactTitle}>ติดต่อเรา</Text>
        <Text style={styles.contactText}>
          มีปัญหาหรือข้อสงสัยเกี่ยวกับการใช้งานระบบ? ติดต่อเจ้าหน้าที่ได้ที่
        </Text>
        <TouchableOpacity
          style={styles.contactInfo}
          onPress={() => Linking.openURL(`tel:${'02-123-4567'}`)}
        >
          <Ionicons name="call-outline" size={24} color="gray" />
          <Text style={styles.contactText}>02-123-4567</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactInfo}
          onPress={() => Linking.openURL(`mailto:${'library@example.ac.th'}`)}
        >
          <Ionicons name="mail-outline" size={24} color="gray" />
          <Text style={styles.contactText}>library@example.ac.th</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007bff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userDetails: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userUsername: {
    fontSize: 16,
    color: 'gray',
  },
  settings: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  settingSwitch: {
    marginLeft: 'auto',
  },
  contact: {
    padding: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default ProfileScreen;