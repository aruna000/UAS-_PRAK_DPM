import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import TransaksiScreen from "../screens/TransaksiScreen";
import StatistikScreen from "../screens/StatistikScreen";
import AsetScreen from "../screens/AsetScreen";
import LainnyaScreen from "../screens/LainnyaScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Transaksi") {
            iconName = "book";
          } else if (route.name === "Statistik") {
            iconName = "stats-chart";
          } else if (route.name === "Aset") {
            iconName = "wallet";
          } else if (route.name === "Lainnya") {
            iconName = "ellipsis-horizontal";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Transaksi" component={TransaksiScreen} />
      <Tab.Screen name="Statistik" component={StatistikScreen} />
      <Tab.Screen name="Aset" component={AsetScreen} />
      <Tab.Screen name="Lainnya" component={LainnyaScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
