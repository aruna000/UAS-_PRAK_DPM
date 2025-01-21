import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MemoScreen = ({ navigation }) => {
  const [memos, setMemos] = useState([]);
  const [newMemo, setNewMemo] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null);

  const fetchMemos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://192.168.1.8:5000/api/memo", {
        headers: {
          "x-auth-token": token,
        },
      });
      setMemos(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Gagal mengambil data memo", "Terjadi kesalahan");
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  const handleAddMemo = async () => {
    if (newMemo.trim() === "") {
      Alert.alert("Memo tidak boleh kosong");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        "http://192.168.1.8:5000/api/memo",
        { catatan: newMemo },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setMemos([...memos, res.data]);
      setNewMemo("");
      Alert.alert("Memo berhasil ditambahkan");
    } catch (err) {
      Alert.alert("Gagal menambahkan memo", "Terjadi kesalahan");
    }
  };

  const handleEditMemo = async () => {
    if (newMemo.trim() === "") {
      Alert.alert("Memo tidak boleh kosong");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.put(
        `http://192.168.1.8:5000/api/memo/${editingMemo._id}`,
        { catatan: newMemo },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setMemos(
        memos.map((memo) =>
          memo._id === editingMemo._id ? { ...memo, catatan: newMemo } : memo
        )
      );
      setNewMemo("");
      setEditingMemo(null);
      Alert.alert("Memo berhasil diperbarui");
    } catch (err) {
      Alert.alert("Gagal memperbarui memo", "Terjadi kesalahan");
    }
  };

  const handleDeleteMemo = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://192.168.1.8:5000/api/memo/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      setMemos(memos.filter((memo) => memo._id !== id));
      Alert.alert("Memo berhasil dihapus");
    } catch (err) {
      Alert.alert("Gagal menghapus memo", "Terjadi kesalahan");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMemos().then(() => setRefreshing(false));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TextInput
        style={styles.input}
        placeholder="Tulis memo baru..."
        value={newMemo}
        onChangeText={setNewMemo}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={editingMemo ? handleEditMemo : handleAddMemo}
      >
        <Text style={styles.addButtonText}>
          {editingMemo ? "Perbarui Memo" : "Tambah Memo"}
        </Text>
      </TouchableOpacity>
      {memos.map((memo) => (
        <View key={memo._id} style={styles.memoItem}>
          <View style={styles.memoContent}>
            <Text style={styles.memoText}>{memo.catatan}</Text>
            <Text style={styles.memoDate}>
              {new Date(memo.tanggal_dibuat).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.memoActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setNewMemo(memo.catatan);
                setEditingMemo(memo);
              }}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteMemo(memo._id)}
            >
              <Text style={styles.deleteButtonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
  input: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  memoItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memoContent: {
    flex: 1,
  },
  memoText: {
    color: "#333",
    fontSize: 15,
    marginBottom: 5,
    marginRight: 15,
  },
  memoDate: {
    color: "#666",
    fontSize: 12,
  },
  memoActions: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default MemoScreen;
