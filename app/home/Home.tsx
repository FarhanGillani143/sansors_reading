import React, { useContext } from "react";
import { View, Button, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { SensorContextType } from "../../utils/DataTypes";
import LocationTracking from "./Location/LocationTracking";
import { SensorsContext } from "../../context/ContextProvider";
import AccelerometerSensor from "./Accelerometer/Accelerometer";
import SensorTimeInterval from "./SensorTimeInterval/SensorTimeInterval";

export default function Home() {
  const { startSensors, sensorsData, sensorsController } =
    useContext<SensorContextType>(SensorsContext);

  /**
   * Checks whether the "View All Readings" button should be displayed.
   * This button is shown only when sensor tracking is not active (startSensors is false)
   * and there is available sensor data to view (sensorsData array is not empty).
   *
   * @returns {boolean} - Returns true if the button should be displayed, false otherwise.
   */
  const buttonCheck = () => !startSensors && sensorsData.length > 0;

  /**
   * A component that renders a link to the data viewing page.
   */
  const ViewAllDataButton = () => (
    <Link href={"/data"} style={{ color: "#007AFF", fontSize: 18 }}>
      {`View All Readings (${sensorsData.length})`}
    </Link>
  );

  return (
    <View style={styles.container}>
      <SensorTimeInterval />
      <View style={[styles.container, { gap: 10, flex: 3 }]}>
        <AccelerometerSensor />
        <LocationTracking />
      </View>

      <View style={styles.buttons}>
        <Button
          onPress={sensorsController}
          title={startSensors ? "Stop Tracking" : "Start Tracking"}
        />
        {buttonCheck() && <ViewAllDataButton />}
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
  buttons: {
    flex: 1,
    gap: 10,
  },
});
