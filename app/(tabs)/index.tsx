import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  Linking,
} from "react-native";
import Head from "expo-router/head";
import { useFarcaster } from "@/components/providers/FarcasterProvider";
import sdk from "@farcaster/frame-sdk";
import { Ionicons } from "@expo/vector-icons";

interface Question {
  id: string;
  username: string;
  displayName: string;
  pfpUrl: string;
  title: string;
  body: string;
  timestamp: Date;
  tags: string[];
  votes: number;
  github: string;
  answers: number;
  projectUrl: string;
}

export default function FeedScreen() {
  const { hackers } = useFarcaster();

  const questionTemplates = [
    {
      title: "How can I optimize my Frame project's performance?",
      body: "I'm building a Frame project and noticing some latency issues. What are the best practices for optimizing Frame performance and reducing load times?",
      tags: ["performance", "optimization", "frames"],
    },
    {
      title: "What's the best way to handle state in Frames?",
      body: "I'm struggling with state management in my Frame project. Should I use local storage, external databases, or something else?",
      tags: ["state-management", "architecture", "frames"],
    },
    {
      title: "How to implement secure authentication in Frames?",
      body: "Looking for guidance on implementing secure user authentication in my Frame project. What are the recommended approaches?",
      tags: ["security", "authentication", "frames"],
    },
    {
      title: "Best practices for Frame UI/UX design?",
      body: "What are some recommended design patterns and best practices for creating an intuitive and engaging user experience in Frames?",
      tags: ["design", "ui-ux", "frames"],
    },
    {
      title: "How to handle API rate limiting in Frames?",
      body: "My Frame project is hitting API rate limits. What strategies can I use to handle this gracefully and optimize API usage?",
      tags: ["api", "optimization", "frames"],
    },
  ];

  const questions: Question[] = hackers.map((hacker, index) => ({
    id: hacker.id.toString(),
    username: hacker.username,
    displayName: hacker.display_name,
    pfpUrl: hacker.pfp_url,
    title: questionTemplates[index % questionTemplates.length].title,
    github: hacker.github_url,
    body: questionTemplates[index % questionTemplates.length].body,
    timestamp: new Date(),
    tags: questionTemplates[index % questionTemplates.length].tags,
    votes: Math.floor(Math.random() * 50) + 1,
    answers: Math.floor(Math.random() * 10),
    projectUrl: hacker.project_url,
  }));

  const renderQuestion = ({ item }: { item: Question }) => (
    <TouchableOpacity className="bg-black border border-[#00ff00] p-4 mb-4 rounded-lg shadow-lg">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image
            source={{ uri: item.pfpUrl }}
            className="h-6 w-6 rounded-full border border-[#00ff00] mr-2"
          />
          <Text className="text-[#00ff00] font-mono text-sm">
            {">"} {item.username}
          </Text>
        </View>
        <Text className="text-[#00ff00]/70 font-mono text-xs">
          {item.timestamp.toLocaleDateString()}
        </Text>
      </View>

      <Text className="text-[#00ff00] font-mono font-bold mt-2">
        {item.title}
      </Text>

      <Text className="text-[#00ff00]/90 font-mono mt-2 mb-3" numberOfLines={2}>
        {item.body}
      </Text>
      <View className="flex gap-2 flex-row w-full">
        <Pressable
          className="mb-3 px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00] rounded self-start"
          onPress={async () => {
            const context = await sdk.context;
            if (context) {
              sdk.actions.openUrl(
                `https://warpcast.com/~/frames/launch?domain=${item.projectUrl}`
              );
            } else {
              Linking.openURL(item.projectUrl);
            }
          }}
        >
          <Text className="text-[#00ff00] font-mono">View Project</Text>
        </Pressable>
        <Pressable
          className="mb-3 px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00] rounded self-start"
          onPress={async () => {
            const context = await sdk.context;
            if (context) {
              sdk.actions.openUrl(
                `https://warpcast.com/~/frames/launch?domain=${item.github}`
              );
            } else {
              Linking.openURL(item.github);
            }
          }}
        >
          <Text className="text-[#00ff00] font-mono">Github</Text>
        </Pressable>
      </View>

      <View className="flex-row flex-wrap gap-2 mb-3">
        {item.tags.map((tag, index) => (
          <View
            key={index}
            className="bg-[#00ff00]/10 border border-[#00ff00] rounded-sm px-3 py-1"
          >
            <Text className="text-xs text-[#00ff00] font-mono">
              {`<${tag}/>`}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="arrow-up" size={16} color="#00ff00" />
          <Text className="ml-1 text-[#00ff00] font-mono">{item.votes}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={16} color="#00ff00" />
          <Text className="ml-1 text-[#00ff00] font-mono">{item.answers}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
      <View className="flex-1 bg-black">
        <FlatList
          data={questions}
          renderItem={renderQuestion}
          keyExtractor={(item) => item.id}
          className="p-4"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}
