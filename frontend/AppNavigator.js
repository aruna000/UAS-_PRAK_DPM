import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AsetScreen from "./screens/AsetScreen";
import AddTransaksiScreen from "./screens/AddTransaksiScreen";
import LainnyaScreen from "./screens/LainnyaScreen";
import MemoScreen from "./screens/MemoScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Aset" component={AsetScreen} />
        <Stack.Screen name="AddTransaksi" component={AddTransaksiScreen} />
        <Stack.Screen name="Lainnya" component={LainnyaScreen} />
        <Stack.Screen name="Memo" component={MemoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
