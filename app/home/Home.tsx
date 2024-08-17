import React, { useContext } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import GPS from "../../components/GPS/GPS";
import AccelerometerSensor from "../../components/Accelerometer/Accelerometer";
import {
  SensorsContext,
  SensorContextType,
} from "../../context/ContextProvider";

export default function Home() {
  const { startSensors, sensorsData, sensorsController } =
    useContext<SensorContextType>(SensorsContext);

  const buttonTitle = `See All Readings (${sensorsData.length})`;

  /**
   * Checks if the button for displaying the list and the button for downloading
   * the data as a CSV file can be displayed.
   */
  const buttonCheck = () => !startSensors && sensorsData.length > 0;

  const ViewAllDataButton = buttonCheck() && (
    <Link href={"/data"} style={{ color: "#007AFF", fontSize: 18 }}>
      {buttonTitle}
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.container, { gap: 10, flex: 3 }]}>
        <AccelerometerSensor />
        <GPS />
      </View>
      <View style={{ flex: 1, gap: 10 }}>
        <Button
          onPress={sensorsController}
          title={startSensors ? "Stop Measuring" : "Start Measuring"}
        />
        {ViewAllDataButton}
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
