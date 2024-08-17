import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Accelerometer } from "expo-sensors";
import {
  SensorsContext,
  SensorContextType,
} from "../../../Context/ContextProvider";

export default function Sensor() {
  /* State to store the current accelerometer readings */
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const { startSensors, updateData } =
    useContext<SensorContextType>(SensorsContext);

  /**
   * Stops measuring by removing all accelerometer listeners and resetting state.
   */
  const stopMeasuring = () => {
    Accelerometer.removeAllListeners();
    setData({ x: 0, y: 0, z: 0 });
  };

  /**
   * Starts measuring by setting the update interval and adding a listener
   * to handle accelerometer data updates.
   */
  const startMeasuring = () => {
    Accelerometer.setUpdateInterval(200); // Update every 200 milliseconds
    Accelerometer.addListener((data) => {
      setData(data);
      updateData(data); // Call the external updateData function with the latest data
    });
  };

  useEffect(() => {
    // Start or stop the sensor based on the startSensor flag
    if (startSensors) {
      startMeasuring();
    } else {
      stopMeasuring();
    }

    // Cleanup function to remove listeners when the component is unmounted or the sensor is stopped
    return () => Accelerometer.removeAllListeners();
  }, [startSensors]);

  return (
    <View style={styles.container}>
      <View style={[styles.container, { gap: 10 }]}>
        <Text>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
        <Text>x: {x.toFixed(2)}</Text>
        <Text>y: {y.toFixed(2)}</Text>
        <Text>z: {z.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
