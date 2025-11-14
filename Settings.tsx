import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Alert, ScrollView, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsProps {
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ dailyGoal, setDailyGoal }) => {
  const [goalInput, setGoalInput] = useState(dailyGoal.toString());
  const [reminder, setReminder] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showQuotes, setShowQuotes] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedReminder = await AsyncStorage.getItem("reminder");
        const storedDark = await AsyncStorage.getItem("darkMode");
        const storedQuotes = await AsyncStorage.getItem("showQuotes");

        if (storedReminder) setReminder(JSON.parse(storedReminder));
        if (storedDark) setDarkMode(JSON.parse(storedDark));
        if (storedQuotes) setShowQuotes(JSON.parse(storedQuotes));
      } catch (e) {
        console.log("Failed to load settings:", e);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const saveGoal = async () => {
    const newGoal = parseInt(goalInput);
    if (isNaN(newGoal) || newGoal < 500) {
      Alert.alert("Invalid Goal", "Please enter a valid number above 500 ml.");
      return;
    }
    try {
      await AsyncStorage.setItem("dailyGoal", newGoal.toString());
      setDailyGoal(newGoal);
      Alert.alert("Saved ✅", `Daily goal set to ${newGoal} ml.`);
    } catch (e) {
      Alert.alert("Error", "Failed to save goal.");
    }
  };

  const toggleSetting = async (key: string, value: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      setState(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.log("Failed to save switch:", e);
    }
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>⚙️ Settings</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Daily Goal (ml)</Text>
          <TextInput
            value={goalInput}
            onChangeText={setGoalInput}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Enter daily goal"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
            <Text style={styles.saveText}>Save Goal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.label}>⏰ Drink Reminder</Text>
          <Switch
            value={reminder}
            onValueChange={(val) => toggleSetting("reminder", val, setReminder)}
            thumbColor="#00bcd4"
          />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.label}>🌙 Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={(val) => toggleSetting("darkMode", val, setDarkMode)}
            thumbColor="#00bcd4"
          />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.label}>💬 Motivational Quotes</Text>
          <Switch
            value={showQuotes}
            onValueChange={(val) => toggleSetting("showQuotes", val, setShowQuotes)}
            thumbColor="#00bcd4"
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e0f7fa", paddingHorizontal: 20, paddingTop: 50 },
  title: { fontSize: 30, fontWeight: "bold", color: "#01579b", marginBottom: 30, textAlign: "center" },
  section: { marginBottom: 30, backgroundColor: "#ffffffaa", padding: 15, borderRadius: 15 },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#ffffffaa",
    padding: 15,
    borderRadius: 15,
  },
  label: { fontSize: 18, color: "#01579b", fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#00acc1", borderRadius: 10, padding: 10, fontSize: 16, color: "#0277bd", backgroundColor: "#fff", marginTop: 10 },
  saveButton: { marginTop: 10, backgroundColor: "#00bcd4", padding: 12, borderRadius: 10, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold" },
});

export default Settings;
