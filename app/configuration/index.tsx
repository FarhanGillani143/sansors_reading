import React from "react";
import {
  Text,
  View,
  Platform,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

import RadioButtonGroup from "./RadioButtonGroup";
import SettingsInputField from "./SettingsInputField";
import SensorTimeInterval from "./SensorTimeInterval";

const speedUnitOptions = [
  { label: "KM/H", value: "kph" },
  { label: "Miles/H", value: "mph" },
];

const comfortGraphOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export default function Configuration() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "height" : "padding"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 60 : 0}
    >
      <ScrollView>
        <View style={styles.container}>
          <SensorTimeInterval />
          <View style={styles.property}>
            <Text style={styles.description}>Unit of Speed</Text>
            <RadioButtonGroup style={{ gap: 20 }} options={speedUnitOptions} />
          </View>
          <View style={[styles.property, styles.column]}>
            <Text style={styles.description}>Display Drive Comfort Graph?</Text>
            <RadioButtonGroup
              style={{ width: "60%" }}
              options={comfortGraphOptions}
            />
          </View>
          <SettingsInputField description="Warning Speed Limit" />
          <SettingsInputField
            style={styles.column}
            description="Measure Acceleration Start Speed"
          />
          <SettingsInputField
            style={styles.column}
            description="Measure Acceleration End Speed"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
