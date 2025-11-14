import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

interface DrinkRecord {
  time: string;
  amount: number;
}

interface HistoryItem {
  date: string;
  total: number;
  goal: number;
  times?: DrinkRecord[];
}

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const fadeAnim = new Animated.Value(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isFocused = useIsFocused(); // <-- listener fokus page

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem("history");
    if (stored) {
      const parsed = JSON.parse(stored);
      const list = Object.entries(parsed)
        .map(([date, value]: any) => ({
          date,
          total: value.total,
          goal: value.goal,
          times: value.logs || [], // penting! samain sama Home
        }))
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      setHistory(list);

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    if (isFocused) loadHistory(); // reload tiap buka halaman
  }, [isFocused]);

  const styles = getStyles(isDark);

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const progress = Math.round((item.total / item.goal) * 100);
    const achieved = item.total >= item.goal;

    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View>
          <Text style={styles.date}>{item.date}</Text>
          <Text
            style={[
              styles.goal,
              { color: achieved ? "#4CAF50" : isDark ? "#B0BEC5" : "#555" },
            ]}
          >
            Goal: {item.goal} ml ({progress}%)
          </Text>
          {item.times && item.times.length > 0 && (
            <View style={styles.timeList}>
              {item.times.map((t, i) => (
                <Text key={i} style={styles.timeItem}>
                  {t.time} — +{t.amount} ml
                </Text>
              ))}
            </View>
          )}
          <Text style={styles.total}>Total: {item.total} ml</Text>
          {achieved && (
            <Text style={styles.achieved}>
              🎉 Selamat! Kamu sudah mencapai target harianmu!
            </Text>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Minum Air</Text>
      {history.length === 0 ? (
        <Text style={styles.noData}>Belum ada data minum hari ini</Text>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#0A0F14" : "#E0F7FA",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: isDark ? "#4FC3F7" : "#01579B",
      textAlign: "center",
      marginBottom: 20,
    },
    card: {
      backgroundColor: isDark ? "#1E1E1E" : "rgba(255,255,255,0.9)",
      padding: 16,
      borderRadius: 16,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    date: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#81D4FA" : "#0277BD",
      marginBottom: 4,
    },
    goal: {
      fontSize: 14,
      marginBottom: 8,
      fontWeight: "500",
    },
    timeList: {
      marginTop: 4,
      marginBottom: 6,
    },
    timeItem: {
      fontSize: 13,
      color: isDark ? "#B2EBF2" : "#004D40",
      marginVertical: 1,
    },
    total: {
      fontSize: 15,
      color: isDark ? "#81C784" : "#00796B",
      fontWeight: "bold",
      marginTop: 4,
    },
    achieved: {
      marginTop: 8,
      fontSize: 14,
      color: "#4CAF50",
      fontWeight: "600",
    },
    noData: {
      textAlign: "center",
      color: isDark ? "#90A4AE" : "#555",
      fontSize: 16,
      marginTop: 40,
    },
  });

export default History;
