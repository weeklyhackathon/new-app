import React from "react";
import "../global.css";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import Head from "expo-router/head";

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import sdk from "@farcaster/frame-sdk";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const frameContext = await sdk.context;
      if (frameContext?.user) {
        sdk.actions.ready();
      }
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      console.log("Splash screen hidden");
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Head>
        <title>$hackathon</title>
        <meta
          name="description"
          content="0x3dF58A5737130FdC180D360dDd3EFBa34e5801cb"
        />
        <meta
          name="fc:frame"
          content='{"version":"next","imageUrl":"https://github.com/jpfraneto/images/blob/main/hackathontoken.png?raw=true","button":{"title":"$hackathon","action":{"type":"launch_frame","name":"$hackathon","url":"https://hackathontoken.com","splashImageUrl":"https://github.com/jpfraneto/images/blob/main/hackathon.png?raw=true","splashBackgroundColor":"#141413"}}}'
        />
      </Head>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </>
  );
}
