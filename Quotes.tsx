import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Animated } from "react-native";

const quotesArray: string[] = [
  "Thousands have lived without love, not one without water. – W.H. Auden",
  "Water is the driving force of all nature. – Leonardo da Vinci",
  "The cure for anything is salt water: sweat, tears or the sea. – Isak Dinesen",
  "With every drop of water you drink, every breath you take, you are connected to the sea. – Sylvia Earle",
  "Pure water is the world’s first and foremost medicine. – Slovakian Proverb",
  "You don’t have to be extreme, just consistent. – Unknown",
  "Take care of your body. It’s the only place you have to live. – Jim Rohn",
  "A healthy outside starts from the inside. – Robert Urich",
  "The difference between who you are and who you want to be is what you do. – Unknown",
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
];

const { width, height } = Dimensions.get("window");

const Quotes: React.FC = () => {
  const [quote, setQuote] = useState<string>(quotesArray[0]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const randomQuote = () => {
    let q: string;
    do {
      q = quotesArray[Math.floor(Math.random() * quotesArray.length)];
    } while (q === quote);
    setQuote(q);
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" }}
      style={styles.bg}
      blurRadius={2}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Daily Hydration Quote</Text>
        <Text style={styles.quote}>"{quote}"</Text>
        <TouchableOpacity style={styles.button} onPress={randomQuote} activeOpacity={0.8}>
          <Text style={styles.btnText}>New Quote</Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    width: width * 0.85,
    minHeight: height * 0.5,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  quote: { fontSize: 20, fontStyle: "italic", color: "#e0f7fa", textAlign: "center", marginBottom: 30, lineHeight: 28 },
  button: { backgroundColor: "#00acc1", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default Quotes;
