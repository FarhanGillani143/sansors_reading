import React, { useContext } from "react";
import { Button, StyleSheet, View } from "react-native";

import Graph from "./Graph";
import GraphDetails from "./GraphDetails"; // Component for additional graph details
import AccelerometerSensor from "../../home/Accelerometer/Accelerometer"; // Component for accelerometer sensor
import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorContext"; // Context to access sensor data

/**
 * AccelerationGraph component renders the acceleration graph and provides controls to
 * start/stop sensor tracking. It displays additional details about the graph and tracks
 * real-time accelerometer data.
 *
 * @returns {React.ReactElement} The acceleration graph UI with the start/stop tracking functionality.
 */
export default function AccelerationGraph() {
  const { noSensorAvailable, startSensors, sensorsController } =
    useContext<SensorContextType>(SensorsContext);

  return (
    <View style={styles.container}>
      {startSensors && <AccelerometerSensor />}
      <GraphDetails />
      <Graph />
      {!noSensorAvailable && startSensors && (
        <Button
          onPress={sensorsController}
          title={startSensors ? "Stop Tracking" : "Start Tracking"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    alignItems: "center", // Center align the graph container horizontally
  },
});
