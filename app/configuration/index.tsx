import React, { useContext } from "react";
import {
  Text,
  View,
  Platform,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

import RadioButtonGroup from "./RadioButtonGroup"; // Custom component for rendering radio button groups
import SettingsInputField from "./SettingsInputField"; // Custom component for rendering input fields
import SensorTimeInterval from "./SensorTimeInterval"; // Custom component to set the sensor time interval
import { SpeedDataType } from "../../types/DataTypes"; // Type definition for speed data
import { kphToMph, mphToKph } from "../../utils/SpeedConversions"; // Utility functions for converting speed units
import {
  ConfigContextType,
  ConfigurationContext,
} from "../../context/Configuration/ConfigurationContext"; // Context for managing configuration settings

// Speed unit options for the radio button group
const speedUnitOptions: { label: string; value: "kph" | "mph" }[] = [
  { label: "KM/H", value: "kph" },
  { label: "Miles/H", value: "mph" },
];

// Options for whether or not to display the comfort graph
const comfortGraphOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export default function Configuration() {
  const {
    speedUnit,
    displayGraph,
    warningSpeed,
    accelerationEndSpeed,
    accelerationStartSpeed,
    updateSpeedUnit,
    updateWarningSpeed,
    updateDisplayGraph,
    updateAccelerationEndSpeed,
    updateAccelerationStartSpeed,
  } = useContext<ConfigContextType>(ConfigurationContext);

  /**
   * Converts and formats the speed value based on the selected speed unit.
   */
  const speedValue = (speedData: SpeedDataType) => {
    let speed: string; // toFixed returns a string

    // If the current speed unit matches the speed data's unit, no conversion is needed
    if (speedData.unit === speedUnit) speed = speedData.speed.toFixed(0);
    // Convert mph to kph if the unit is kph
    else if (speedUnit === "kph") speed = mphToKph(speedData.speed).toFixed(0);
    // Convert kph to mph if the unit is mph
    else speed = kphToMph(speedData.speed).toFixed(0);

    return Number(speed); // Convert the string back to a number
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "height" : "padding"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 0}
    >
      <ScrollView>
        <View style={styles.container}>
          {/* Component to set sensor time interval */}
          <SensorTimeInterval />

          {/* Section for enabling/disabling the Drive Comfort Graph */}
          <View style={[styles.property, styles.column]}>
            <Text style={styles.description}>Display Drive Comfort Graph?</Text>
            <RadioButtonGroup
              value={displayGraph}
              options={comfortGraphOptions}
              getSelectedValue={updateDisplayGraph}
            />
          </View>

          {/* Section for selecting the speed unit (KM/H or Miles/H) */}
          <View style={styles.property}>
            <Text style={styles.description}>Unit of Speed</Text>
            <RadioButtonGroup
              value={speedUnit}
              options={speedUnitOptions}
              getSelectedValue={updateSpeedUnit}
            />
          </View>

          {/* Input field for the warning speed limit */}
          <SettingsInputField
            value={speedValue(warningSpeed)}
            speedUnit={speedUnit}
            getSelectedValue={updateWarningSpeed}
            description="Warning Speed Limit"
          />

          {/* Input field for acceleration start speed */}
          <SettingsInputField
            style={styles.column}
            speedUnit={speedUnit}
            value={speedValue(accelerationStartSpeed)}
            getSelectedValue={updateAccelerationStartSpeed}
            description="Measure Acceleration Start Speed"
          />

          {/* Input field for acceleration end speed */}
          <SettingsInputField
            style={styles.column}
            speedUnit={speedUnit}
            value={speedValue(accelerationEndSpeed)}
            getSelectedValue={updateAccelerationEndSpeed}
            description="Measure Acceleration End Speed"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    gap: 5,
    flexGrow: 1,
    paddingTop: 5,
    alignItems: "center",
  },
  property: {
    gap: 20,
    padding: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  description: {
    fontSize: 16,
  },
  dropdownBox: {
    padding: 5,
    width: "30%",
    borderWidth: 1,
    borderColor: "black",
  },
  column: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
});
