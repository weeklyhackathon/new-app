import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  console.log("new layout");
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00ff00",
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "black",
            borderTopColor: "#00ff00",
            borderTopWidth: 1,
            height: 70, // 40% taller than default ~50px
            paddingTop: 8, // Move icons to top
          },
          default: {
            backgroundColor: "black",
            borderTopColor: "#00ff00",
            borderTopWidth: 1,
            height: 70,
            paddingTop: 8,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="terminal"
              size={28}
              color={focused ? "#00ff00" : "#00ff00aa"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="github"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="logo-github"
              size={28}
              color={focused ? "#00ff00" : "#00ff00aa"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="trophy"
              size={28}
              color={focused ? "#00ff00" : "#00ff00aa"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={28}
              color={focused ? "#00ff00" : "#00ff00aa"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubbles"
              size={28}
              color={focused ? "#00ff00" : "#00ff00aa"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
