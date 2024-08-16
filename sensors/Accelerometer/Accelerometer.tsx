import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import Sensor from "./Sensor";
import ReadingsList from "./ReadingsList";

/* timestamp property in AccelerometerMeasurement object throws undefined
 * on the Android all the time. That's why we have to add timestamps manually
 */

interface AccelerometerReading {
  timestamp: string;
  data: AccelerometerMeasurement;
}

export default function AccelerometerSensor() {
  const [isSensorAvailable, setIsSensorAvailable] = useState<boolean>(false);
  const [startReading, setStartReading] = useState<boolean>(false);
  const [showAllReadings, setShowAllReadings] = useState<boolean>(false);

  const accelerometerReadings = useRef<AccelerometerReading[]>([]);

  const updateData = (data: AccelerometerMeasurement) => {
    /* timestamp property in AccelerometerMeasurement object throws undefined
     * on the Android all the time. That's why we have to add timestamps manually
     */
    const reading = {
      timestamp: new Date().toLocaleString(),
      data: data,
    };
    accelerometerReadings.current.unshift(reading);
  };

  const checkSensorAvailability = async () => {
    const isAvailable = await Accelerometer.isAvailableAsync();
    setIsSensorAvailable(isAvailable);
  };

  const controller = () => setStartReading(!startReading);

  const listSwitch = () => setShowAllReadings(!showAllReadings);

  const buttonCheck = () =>
    !startReading && accelerometerReadings.current.length > 0;

  const total = accelerometerReadings.current.length;
  const buttonTitle = showAllReadings
    ? `Hide All Readings (${total})`
    : `See All Readings (${total})`;

  useEffect(() => {
    /* Check if the sensor is available on the device */
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
