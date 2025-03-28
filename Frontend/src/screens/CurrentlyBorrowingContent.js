import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';

// Tab content components
const CurrentlyBorrowingContent = () => (
  <View style={styles.tabContentContainer}>
    <Text style={styles.title}>แล็ปท็อป HP Pavilion</Text>
    <Text style={styles.status}>รอรับอุปกรณ์</Text>
    <View style={styles.infoContainer}>
      <Ionicons name="information-circle-outline" size={20} color="grey" />
      <Text style={styles.infoText}>
        กรุณาติดต่อเจ้าหน้าที่เพื่อรับอุปกรณ์
      </Text>
    </View>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>รอรับอุปกรณ์</Text>
    </TouchableOpacity>
  </View>
);

const BorrowHistoryContent = () => (
  <View style={styles.tabContentContainer}>
    <Text style={styles.title}>ประวัติการยืม</Text>
    {/* แสดงรายการประวัติการยืม */}
  </View>
);

const QueueReservationContent = () => (
  <View style={styles.tabContentContainer}>
    <Text style={styles.title}>การจองคิว</Text>
    {/* แสดงรายการการจองคิว */}
  </View>
);

const renderScene = SceneMap({
  first: CurrentlyBorrowingContent,
  second: BorrowHistoryContent,
  third: QueueReservationContent,
});

const CurrentlyBorrowing = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'กำลังยืม' },
    { key: 'second', title: 'ประวัติการยืม' },
    { key: 'third', title: 'การจองคิว' },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color, fontWeight: 'bold', margin: 8 }}>
          {route.title}
        </Text>
      )}
      indicatorStyle={{ backgroundColor: '#B68D40' }} // เปลี่ยนสีแถบ indicator
      style={{ backgroundColor: '#122620' }} // เปลี่ยนสีพื้นหลังแถบ Tab
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loans</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="white" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={28} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#122620',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  tabContentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#122620',
  },
  status: {
    fontSize: 16,
    color: '#B68D40',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 10,
    color: 'grey',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    marginTop: 5,
    color: '#B68D40',
    fontWeight: 'bold',
  },
});

export default CurrentlyBorrowing;
