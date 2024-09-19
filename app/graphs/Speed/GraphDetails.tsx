import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { X_AXIS_COLOR, Y_AXIS_COLOR } from "./Contants";

export default function GraphDetails() {
  return (
    <View style={styles.container}>
      <Text style={styles.graphTitle}>Speed Graph</Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 16 }}>x-Axis - </Text>
        <Text style={{ color: X_AXIS_COLOR, fontSize: 16 }}>
          Time (timestamp)
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 16 }}>y-Axis - </Text>
        <Text style={{ color: Y_AXIS_COLOR, fontSize: 16 }}>Speed (km/h)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
  },
  graphTitle: {
    fontSize: 20,
    marginTop: 20, // Margin above the title
    color: "#36454F", // Dark color for the title text
    fontWeight: "bold", // Bold font style for the title
  },
});
