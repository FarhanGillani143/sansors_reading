import React, { useContext, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import GPS from "../components/GPS/GPS";
import DisplayDataList from "../components/DisplayDataList";
import { downloadCSV } from "../../utils/ArrayToCSV";
import AccelerometerSensor from "../components/Accelerometer/Accelerometer";
import {
  SensorsContext,
  SensorContextType,
} from "../../Context/ContextProvider";

export default function Sensors() {
  const [showAllReadings, setShowAllReadings] = useState<boolean>(false);

  const { startSensors, sensorsData, sensorsController } =
    useContext<SensorContextType>(SensorsContext);

  /** Toggles the visibility of the list of all sensor readings. */
  const listSwitch = () => setShowAllReadings(!showAllReadings);

  const total = sensorsData.length;
  const buttonTitle = showAllReadings
    ? `Hide All Readings (${total})`
    : `See All Readings (${total})`;

  /**
   * Checks if the button for displaying the list and the button for downloading
   * the data as a CSV file can be displayed.
   */
  const buttonCheck = () => !startSensors && total > 0;

  /** Downloads the sensor readings and saves them as a CSV file. */
  const handleDownload = async () =>
    await downloadCSV({
      arr: sensorsData,
      sensor: "Accelerometer",
    });

  return (
    <View style={styles.container}>
      <View style={[styles.container, { gap: 10, flex: 3 }]}>
        <AccelerometerSensor />
        <GPS />
      </View>
      <View style={{ flex: 1 }}>
        <Button
          onPress={sensorsController}
          title={startSensors ? "Stop Measuring" : "Start Measuring"}
        />
        {buttonCheck() && <Button onPress={listSwitch} title={buttonTitle} />}
        {buttonCheck() && (
          <Button onPress={handleDownload} title={"Download Data as CSV"} />
        )}
        {showAllReadings && !startSensors && (
          <DisplayDataList data={sensorsData} />
        )}
      </View>
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
