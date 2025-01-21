import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AsetScreen = ({ navigation }) => {
  const [uangTunai, setUangTunai] = useState(0);
  const [bank, setBank] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAset = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://192.168.1.8:5000/api/aset", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (res.data) {
        setUangTunai(res.data.uang_tunai || 0);
        setBank(res.data.bank || 0);
      } else {
        setUangTunai(0);
        setBank(0);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Gagal mengambil data aset", "Terjadi kesalahan");
    }
  };

  useEffect(() => {
    fetchAset();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAset().then(() => setRefreshing(false));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.asetContainer}>
        <View style={styles.asetItem}>
          <Text style={styles.asetTitle}>Uang Tunai</Text>
          <Text style={styles.asetAmount}>Rp {uangTunai.toLocaleString()}</Text>
        </View>
        <View style={styles.asetItem}>
          <Text style={styles.asetTitle}>Bank</Text>
          <Text style={styles.asetAmount}>Rp {bank.toLocaleString()}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTransaksi")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    color: "#333",
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  asetContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  asetItem: {
    backgroundColor: "#fff",
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
  asetTitle: {
    color: "#333",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  asetAmount: {
    color: "#333",
    fontSize: 15,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default AsetScreen;
