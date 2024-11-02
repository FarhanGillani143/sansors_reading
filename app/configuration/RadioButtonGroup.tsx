import React, { useState } from "react";
import {
  Text,
  View,
  ViewStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SpeedUnits } from "../../types/DataTypes";

// Generic type that can either be a boolean or speedUnitType
type GenericType = boolean | SpeedUnits;

// Type for radio button options, each option has a label and a value of type T
type OptionsType<T extends GenericType> = {
  label: string;
  value: T;
};

// Props for the RadioButtonGroup component
type Props<T extends GenericType> = {
  value: T; // The current selected value
  options: OptionsType<T>[]; // Array of options for the radio buttons
  style?: StyleProp<ViewStyle>; // Optional style for the container
  updateValueAsync(value: T): Promise<void>; // Callback to handle value selection
};

// RadioButtonGroup component that supports generic values (boolean or speedUnitType)
export default function RadioButtonGroup<T extends GenericType>({
  value,
  style,
  options,
  updateValueAsync,
}: Props<T>) {
  const [selectedValue, setSelectedValue] = useState<T>(value); // State to track the selected value

  /**
   * Handles press event when a radio button is selected.
   * Updates the local state and triggers the parent callback.
   */
  const handlePress = async (value: T) => {
    setSelectedValue(value); // Update the selected value locally
    await updateValueAsync(value); // Notify the parent component of the new selected value
  };

  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.radioContainer}
          onPress={() => handlePress(option.value)}
        >
          {/* Radio button visual */}
          <View style={styles.radio}>
            {/* Show inner circle if the option is selected */}
            {selectedValue === option.value && (
              <View style={styles.selectedRadio} />
            )}
          </View>
          {/* Display the label for the radio option */}
          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    gap: 20,
    flexDirection: "row", // Align options horizontally
    justifyContent: "space-evenly", // Space out the options evenly
  },
  radioContainer: {
    marginVertical: 5,
    flexDirection: "row", // Align the radio button and label horizontally
    alignItems: "center", // Vertically center the radio button and label
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10, // Make the radio button circular
    borderColor: "#007AFF", // Blue color for the border of the radio button
    alignItems: "center",
    justifyContent: "center", // Center the inner circle within the radio button
  },
  selectedRadio: {
    width: 12,
    height: 12,
    borderRadius: 6, // Make the inner selected circle smaller and circular
    backgroundColor: "#007AFF", // Blue color for the selected inner circle
  },
  optionText: {
    fontSize: 16, // Font size for the option label
    marginLeft: 10, // Add space between the radio button and the label
  },
});
