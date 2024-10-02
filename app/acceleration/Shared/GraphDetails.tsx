import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  X_AXIS_COLOR,
  Y_AXIS_COLOR,
  X_ACCELERATION_COLOR,
  Y_ACCELERATION_COLOR,
  Z_ACCELERATION_COLOR,
} from "./Contants";

interface Props {
  graphType: "variance" | "acceleration";
}

const lineDetail = [
  { name: "x", color: X_ACCELERATION_COLOR },
  { name: "y", color: Y_ACCELERATION_COLOR },
  { name: "z", color: Z_ACCELERATION_COLOR },
];

export default function GraphDetails({ graphType }: Props) {
  const graphTitle =
    graphType === "acceleration"
      ? "Acceleration Graph"
      : "Acceleration Variance Graph";

  const yAxisData =
    graphType == "acceleration"
      ? "Acceleration (x, y, z)"
      : "Mean Variance of Acceleration (x, y, z)";

  return (
    <View style={styles.container}>
      <Text style={styles.graphTitle}>{graphTitle}</Text>
      <Text>(Last Minute Data Only)</Text>
      <View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 16 }}>x-Axis - </Text>
          <Text style={{ color: X_AXIS_COLOR, fontSize: 16 }}>
            Time (timestamp)
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 16 }}>y-Axis - </Text>
          <Text style={{ color: Y_AXIS_COLOR, fontSize: 16 }}>{yAxisData}</Text>
        </View>
      </View>
      <View style={styles.legendView}>
        {graphType == "acceleration" &&
          lineDetail.map((line, index) => (
            <View key={index} style={styles.legend}>
              <View
                style={{ backgroundColor: line.color, width: "50%", height: 5 }}
              ></View>
              <Text style={{ fontSize: 18 }}>{line.name}</Text>
            </View>
          ))}
      </View>
      {graphType == "variance" && (
        <Text style={styles.info}>
          0.000 indicates no change in device orientation in last 1 min
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  graphTitle: {
    fontSize: 20,
    marginTop: 20, // Margin above the title
    color: "#36454F", // Dark color for the title text
    fontWeight: "bold", // Bold font style for the title
  },
  legendView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  legend: {
    width: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  info: {
    textAlign: "center",
    paddingHorizontal: "5%",
  },
});
