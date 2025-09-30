import React from "react";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import FeatherIcons from "react-native-vector-icons/Feather";

export default function SignupButton() {
  return (
    <TouchableOpacity
      style={{
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
      }}
      onPress={() => router.push("/signup")}
    >
      <FeatherIcons name="user-plus" size={22} color="#333" />
    </TouchableOpacity>
  );
}
