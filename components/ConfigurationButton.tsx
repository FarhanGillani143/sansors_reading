import React from "react";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import FeatherIcons from "react-native-vector-icons/Feather";

export default function ConfigurationButton() {
  return (
    <TouchableOpacity
      style={{ width: 40, alignItems: "center" }}
      onPress={() => router.push("/configuration")}
    >
      <FeatherIcons name="settings" size={20} />
    </TouchableOpacity>
  );
}
