import React, { useRef } from "react";
import {
  Text,
  View,
  Platform,
  StyleProp,
  TextInput,
  ViewStyle,
  StyleSheet,
} from "react-native";

interface Props {
  value: number;
  description: string;
  speedUnit: "kph" | "mph";
  style?: StyleProp<ViewStyle>;
  getSelectedValue(speed: number): void;
}

export default function SettingsInputField({
  style,
  value,
  speedUnit,
  description,
  getSelectedValue,
}: Props) {
  const selectedValueRef = useRef<number>(value);

  const handleChange = (text: string) =>
    (selectedValueRef.current = Number(text));

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.valueBox}>
        <TextInput
          style={styles.inputField}
          placeholder={`${value}`}
          returnKeyType="done"
          keyboardType="number-pad"
          placeholderTextColor={"silver"}
          onBlur={() => getSelectedValue(selectedValueRef.current)}
          onChange={(changeEvent) => handleChange(changeEvent.nativeEvent.text)}
        />
        <Text style={{ fontSize: 14 }}>
          {speedUnit === "kph" ? "KM/H" : "Miles/H"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  description: {
    fontSize: 16,
  },
  valueBox: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  inputField: {
    borderWidth: 1,
    textAlign: 'center',
    borderColor: "black",
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 5 : 0,
  },
});
