import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const AddTransaksiScreen = ({ navigation }) => {
  const [tanggal, setTanggal] = useState(new Date());
  const [total, setTotal] = useState("");
  const [kategori, setKategori] = useState("");
  const [aset, setAset] = useState("");
  const [catatan, setCatatan] = useState("");
  const [jenisTransaksi, setJenisTransaksi] = useState("Pengeluaran");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTransaksi = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let url = "";
      let data = {
        tanggal: tanggal.toISOString().split("T")[0],
        total,
        kategori,
        aset,
        catatan,
      };

      if (jenisTransaksi === "Pengeluaran") {
        url = "http://192.168.1.8:5000/api/pengeluaran";
      } else if (jenisTransaksi === "Pendapatan") {
        url = "http://192.168.1.8:5000/api/pendapatan";
      } else if (jenisTransaksi === "Transfer") {
        url = "http://192.168.1.8:5000/api/transfer";
        data = {
          tanggal: tanggal.toISOString().split("T")[0],
          total,
          dari_aset: aset,
          ke_aset: kategori,
          catatan,
        };
      }

      const res = await axios.post(url, data, {
        headers: {
          "x-auth-token": token,
        },
      });

      Alert.alert("Transaksi berhasil ditambahkan", `ID: ${res.data._id}`, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Transaksi"),
        },
      ]);
    } catch (err) {
      Alert.alert("Gagal menambahkan transaksi", "Terjadi kesalahan");
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tanggal;
    setShowDatePicker(Platform.OS === "ios");
    setTanggal(currentDate);
  };

  const renderKategoriPicker = () => {
    if (jenisTransaksi === "Pengeluaran") {
      return (
        <Picker
          selectedValue={kategori}
          onValueChange={(itemValue) => setKategori(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Pilih Kategori" value="" />
          <Picker.Item label="Makanan" value="Makanan" />
          <Picker.Item label="Minuman" value="Minuman" />
          <Picker.Item label="Kebutuhan Harian" value="Kebutuhan Harian" />
        </Picker>
      );
    } else if (jenisTransaksi === "Pendapatan") {
      return (
        <Picker
          selectedValue={kategori}
          onValueChange={(itemValue) => setKategori(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Pilih Kategori" value="" />
          <Picker.Item label="Uang Bulanan" value="Uang Bulanan" />
          <Picker.Item label="Uang Saku" value="Uang Saku" />
        </Picker>
      );
    }
    return null;
  };

  const renderAsetPicker = () => {
    if (jenisTransaksi === "Pengeluaran" || jenisTransaksi === "Pendapatan") {
      return (
        <Picker
          selectedValue={aset}
          onValueChange={(itemValue) => setAset(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Pilih Aset" value="" />
          <Picker.Item label="Bank" value="Bank" />
          <Picker.Item label="Uang Tunai" value="Uang Tunai" />
        </Picker>
      );
    }
    return null;
  };

  const renderTransferFields = () => {
    if (jenisTransaksi === "Transfer") {
      return (
        <>
          <Picker
            selectedValue={aset}
            onValueChange={(itemValue) => setAset(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Uang Keluar" value="" />
            <Picker.Item label="Bank" value="Bank" />
            <Picker.Item label="Uang Tunai" value="Uang Tunai" />
          </Picker>
          <Picker
            selectedValue={kategori}
            onValueChange={(itemValue) => setKategori(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Uang Masuk" value="" />
            <Picker.Item label="Bank" value="Bank" />
            <Picker.Item label="Uang Tunai" value="Uang Tunai" />
          </Picker>
        </>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.transactionTypeContainer}>
        <TouchableOpacity
          style={[
            styles.transactionTypeButton,
            jenisTransaksi === "Pengeluaran" &&
              styles.transactionTypeButtonActive,
          ]}
          onPress={() => setJenisTransaksi("Pengeluaran")}
        >
          <Text
            style={[
              styles.transactionTypeButtonText,
              jenisTransaksi === "Pengeluaran" &&
                styles.transactionTypeButtonTextActive,
            ]}
          >
            Pengeluaran
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.transactionTypeButton,
            jenisTransaksi === "Pendapatan" &&
              styles.transactionTypeButtonActive,
          ]}
          onPress={() => setJenisTransaksi("Pendapatan")}
        >
          <Text
            style={[
              styles.transactionTypeButtonText,
              jenisTransaksi === "Pendapatan" &&
                styles.transactionTypeButtonTextActive,
            ]}
          >
            Pendapatan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.transactionTypeButton,
            jenisTransaksi === "Transfer" && styles.transactionTypeButtonActive,
          ]}
          onPress={() => setJenisTransaksi("Transfer")}
        >
          <Text
            style={[
              styles.transactionTypeButtonText,
              jenisTransaksi === "Transfer" &&
                styles.transactionTypeButtonTextActive,
            ]}
          >
            Transfer
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={showDatePickerModal} style={styles.input}>
        <Text>{tanggal.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={tanggal}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Total"
        value={total}
        onChangeText={setTotal}
        keyboardType="numeric"
      />
      {renderKategoriPicker()}
      {renderAsetPicker()}
      {renderTransferFields()}
      <TextInput
        style={styles.input}
        placeholder="Catatan"
        value={catatan}
        onChangeText={setCatatan}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddTransaksi}>
        <Text style={styles.buttonText}>Tambah</Text>
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    color: "#333",
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  transactionTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  transactionTypeButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007BFF",
    marginHorizontal: 5,
  },
  transactionTypeButtonActive: {
    backgroundColor: "#007BFF",
  },
  transactionTypeButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
  transactionTypeButtonTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  picker: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddTransaksiScreen;
