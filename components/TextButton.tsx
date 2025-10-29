import React from "react";
import {
  Text,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface Props {
  title: string;
  onPress: VoidFunction;
  boxStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function TextButton({
  title,
  onPress,
  boxStyle,
  textStyle,
}: Props) {
  return (
    <TouchableOpacity style={[{ margin: 10 }, boxStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    backgroundColor: "#ffffff",
    padding: 10, // Increased padding for better spacing
    borderRadius: 8, // Slightly increased for a smoother look
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
});
