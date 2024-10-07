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
import { SpeedUnits } from "../../types/DataTypes"; // Type definition for speed data
import SettingsInputField from "./SettingsInputField"; // Custom component for rendering input fields
import SensorTimeInterval from "./SensorTimeInterval"; // Custom component to set the sensor time interval
import {
  ConfigContextType,
  ConfigurationContext,
} from "../../context/Configuration/ConfigurationContext"; // Context for managing configuration settings

// Speed unit options for the radio button group
const speedUnitOptions: { label: SpeedUnits; value: SpeedUnits }[] = [
  { label: "KM/H", value: "KM/H" },
  { label: "Miles/H", value: "Miles/H" },
];

// Options for whether or not to display the comfort graph
const comfortGraphOptions: { label: "Yes" | "No"; value: boolean }[] = [
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
    updateSpeedUnitAsync,
    updateWarningSpeedAsync,
    updateDisplayGraphAsync,
    updateAccelerationEndAsync,
    updateAccelerationStartAsync,
  } = useContext<ConfigContextType>(ConfigurationContext);

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
              updateValueAsync={updateDisplayGraphAsync}
            />
          </View>

          {/* Section for selecting the speed unit (KM/H or Miles/H) */}
          <View style={styles.property}>
            <Text style={styles.description}>Unit of Speed</Text>
            <RadioButtonGroup
              value={speedUnit}
              options={speedUnitOptions}
              updateValueAsync={updateSpeedUnitAsync}
            />
          </View>

          {/* Input field for the warning speed limit */}
          <SettingsInputField
            currentValue={warningSpeed}
            speedUnit={speedUnit}
            updateValueAsync={updateWarningSpeedAsync}
            description="Warning Speed Limit"
          />

          {/* Input field for acceleration start speed */}
          <SettingsInputField
            style={styles.column}
            speedUnit={speedUnit}
            currentValue={accelerationStartSpeed}
            updateValueAsync={updateAccelerationStartAsync}
            description="Measure Acceleration Start Speed"
          />

          {/* Input field for acceleration end speed */}
          <SettingsInputField
            style={styles.column}
            speedUnit={speedUnit}
            currentValue={accelerationEndSpeed}
            updateValueAsync={updateAccelerationEndAsync}
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
