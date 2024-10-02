import React, { useState } from "react";
import {
  Text,
  View,
  ViewStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type GenericType = boolean | string;

type OptionsType<T extends GenericType> = {
  label: string;
  value: T;
};

type Props<T extends GenericType> = {
  options: OptionsType<T>[];
  style?: StyleProp<ViewStyle>;
};

export default function RadioButtonGroup<T extends GenericType>({
  style,
  options,
}: Props<T>) {
  const [selectedValue, setSelectedValue] = useState<T>(); // State to track selected value

  function handlePress(value: T) {
    setSelectedValue(value); // Update the selected value
  }

  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.radioContainer}
          onPress={() => handlePress(option.value)}
        >
          <View style={styles.radio}>
            {selectedValue === option.value && (
              <View style={styles.selectedRadio} />
            )}
          </View>
          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  radioContainer: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#007AFF", // Color for the radio button
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF", // Color for the selected radio button
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
