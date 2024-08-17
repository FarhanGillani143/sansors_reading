import { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import {
  SensorsContext,
  SensorContextType,
} from "../../context/ContextProvider";

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

  useEffect(() => {
    checkSensorAvailability();
  }, []);

  return (
    <View style={styles.container}>
      {isSensorAvailable ? (
        <View style={styles.dataPoints}>
          <Text style={styles.title}>
            Acceleration (in gs where 1g = 9.81 m/s^2)
          </Text>
          <Text>x: {x.toFixed(2)}</Text>
          <Text>y: {y.toFixed(2)}</Text>
          <Text>z: {z.toFixed(2)}</Text>
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
    marginVertical: 10,
  },
});
