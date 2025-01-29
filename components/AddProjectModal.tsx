import { View, Text, TextInput, Pressable, Modal } from "react-native";
import { useState } from "react";
import { User } from "@privy-io/expo";

interface AddProjectModalProps {
  onClose?: () => void;
  onSubmit?: (project: {
    name: string;
    description: string;
    githubUrl: string;
  }) => void;
  user?: User;
}

export default function AddProjectModal({
  onClose,
  onSubmit,
}: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        name: projectName,
        description,
        githubUrl,
      });
      console.log("Submitted project:", {
        projectName,
        description,
        githubUrl,
      });
    }
    if (onClose) onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/80">
        <View className="w-[90%] bg-black border border-[#00ff00] rounded-lg p-6">
          <Text className="text-[#00ff00] text-xl font-bold mb-4">
            Add New Project
          </Text>

          <View className="mb-4">
            <Text className="text-[#00ff00] mb-2">Project Name</Text>
            <TextInput
              className="border border-[#00ff00] rounded p-2 text-[#00ff00]"
              value={projectName}
              onChangeText={setProjectName}
              placeholderTextColor="#00ff00aa"
              placeholder="Enter project name"
            />
          </View>

          <View className="mb-4">
            <Text className="text-[#00ff00] mb-2">Description</Text>
            <TextInput
              className="border border-[#00ff00] rounded p-2 text-[#00ff00]"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#00ff00aa"
              placeholder="Enter project description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View className="mb-6">
            <Text className="text-[#00ff00] mb-2">GitHub URL</Text>
            <TextInput
              className="border border-[#00ff00] rounded p-2 text-[#00ff00]"
              value={githubUrl}
              onChangeText={setGithubUrl}
              placeholderTextColor="#00ff00aa"
              placeholder="Enter GitHub URL"
            />
          </View>

          <View className="flex-row justify-end gap-4">
            <Pressable onPress={onClose}>
              <Text className="text-[#00ff00] p-2">Cancel</Text>
            </Pressable>
            <Pressable onPress={handleSubmit}>
              <Text className="text-[#00ff00] font-bold p-2">Submit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
