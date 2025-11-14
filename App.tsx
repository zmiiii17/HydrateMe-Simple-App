import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Home from "./screens/Home";
import Quotes from "./screens/Quotes";
import History from "./screens/History";
import Settings from "./screens/Settings";
import SplashScreen from "./screens/SplashScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs({ dailyGoal, setDailyGoal }: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: { backgroundColor: "#0288D1", borderTopWidth: 0, height: 65, paddingBottom: 8 },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#b3e5fc",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "water";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Quotes") iconName = "chatbubbles";
          else if (route.name === "History") iconName = "time";
          else if (route.name === "Settings") iconName = "settings";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">{() => <Home dailyGoal={dailyGoal} />}</Tab.Screen>
      <Tab.Screen name="Quotes" component={Quotes} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Settings">{() => <Settings dailyGoal={dailyGoal} setDailyGoal={setDailyGoal} />}</Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [dailyGoal, setDailyGoal] = useState(2000);

  useEffect(() => {
    const loadGoal = async () => {
      const storedGoal = await AsyncStorage.getItem("dailyGoal");
      if (storedGoal) setDailyGoal(parseInt(storedGoal));
    };
    loadGoal();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash">
          {(props) => <SplashScreen {...props} nextScreen="Main" />}
        </Stack.Screen>
        <Stack.Screen name="Main">
          {() => <MainTabs dailyGoal={dailyGoal} setDailyGoal={setDailyGoal} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
