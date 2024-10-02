import React from "react";
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
  description: string;
  style?: StyleProp<ViewStyle>;
}

export default function SettingsInputField({ description, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.valueBox}>
        <TextInput
          style={styles.inputField}
          placeholder="100"
          returnKeyType="done"
          keyboardType="number-pad"
          placeholderTextColor={"silver"}
        />
        <Text style={{ fontSize: 14 }}>{"KM/H"}</Text>
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
    borderColor: "black",
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 5 : 0,
  },
});
