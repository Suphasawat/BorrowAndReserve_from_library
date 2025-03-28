import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import LibraryScreen from "./src/screens/LibraryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import QueueReservation from "./src/screens/QueueReservation";
import ItemloanScreen from "./src/screens/ItemloanScreen";
import BookingScreen from "./src/screens/BookingScreen";
import BorrowEquipmentScreen from "./src/screens/BorrowEquipmentScreen";
import CurrentlyBorrowingContent from "./src/screens/CurrentlyBorrowingContent";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Login">
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Register" component={RegisterScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Notification" component={NotificationScreen} />
        <Tab.Screen name="QueueReservation" component={QueueReservation} />
        <Tab.Screen name="ItemloanScreen" component={ItemloanScreen} />
        <Tab.Screen name="BookingScreen" component={BookingScreen} />
        <Tab.Screen
          name="BorrowEquipmentScreen"
          component={BorrowEquipmentScreen}
        />
        <Tab.Screen
          name="CurrentlyBorrowing"
          component={CurrentlyBorrowingContent}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
