import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorContext";

type OptionType = {
  label: string;
  value: number;
};

const timeIntervalOptions: OptionType[] = [
  { label: "0.2s", value: 200 },
  { label: "0.4s", value: 400 },
  { label: "0.6s", value: 600 },
  { label: "0.8s", value: 800 },
  { label: "1.0s", value: 1000 },
  { label: "1.2s", value: 1200 },
  { label: "1.4s", value: 1400 },
  { label: "1.6s", value: 1600 },
  { label: "1.8s", value: 1800 },
  { label: "2.0s", value: 2000 },
];

export default function SensorTimeInterval() {
  const { timeInterval, updateTimeIntervalAsync } =
    useContext<SensorContextType>(SensorsContext);

  /**
   * Applies a new time interval for sensor data collection.
   */
  const applyNewInterval = async ({ label, value }: OptionType) => {
    // If the new value is different from the current interval, update it
    if (value !== timeInterval) {
      await updateTimeIntervalAsync(value);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Time Interval</Text>
      <Dropdown
        style={styles.box}
        containerStyle={styles.dropdown}
        labelField="label" // Field name for the displayed label
        valueField="value" // Field name for the actual value
        data={timeIntervalOptions} // Available time interval options
        placeholder={`${timeInterval / 1000}s`} // Show the current interval in seconds
        onChange={applyNewInterval} // Update the interval when an option is selected
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10, // Space between elements
    padding: 20, // Padding around the container
    width: "100%", // Full width container
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
    backgroundColor: "yellow", // Background color of the container
  },
  title: {
    fontSize: 16, // Font size for the title text
  },
  box: {
    padding: 5, // Padding inside the dropdown box
    width: "25%", // Width of the dropdown box
    borderWidth: 1, // Border width for the dropdown box
    borderColor: "green", // Border color for the dropdown box
  },
  dropdown: {
    height: "40%", // Height of the dropdown box
    borderWidth: 1, // Border width for the dropdown list
    borderColor: "green", // Border color for the dropdown list
  },
});
