import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";

interface PropsType {
  updateData: (data: AccelerometerMeasurement) => void;
  startSensor: boolean;
}

export default function Sensor({ updateData, startSensor }: PropsType) {
  /* Current reading */
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const stopMeasuring = () => {
    Accelerometer.removeAllListeners();
    setData({ x: 0, y: 0, z: 0 });
  };

  const startMeasuring = () => {
    Accelerometer.setUpdateInterval(200);
    Accelerometer.addListener((data) => {
      setData(data);
      updateData(data);
    });
  };

  useEffect(() => {
    if (startSensor) {
      startMeasuring();
    } else stopMeasuring();

    return () => Accelerometer.removeAllListeners();
  }, [startSensor]);

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
