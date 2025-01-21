import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StatistikScreen = ({ navigation }) => {
  const [pengeluaranData, setPengeluaranData] = useState([]);
  const [pendapatanData, setPendapatanData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Pengeluaran");

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

      const pengeluaranByCategory = resPengeluaran.data.reduce((acc, item) => {
        acc[item.kategori] = (acc[item.kategori] || 0) + item.total;
        return acc;
      }, {});

      const pendapatanByCategory = resPendapatan.data.reduce((acc, item) => {
        acc[item.kategori] = (acc[item.kategori] || 0) + item.total;
        return acc;
      }, {});

      const pengeluaranTotal = Object.values(pengeluaranByCategory).reduce(
        (acc, item) => acc + item,
        0
      );
      const pendapatanTotal = Object.values(pendapatanByCategory).reduce(
        (acc, item) => acc + item,
        0
      );

      const pengeluaranData = Object.keys(pengeluaranByCategory).map((key) => ({
        name: key,
        total: pengeluaranByCategory[key],
        color: getRandomColor(),
        legendFontColor: "#333",
        legendFontSize: 15,
        percentage: (
          (pengeluaranByCategory[key] / pengeluaranTotal) *
          100
        ).toFixed(2),
      }));

      const pendapatanData = Object.keys(pendapatanByCategory).map((key) => ({
        name: key,
        total: pendapatanByCategory[key],
        color: getRandomColor(),
        legendFontColor: "#333",
        legendFontSize: 15,
        percentage: (
          (pendapatanByCategory[key] / pendapatanTotal) *
          100
        ).toFixed(2),
      }));

      setPengeluaranData(pengeluaranData);
      setPendapatanData(pendapatanData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[
            styles.menuButton,
            selectedTab === "Pengeluaran" && styles.menuButtonSelected,
          ]}
          onPress={() => setSelectedTab("Pengeluaran")}
        >
          <Text
            style={[
              styles.menuButtonText,
              selectedTab === "Pengeluaran" && styles.menuButtonTextSelected,
            ]}
          >
            Pengeluaran
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuButton,
            selectedTab === "Pendapatan" && styles.menuButtonSelected,
          ]}
          onPress={() => setSelectedTab("Pendapatan")}
        >
          <Text
            style={[
              styles.menuButtonText,
              selectedTab === "Pendapatan" && styles.menuButtonTextSelected,
            ]}
          >
            Pendapatan
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "Pengeluaran" ? (
        <>
          {pengeluaranData.length > 0 ? (
            <>
              <PieChart
                data={pengeluaranData}
                width={Dimensions.get("window").width - 40}
                height={220}
                chartConfig={chartConfig}
                accessor={"total"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
              />
              <View style={styles.percentageContainer}>
                {pengeluaranData.map((item, index) => (
                  <Text key={index} style={styles.percentageText}>
                    {item.name}: {item.percentage}%
                  </Text>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.text}>Tidak ada data pengeluaran</Text>
          )}
        </>
      ) : (
        <>
          {pendapatanData.length > 0 ? (
            <>
              <PieChart
                data={pendapatanData}
                width={Dimensions.get("window").width - 40}
                height={220}
                chartConfig={chartConfig}
                accessor={"total"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
              />
              <View style={styles.percentageContainer}>
                {pendapatanData.map((item, index) => (
                  <Text key={index} style={styles.percentageText}>
                    {item.name}: {item.percentage}%
                  </Text>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.text}>Tidak ada data pendapatan</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#f5f5f5",
  backgroundGradientTo: "#f5f5f5",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  menuButton: {
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
  menuButtonSelected: {
    backgroundColor: "#007BFF",
  },
  menuButtonText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  menuButtonTextSelected: {
    color: "#fff",
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
  percentageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  percentageText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
});

export default StatistikScreen;
