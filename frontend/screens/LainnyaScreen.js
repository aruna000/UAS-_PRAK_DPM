import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LainnyaScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Gagal logout", "Terjadi kesalahan");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate("Memo")}
      >
        <Text style={styles.menuButtonText}>Memo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButtonLogout} onPress={handleLogout}>
        <Text style={styles.menuButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
  },

  menuButton: {
    backgroundColor: "#007BFF",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },

  menuButtonLogout: {
    backgroundColor: "#FF0000",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LainnyaScreen;
