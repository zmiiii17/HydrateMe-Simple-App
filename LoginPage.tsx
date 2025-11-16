import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";

const LoginPage = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace("Main");
    }, 1500);
  };

  return (
    <View style={styles.container}>

      {/* === LOGO DARI ASSETS === */}
      <Image
        source={require("../assets/HydrateMe.png")}
        style={styles.mainLogo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome Back</Text>

      {/* INPUT NAME */}
      <TextInput
        placeholder="Enter your name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* INPUT PASSWORD */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.forgotBtn}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* LOGIN BUTTON */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>Or continue with</Text>

      {/* === SOCIAL ICONS === */}
      <View style={styles.socialContainer}>
        {/* FACEBOOK PNG REAL */}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/124/124010.png",
          }}
          style={styles.icon}
        />
        {/* GOOGLE PNG REAL */}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
          }}
          style={styles.icon}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  mainLogo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
  },

  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
  },

  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },

  forgotText: {
    color: "#007BFF",
  },

  loginBtn: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 25,
  },

  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  orText: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
    color: "#888",
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
  },

  icon: {
    width: 50,
    height: 50,
  },
});

export default LoginPage;
