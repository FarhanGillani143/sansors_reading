import { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Accelerometer } from "expo-sensors";

import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorContext";

export default function AccelerometerSensor() {
  /* State to store the current accelerometer readings */
  const [{ x, y, z }, setCurrentAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const {
    startSensors,
    timeInterval,
    updateSensorsData,
    isAccelerometerAvailable,
  } = useContext<SensorContextType>(SensorsContext);

  /**
   * Stops tracking by removing all accelerometer listeners and resetting state.
   */
  const stopTracking = () => {
    Accelerometer.removeAllListeners();
    setCurrentAcceleration({ x: 0, y: 0, z: 0 });
  };

  /**
   * Starts tracking by setting the update interval and adding a listener
   * to handle accelerometer data updates.
   */
  const startTracking = () => {
    Accelerometer.setUpdateInterval(timeInterval);
    Accelerometer.addListener((data) => {
      setCurrentAcceleration(data);
      updateSensorsData({ acceleration: data }); // Call the external updateData function with the latest data
    });
  };

  useEffect(() => {
    if (isAccelerometerAvailable) {
      if (startSensors) {
        startTracking();
      } else {
        stopTracking();
      }
    }

    return () => Accelerometer.removeAllListeners();
  }, [startSensors, isAccelerometerAvailable]);

  return (
    <View style={styles.container}>
      {isAccelerometerAvailable ? (
        <View style={styles.dataPoints}>
          <Text style={styles.title}>
            Acceleration (in gs where 1g = 9.81 m/s^2)
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text>x: {x.toFixed(2)} gs</Text>
            <Text>y: {y.toFixed(2)} gs</Text>
            <Text>z: {z.toFixed(2)} gs</Text>
          </View>
        </View>
      ) : (
        <Text>Accelerometer sensor is not available on this device</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dataPoints: {
    gap: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0f2f1",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
