import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransaksiScreen = ({ navigation }) => {
  const [pengeluaran, setPengeluaran] = useState(0);
  const [pendapatan, setPendapatan] = useState(0);
  const [total, setTotal] = useState(0);
  const [transaksi, setTransaksi] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      const resPengeluaran = await axios.get(
        `http://192.168.1.8:5000/api/pengeluaran?tanggal=${today}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      const resPendapatan = await axios.get(
        `http://192.168.1.8:5000/api/pendapatan?tanggal=${today}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      const resTransfer = await axios.get(
        `http://192.168.1.8:5000/api/transfer?tanggal=${today}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      const totalPengeluaran = resPengeluaran.data.reduce(
        (acc, item) => acc + item.total,
        0
      );
      const totalPendapatan = resPendapatan.data.reduce(
        (acc, item) => acc + item.total,
        0
      );

      setPengeluaran(totalPengeluaran);
      setPendapatan(totalPendapatan);
      setTotal(totalPendapatan - totalPengeluaran);

      const allTransaksi = [
        ...resPengeluaran.data.map((item) => ({
          ...item,
          jenis: "Pengeluaran",
        })),
        ...resPendapatan.data.map((item) => ({
          ...item,
          jenis: "Pendapatan",
        })),
        ...resTransfer.data.map((item) => ({ ...item, jenis: "Transfer" })),
      ];

      setTransaksi(allTransaksi);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteTransaksi = async (id, jenis) => {
    try {
      const token = await AsyncStorage.getItem("token");
      let url = "";

      if (jenis === "Pengeluaran") {
        url = `http://192.168.1.8:5000/api/pengeluaran/${id}`;
      } else if (jenis === "Pendapatan") {
        url = `http://192.168.1.8:5000/api/pendapatan/${id}`;
      } else if (jenis === "Transfer") {
        url = `http://192.168.1.8:5000/api/transfer/${id}`;
      }

      await axios.delete(url, {
        headers: {
          "x-auth-token": token,
        },
      });

      setTransaksi(transaksi.filter((item) => item._id !== id));
      Alert.alert("Transaksi berhasil dihapus");
    } catch (err) {
      Alert.alert("Gagal menghapus transaksi", "Terjadi kesalahan");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        Alert.alert(
          "Detail Transaksi",
          `Jenis: ${item.jenis}\nTotal: Rp ${item.total}\nKategori: ${
            item.kategori || item.ke_aset
          }\nCatatan: ${item.catatan}`
        )
      }
      onLongPress={() =>
        Alert.alert(
          "Hapus Transaksi",
          "Apakah Anda yakin ingin menghapus transaksi ini?",
          [
            {
              text: "Batal",
              style: "cancel",
            },
            {
              text: "Hapus",
              onPress: () => handleDeleteTransaksi(item._id, item.jenis),
              style: "destructive",
            },
          ]
        )
      }
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemDate}>{item.tanggal}</Text>
        <Text style={styles.itemCategory}>{item.kategori || item.ke_aset}</Text>
      </View>
      <Text style={styles.itemAmount}>Rp {item.total}</Text>
      <Text style={styles.itemNote}>{item.catatan}</Text>
      <View
        style={[
          styles.statusIndicator,
          item.jenis === "Pendapatan"
            ? styles.pendapatan
            : item.jenis === "Pengeluaran"
            ? styles.pengeluaran
            : styles.transfer,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Pengeluaran: Rp {pengeluaran.toLocaleString()} | Pendapatan: Rp{" "}
          {pendapatan.toLocaleString()} | Total: Rp {total.toLocaleString()}
        </Text>
      </View>

      {transaksi.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.noDataContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.title}>Transaksi</Text>
          <Text style={styles.text}>Tidak ada data</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={transaksi}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTransaksi")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    marginTop: -22,
    marginLeft: -22,
    marginRight: -20,
    alignItems: "center",
  },
  summaryText: {
    color: "#333",
    fontSize: 10.5,
    fontWeight: "bold",
  },
  title: {
    color: "#333",
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    color: "#333",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  itemDate: {
    color: "#666",
    fontSize: 12,
  },
  itemCategory: {
    color: "#666",
    fontSize: 12,
  },
  itemAmount: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemNote: {
    color: "#666",
    fontSize: 14,
    marginTop: 5,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  pendapatan: {
    backgroundColor: "#007BFF",
  },
  pengeluaran: {
    backgroundColor: "#FF0000",
  },
  transfer: {
    backgroundColor: "#808080",
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
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TransaksiScreen;
