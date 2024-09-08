import React, { useContext } from "react";
import { Text, View, Button, StyleSheet } from "react-native";

import LocationTracking from "./Location/LocationTracking";
import AccelerometerSensor from "./Accelerometer/Accelerometer";
import NavigationButton from "../../components/NavigationButton";
import SensorTimeInterval from "./SensorTimeInterval/SensorTimeInterval";
import { SensorContextType, SensorsContext } from "../../context/SensorContext";

export default function Home() {
  const {
    sensorsData,
    allSessions,
    startSensors,
    sessionEndTime,
    sessionStartTime,
    noSensorAvailable,
    sensorsController,
  } = useContext<SensorContextType>(SensorsContext);

  /**
   * Checks whether the "View All Readings" button should be displayed.
   * This button is shown only when sensor tracking is not active (startSensors is false)
   * and there is available sensor data to view (sensorsData array is not empty).
   *
   * @returns {boolean} - Returns true if the button should be displayed, false otherwise.
   */
  const buttonCheck = () => !startSensors && sensorsData.length > 0;

  const buttonTitle = `View All Readings (${sensorsData.length})`;

  return (
    <View style={styles.container}>
      <SensorTimeInterval />
      <View style={[styles.container, { gap: 10, flex: 3 }]}>
        <AccelerometerSensor />
        <LocationTracking />
      </View>

      <View style={{ gap: 10, paddingVertical: 20 }}>
        {sessionStartTime && (
          <Text>Session Started at: {sessionStartTime.toLocaleString()}</Text>
        )}
        {sessionEndTime && !startSensors && (
          <Text>Session Ended at: {sessionEndTime.toLocaleString()}</Text>
        )}
      </View>

      <View style={styles.buttons}>
        {!noSensorAvailable && (
          <Button
            onPress={sensorsController}
            title={startSensors ? "Stop Tracking" : "Start Tracking"}
          />
        )}
        {buttonCheck() && (
          <NavigationButton title={buttonTitle} navigateTo="/data" />
        )}

        {allSessions.length > 0 && (
          <NavigationButton title="View All Sessions" navigateTo="/history" />
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
  buttons: {
    flex: 1,
    gap: 15,
    alignItems: "center",
  },
});
