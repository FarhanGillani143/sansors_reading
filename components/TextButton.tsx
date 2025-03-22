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
    fontSize: 19,
    color: "#000000",
    textAlign: "center",
    backgroundColor:'#ffffff',
    padding:6,
    borderRadius:5,
  },
});
