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
import { SpeedUnits } from "../../types/DataTypes";

interface Props {
  currentValue: number;
  description: string;
  speedUnit: SpeedUnits;
  style?: StyleProp<ViewStyle>;
  updateValueAsync(speed: number): Promise<void>;
}

export default function SettingsInputField({
  style,
  speedUnit,
  description,
  currentValue,
  updateValueAsync,
}: Props) {
  const inputValueRef = useRef<string>(currentValue.toString());
  const textInputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => (inputValueRef.current = text);

  const handleOnBlur = async () => {
    if (inputValueRef.current)
      await updateValueAsync(Number(inputValueRef.current));

    textInputRef.current?.clear();
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.valueBox}>
        <TextInput
          ref={textInputRef}
          style={styles.inputField}
          placeholder={`${currentValue}`}
          returnKeyType="done"
          keyboardType="number-pad"
          placeholderTextColor={"silver"}
          onBlur={handleOnBlur}
          onChange={(changeEvent) => handleChange(changeEvent.nativeEvent.text)}
        />
        <Text style={{ fontSize: 14 }}>{speedUnit}</Text>
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
    textAlign: "center",
    borderColor: "black",
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 5 : 0,
  },
});
