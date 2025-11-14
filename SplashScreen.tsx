import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const waterAnim = useRef(new Animated.Value(height)).current; // animasi air naik

  useEffect(() => {
    // Animasi logo dan efek air
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(waterAnim, {
        toValue: height * 0.4,
        duration: 2500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Navigasi ke Main setelah animasi selesai
    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />

      {/* Lapisan air yang naik */}
      <Animated.View
        style={[
          styles.waterLayer,
          {
            transform: [{ translateY: waterAnim }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA", // warna biru muda lembut
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
    zIndex: 2,
  },
  waterLayer: {
    position: "absolute",
    bottom: 0,
    width: width * 2,
    height: height,
    backgroundColor: "rgba(0, 172, 193, 0.5)", // warna air semi transparan
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
  },
});

export default SplashScreen;
