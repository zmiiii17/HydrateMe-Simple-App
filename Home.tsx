import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
  TouchableOpacity,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import ButtonCard from "../components/ButtonCard";

const { width, height } = Dimensions.get("window");

export default function Home({ dailyGoal }) {
  const [waterIntake, setWaterIntake] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ANIMASI AIR NAIK
  const animatedFill = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;

  /* ===========================================================
     LOAD HISTORY HARI INI
  =========================================================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const today = moment().format("YYYY-MM-DD");
        const stored = await AsyncStorage.getItem("history");
        const history = stored ? JSON.parse(stored) : {};

        if (history[today]) {
          setWaterIntake(history[today].total || 0);
          animatedFill.setValue((history[today].total || 0) / dailyGoal);
        }
      } catch (err) {
        console.log("Load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  /* ===========================================================
     ANIMASI LOGO + GELEMBUNG
  =========================================================== */
  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bubbleAnim, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnim, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  /* ===========================================================
     SAVE HISTORY + WAKTU MINUM
  =========================================================== */
  const saveProgress = async (newAmount, amount) => {
    const today = moment().format("YYYY-MM-DD");
    const time = moment().format("HH:mm");

    const stored = await AsyncStorage.getItem("history");
    const history = stored ? JSON.parse(stored) : {};

    if (!history[today]) {
      history[today] = { total: 0, goal: dailyGoal, logs: [] };
    }

    history[today].total = newAmount;
    history[today].logs.push({ time, amount });

    await AsyncStorage.setItem("history", JSON.stringify(history));
  };

  /* ===========================================================
     TAMBAH AIR
  =========================================================== */
  const addWater = async (amount) => {
    const newIntake = Math.min(waterIntake + amount, dailyGoal);

    setWaterIntake(newIntake);
    await saveProgress(newIntake, amount);

    Animated.timing(animatedFill, {
      toValue: newIntake / dailyGoal,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  /* ===========================================================
     RESET
  =========================================================== */
  const resetWater = async () => {
    const today = moment().format("YYYY-MM-DD");
    const stored = await AsyncStorage.getItem("history");
    const history = stored ? JSON.parse(stored) : {};

    history[today] = { total: 0, goal: dailyGoal, logs: [] };
    await AsyncStorage.setItem("history", JSON.stringify(history));

    setWaterIntake(0);
    Animated.timing(animatedFill, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  /* ===========================================================
     ANIMASI AIR (HEIGHT)
  =========================================================== */
  const waterHeight = animatedFill.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: "#fff" }}>Loading…</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/736x/84/e7/ea/84e7eaa0ab44c597c0677e3eddbcf8eb.jpg",
      }}
      style={styles.bg}
      imageStyle={{ opacity: 0.9 }}
    >
      <View style={styles.overlay}>
        {/* LOGO */}
        <Animated.Image
          source={require("../assets/HydrateMe.png")}
          style={[
            styles.logo,
            {
              opacity: logoAnim,
              transform: [
                { scale: logoAnim },
                {
                  translateY: bubbleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -6],
                  }),
                },
              ],
            },
          ]}
          resizeMode="contain"
        />

        {/* WATER FILL */}
        <View style={styles.waterContainer}>
          <Animated.View style={[styles.waterFill, { height: waterHeight }]} />
          <Text style={styles.waterText}>
            {waterIntake} / {dailyGoal} ml
          </Text>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttons}>
          <ButtonCard label="+250 ml" onPress={() => addWater(250)} />
          <ButtonCard label="+500 ml" onPress={() => addWater(500)} />
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetWater}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

/* ===========================================================
   STYLES
=========================================================== */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  logo: {
    width: width * 0.8,
    height: 120,
    marginBottom: 10,
  },

  waterContainer: {
    width: "70%",
    height: 220,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 20,
  },

  waterFill: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#4FC3F7",
    borderRadius: 20,
  },

  waterText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  buttons: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },

  resetButton: {
    marginTop: 25,
    backgroundColor: "#FF7043",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },

  resetText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
