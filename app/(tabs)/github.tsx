import { View, Text, FlatList, Image, Pressable, Linking } from "react-native";
import { useFarcaster } from "@/components/providers/FarcasterProvider";
import sdk from "@farcaster/frame-sdk";

interface GitHubCommit {
  id: string;
  username: string;
  avatarUrl: string;
  repository: string;
  message: string;
  timestamp: Date;
  additions: number;
  deletions: number;
  githubUrl: string;
}

const commitMessages = [
  "Initial frame setup and configuration",
  "Add basic frame rendering logic",
  "Implement frame state management",
  "Add frame navigation controls",
  "Fix frame rendering performance issues",
  "Implement frame caching mechanism",
  "Add frame animation transitions",
  "Update frame styling and UI",
  "Implement frame interaction handlers",
  "Add frame error boundary handling",
  "Optimize frame loading performance",
  "Add frame accessibility features",
  "Implement frame data persistence",
  "Add frame testing infrastructure",
  "Update frame documentation",
  "Fix frame memory leaks",
  "Add frame analytics integration",
  "Implement frame security measures",
  "Add frame internationalization",
  "Update frame dependencies",
  "Fix frame cross-browser issues",
  "Add frame responsive design",
  "Implement frame SEO optimizations",
  "Add frame CI/CD pipeline",
  "Update frame build process",
  "Fix frame deployment issues",
  "Add frame monitoring tools",
  "Implement frame backup system",
  "Add frame version control",
  "Update frame security patches",
];

export default function GitHubScreen() {
  const { hackers } = useFarcaster();

  const commits: GitHubCommit[] = hackers
    .flatMap((hacker) =>
      commitMessages.map((message, index) => ({
        id: `${hacker.id}-${index}`,
        username: hacker.username,
        avatarUrl: hacker.pfp_url,
        repository: hacker.github_url.split("/").pop() || "",
        message,
        timestamp: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ),
        additions: Math.floor(Math.random() * 200) + 1,
        deletions: Math.floor(Math.random() * 100),
        githubUrl: hacker.github_url,
      }))
    )
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const renderCommit = ({ item }: { item: GitHubCommit }) => (
    <View className="mx-4 my-2 rounded-lg bg-black border border-[#00ff00] p-4">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.avatarUrl }}
          className="h-10 w-10 rounded-full border border-[#00ff00]"
        />
        <View className="ml-3">
          <Text className="font-mono font-bold text-[#00ff00]">
            {item.username}
          </Text>
          <Text className="font-mono text-sm text-[#00ff00]/70">
            {item.repository}
          </Text>
        </View>
      </View>

      <Pressable
        className="mt-2"
        onPress={async () => {
          const context = await sdk.context;
          if (context) {
            sdk.actions.openUrl(
              `https://warpcast.com/~/frames/launch?domain=${item.githubUrl}`
            );
          } else {
            Linking.openURL(item.githubUrl);
          }
        }}
      >
        <Text className="font-mono text-[#00ff00]">{item.message}</Text>
      </Pressable>

      <View className="mt-3 flex-row justify-between">
        <Text className="font-mono text-sm text-[#00ff00]">
          +{item.additions}
        </Text>
        <Text className="font-mono text-sm text-[#ff3333]">
          -{item.deletions}
        </Text>
        <Text className="font-mono text-sm text-[#00ff00]/70">
          {item.timestamp.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={commits}
        renderItem={renderCommit}
        keyExtractor={(item) => item.id}
        className="pt-4"
      />
    </View>
  );
}
