import React, { useContext, useEffect, useState } from "react";
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

  const [showGraph, setShowGraph] = useState(false);

  /**
   * Checks whether the "View All Readings" button should be displayed.
   * This button is shown only when sensor tracking is not active (startSensors is false)
   * and there is available sensor data to view (sensorsData array is not empty).
   *
   * @returns {boolean} - Returns true if the button should be displayed, false otherwise.
   */
  const dataButtonCheck = () => !startSensors && sensorsData.length > 0;

  /**
   * Checks whether the "View All Sessions" button should be displayed.
   * This button is shown only when sensor tracking is not active (startSensors is false)
   * and there are recorded sessions available.
   *
   * @returns {boolean} - Returns true if the button should be displayed, false otherwise.
   */
  const historyButtonCheck = () => !startSensors && allSessions.length > 0;

  const buttonTitle = `View This Session's Readings (${sensorsData.length})`;

  useEffect(() => {
    // console.log("In use effect");
    if (!showGraph && sensorsData.length > 0) setShowGraph(true);
  }, [sensorsData]);

  return (
    <View style={styles.container}>
      <SensorTimeInterval />
      <AccelerometerSensor />
      {startSensors && (
        <NavigationButton
          navigateTo="/graphs"
          title="View Real-time Graph"
          style={{ paddingVertical: 10 }}
        />
      )}
      <LocationTracking />

      <View style={{ gap: 10, paddingVertical: 10 }}>
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
        {dataButtonCheck() && (
          <>
            <NavigationButton title={buttonTitle} navigateTo="/data" />
            <NavigationButton title="View Graph" navigateTo="/graphs" />
          </>
        )}

        {historyButtonCheck() && (
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
  },
  buttons: {
    gap: 10,
    alignItems: "center",
  },
});
