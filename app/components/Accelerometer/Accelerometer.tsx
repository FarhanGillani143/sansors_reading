import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import Sensor from "./Sensor";

/**
 * The `timestamp` property in the `AccelerometerMeasurement` object is originally a `number`.
 * However, to make it more user-friendly and easily understandable, we convert it to a `string`.
 * This conversion allows for better readability and clearer representation of time values.
 * Therefore, we manually change the type of the `timestamp` from `number` to `string`.
 */

export type AccelerometerDataType = Omit<
  AccelerometerMeasurement,
  "timestamp"
> & {
  timestamp: string;
};

export default function AccelerometerSensor() {
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean>(false);

  /** Verifies the availability of the sensor on the device. */
  const checkSensorAvailability = async () => {
    const isAvailable = await Accelerometer.isAvailableAsync();
    setIsSensorAvailable(isAvailable);
  };

  useEffect(() => {
    checkSensorAvailability();
  }, []);

  return (
    <View style={styles.container}>
      {isSensorAvailable ? (
        <View style={styles.container}>
          <Sensor />
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
});
