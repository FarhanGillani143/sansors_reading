import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import Sensor from "./Sensor";
import ReadingsList from "./ReadingsList";
import { downloadCSV } from "../../utils/ArrayToCSV";
import dateTimeStringWithMilliseconds from "../../utils/dateTimeStringwithMs";

/**
 * The `timestamp` property in the `AccelerometerMeasurement` object is originally a `number`.
 * However, to make it more user-friendly and easily understandable, we convert it to a `string`.
 * This conversion allows for better readability and clearer representation of time values.
 * Therefore, we manually change the type of the `timestamp` from `number` to `string`.
 */

export type MeasurementType = Omit<AccelerometerMeasurement, "timestamp"> & {
  timestamp: string;
};

export default function AccelerometerSensor() {
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean>(false);
  const [startReading, setStartReading] = useState<boolean>(false);
  const [showAllReadings, setShowAllReadings] = useState<boolean>(false);

  /** Contains all accelerometer sensor readings captured during a single session. */
  const accelerometerReadings = useRef<MeasurementType[]>([]);

  /**
   * Prepends newly measured sensor readings to the list to ensure it remains up-to-date.
   */
  const updateData = (data: AccelerometerMeasurement) => {
    /*
     * The `timestamp` property in the `AccelerometerMeasurement` object
     * consistently returns `undefined` on Android devices.
     * To address this issue, we manually add timestamps to ensure accurate timing data.
     */

    const timestamp = dateTimeStringWithMilliseconds();
    const reading = { ...data, timestamp };
    accelerometerReadings.current.unshift(reading);
  };

  /** Verifies the availability of the sensor on the device. */
  const checkSensorAvailability = async () => {
    const isAvailable = await Accelerometer.isAvailableAsync();
    setIsSensorAvailable(isAvailable);
  };

  /** Starts or stops the sensor based on its current state. */
  const controller = () => setStartReading(!startReading);

  /** Toggles the visibility of the list of all sensor readings. */
  const listSwitch = () => setShowAllReadings(!showAllReadings);

  /**
   * Checks if the button for displaying the list and the button for downloading
   * the data as a CSV file can be displayed.
   */

  const buttonCheck = () =>
    !startReading && accelerometerReadings.current.length > 0;

  /** Downloads the sensor readings and saves them as a CSV file. */
  const handleDownload = async () =>
    await downloadCSV({
      arr: accelerometerReadings.current,
      fileName: "Accelerometer",
      sensor: "Accelerometer",
    });

  const total = accelerometerReadings.current.length;
  const buttonTitle = showAllReadings
    ? `Hide All Readings (${total})`
    : `See All Readings (${total})`;

  useEffect(() => {
    checkSensorAvailability();
  }, []);

  return (
    <View style={styles.container}>
      {isSensorAvailable ? (
        <View style={styles.container}>
          <Sensor updateData={updateData} startSensor={startReading} />
          <Button
            onPress={controller}
            title={startReading ? "Stop Measuring" : "Start Measuring"}
          />
          {buttonCheck() && <Button onPress={listSwitch} title={buttonTitle} />}
          {buttonCheck() && (
            <Button onPress={handleDownload} title={"Download Data as CSV"} />
          )}
        </View>
      ) : (
        <Text>Accelerometer sensor is not available on this device</Text>
      )}
      {showAllReadings && !startReading && (
        <ReadingsList data={accelerometerReadings.current} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
