import React from "react";
import { View, Text, Pressable, Image, Animated } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFarcaster } from "@/components/providers/FarcasterProvider";
import { useCallback, useEffect, useRef } from "react";
import sdk from "@farcaster/frame-sdk";

export default function LeaderboardScreen() {
  const { hackers } = useFarcaster();
  const scrollY = useRef(new Animated.Value(0)).current;
  const prizeAmount = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate prize amount counting up
    Animated.timing(prizeAmount, {
      toValue: 10000, // $10,000 prize pool
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Continuous floating animation for the leaderboard preview
    Animated.loop(
      Animated.sequence([
        Animated.timing(scrollY, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scrollY, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen />
      <View className="flex-1 items-center justify-center p-4">
        <Pressable
          className="bg-[#00ff00]/10 border-2 border-[#00ff00] rounded-lg px-6 py-3 mb-8"
          onPress={async () => {
            const context = await sdk.context;
            if (context) {
              await sdk.actions.addFrame();
            }
          }}
        >
          <Text className="text-[#00ff00] font-bold text-lg">
            Get Notified for next $hackathon
          </Text>
        </Pressable>

        <Animated.View
          style={{
            transform: [{ translateY: scrollY }],
          }}
          className="w-full rounded-lg bg-black border border-[#00ff00] p-4 opacity-50"
        >
          <Text className="text-[#00ff00] text-center mb-4 w-full font-mono">
            Leaderboard Preview
          </Text>
          {hackers.map((hacker) => (
            <Pressable
              onPress={() => {
                sdk.actions.viewProfile({ fid: hacker.fid });
              }}
              className="flex-row items-center justify-between py-2 border-b border-[#00ff00]/30"
            >
              <View className="flex-row items-center">
                <Text className="text-[#00ff00] w-8">#{hacker.id}</Text>
                <Image
                  source={{ uri: hacker.pfp_url }}
                  className="h-8 w-8 rounded-full border border-[#00ff00]/20 mx-2"
                />
                <Text className="text-[#00ff00]">@{hacker.username}</Text>
              </View>
              <Text className="text-[#00ff00] font-mono">
                {Math.round(1000 / hacker.id)} pts
              </Text>
            </Pressable>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}
