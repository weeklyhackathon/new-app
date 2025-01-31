import { View, Text, Image, Pressable } from "react-native";
import { Stack } from "expo-router";
import { useFarcaster } from "@/components/providers/FarcasterProvider";
import React, { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import weeklyHackathonAbi from "@/lib/weekly_hackathon_abi.json";

const WEEKLY_HACKATHON_CONTRACT_ADDRESS =
  "0x9D341F2dBB7b77f77C051CbBF348F4BF5C858Fab";

export default function ProfileScreen() {
  const [hasNFT, setHasNFT] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const { isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const { address } = useAccount();

  const { data: tokenBalance } = useReadContract({
    address: WEEKLY_HACKATHON_CONTRACT_ADDRESS as `0x${string}`,
    abi: weeklyHackathonAbi,
    functionName: "balanceOf",
    args: [address],
  }) as { data: bigint | undefined };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const context = await sdk.context;
        if (!context?.user) {
          setError("No Farcaster user found");
          setIsLoading(false);
          return;
        }

        setUserProfile({
          username: context.user.username,
          displayName: context.user.displayName,
          pfpUrl: context.user.pfpUrl,
        });

        if (tokenBalance && tokenBalance > 0n) {
          setHasNFT(true);
        }
      } catch (err) {
        setError("Error loading profile");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [tokenBalance]);

  const handleMint = useCallback(async () => {
    if (isMinting) return;

    setIsMinting(true);
    setError(null);
    setMintSuccess(false);

    if (!isConnected) {
      setError("Please connect your wallet first");
      setIsMinting(false);
      return;
    }

    const context = await sdk.context;
    if (!context?.user?.fid) {
      sdk.actions.openUrl(
        "https://warpcast.com/~/frames/launch?domain=hackathontoken.com"
      );
      setIsMinting(false);
      return;
    }

    try {
      console.log("📝 Calling mintPassport contract function...");
      const tx = await writeContract({
        address: WEEKLY_HACKATHON_CONTRACT_ADDRESS as `0x${string}`,
        abi: weeklyHackathonAbi,
        functionName: "mintPassport",
        args: [BigInt(context.user.fid)],
      });
      console.log("✅ Transaction submitted:", tx);
      setMintSuccess(true);
      setHasNFT(true);
    } catch (err) {
      console.log("❌ Mint failed!");
      console.error("Error details:", err);

      if (err instanceof Error) {
        console.log("🚫 Error message:", err.message);
        setError(err.message);
      } else {
        console.log("⚠️ Unknown error type:", err);
        setError("An unknown error occurred while minting");
      }
    } finally {
      setIsMinting(false);
    }
  }, [isConnected, writeContract, isMinting]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-[#00ff00] font-mono">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerStyle: { backgroundColor: "#000000" },
          headerTintColor: "#00ff00",
          headerTitleStyle: { fontFamily: "monospace" },
        }}
      />
      <View className="flex-1 bg-black">
        <View className="items-center pt-8">
          <Image
            source={{
              uri: userProfile?.pfpUrl || "https://i.imgur.com/default.png",
            }}
            className="h-24 w-24 rounded-full border-2 border-[#00ff00]"
          />
          <Text className="mt-4 text-2xl font-mono text-[#00ff00]">
            {">"} {userProfile?.displayName || "Anon"}
          </Text>
          <Text className="font-mono text-[#00ff00]/70">
            @{userProfile?.username || "unknown"}
          </Text>
        </View>

        {hasNFT ? (
          <View className="mt-8 px-4">
            <View className="border border-[#00ff00] rounded-lg p-4">
              <Text className="text-lg font-mono text-[#00ff00]">
                Hacker Pass Active
              </Text>
            </View>
          </View>
        ) : (
          <View className="mt-8 px-4 items-center">
            <Pressable
              onPress={handleMint}
              disabled={isMinting}
              className={`bg-black border-2 ${
                isMinting ? "border-gray-500" : "border-[#00ff00]"
              } rounded-lg p-4`}
            >
              <Text
                className={`text-lg font-mono ${
                  isMinting ? "text-gray-500" : "text-[#00ff00]"
                }`}
              >
                {isMinting ? "Minting..." : "Mint Hacker Pass"}
              </Text>
            </Pressable>
          </View>
        )}

        {mintSuccess && !error && (
          <Text className="mt-4 text-[#00ff00] text-center font-mono">
            Successfully minted your Hacker Pass!
          </Text>
        )}

        {error && (
          <Text className="mt-4 text-red-500 text-center font-mono">
            {error}
          </Text>
        )}
      </View>
    </>
  );
}
