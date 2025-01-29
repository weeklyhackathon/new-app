import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import sdk from "@farcaster/frame-sdk";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

export default function MessagesScreen() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isDeployed, setIsDeployed] = useState(false);
  const [showRawCode, setShowRawCode] = useState(false);

  // Hardcoded sample HTML code for demo
  const sampleHtmlCode = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: system-ui;
    }
    .button {
      padding: 10px 20px;
      background: #00ff00;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="container">
    <button class="button" onclick="incrementCounter()">
      Click me!
    </button>
    <p id="counter">Counter: 0</p>
  </div>

  <script>
    let count = 0;
    function incrementCounter() {
      count++;
      document.getElementById('counter').textContent = 'Counter: ' + count;
    }
  </script>
</body>
</html>
`;

  const generateFrame = async () => {
    if (prompt.trim().length === 0 || isLoading) return;

    setIsLoading(true);
    try {
      const frameContext = await sdk.context;
      console.log("the frame context is: ", frameContext);
      const response = await fetch(
        "https://farcaster.anky.bot/weeklyhackathon/generate-frame-from-prompt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            context: frameContext,
            timestamp: Date.now(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate frame");
      }

      const data = await response.json();
      console.log("the data is:", data);
      setGeneratedCode(data.code);
    } catch (error) {
      console.error("Error generating frame:", error);
      // You may want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(generatedCode);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const deployFrame = () => {
    setIsDeployed(true);
  };

  const processCustomDomainPayment = async () => {
    try {
      // Simulate API call to get payment link
      const paymentLink =
        "https://farcaster.anky.bot/weeklyhackathon/pay-custom-domain";

      // Open payment link
      await WebBrowser.openBrowserAsync(paymentLink);
    } catch (error) {
      console.error("Failed to process payment:", error);
    }
  };

  return (
    <View className="flex-1 bg-black p-4">
      {!generatedCode ? (
        <View className="flex-1">
          <Text className="text-[#00ff00] text-lg mb-4 font-mono">
            Write a prompt to generate a farcaster frame:
          </Text>
          <TextInput
            className="border border-[#00ff00] rounded-lg px-4 py-2 mb-4 bg-black text-[#00ff00] font-mono"
            placeholder={
              [
                "Create a frame that lets users vote on their favorite meme...",
                "Build a frame that generates AI art from text prompts...",
                "Design a frame for sharing NFT collections...",
                "Make a frame for scheduling Farcaster spaces...",
              ][Math.floor((Date.now() / 1000) % 4)]
            }
            placeholderTextColor="#00ff00aa"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={generateFrame}
            disabled={isLoading}
            className={`border border-[#00ff00] p-4 rounded-lg items-center ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="#00ff00" />
            ) : (
              <Text className="text-[#00ff00] font-mono">Generate Frame</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          <View className="flex-row justify-end mb-2 space-x-2">
            <TouchableOpacity
              onPress={deployFrame}
              className="p-2 rounded-full bg-[#00ff00]/10"
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#00ff00" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowRawCode(!showRawCode)}
              className="p-2 rounded-full bg-[#00ff00]/10"
            >
              <Ionicons name="code-outline" size={24} color="#00ff00" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={copyToClipboard}
              className="p-2 rounded-full bg-[#00ff00]/10"
            >
              <Ionicons name="copy-outline" size={24} color="#00ff00" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 border-2 border-[#00ff00] rounded-lg overflow-hidden">
            {showRawCode ? (
              <Text className="text-[#00ff00] font-mono text-sm p-4">
                {generatedCode}
              </Text>
            ) : (
              <WebView
                source={{ html: generatedCode }}
                style={{ backgroundColor: "transparent" }}
              />
            )}
          </View>

          {isDeployed && (
            <View className="items-center mt-4">
              <TouchableOpacity
                onPress={processCustomDomainPayment}
                className="border border-[#00ff00] px-4 py-2 rounded-lg mb-2 w-full items-center"
              >
                <Text className="text-[#00ff00] font-mono">CUSTOM DOMAIN</Text>
              </TouchableOpacity>
              <Text className="text-[#00ff00] font-mono text-sm">
                1.618033 USDC
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
