import React, { useCallback, useContext } from "react";
import { Text, View, Button, StyleSheet } from "react-native";

import LocationTracking from "./Location/LocationTracking";
import AccelerometerSensor from "./Accelerometer/Accelerometer";
import NavigationButton from "../../components/NavigationButton";
import SensorTimeInterval from "./SensorTimeInterval/SensorTimeInterval";
import { SensorContextType, SensorsContext } from "../../context/SensorContext";

/**
 * Home Component - Main dashboard for displaying sensor data and navigation controls.
 */
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
   * Determines whether to show the "View This Session's Readings" button
   * based on whether tracking has stopped and data is available.
   */
  const dataButtonCheck = useCallback(
    () => !startSensors && sensorsData.length > 0,
    [startSensors, sensorsData]
  );

  /**
   * Determines whether to show the "View All Sessions" button
   * based on whether tracking has stopped and session history exists.
   */
  const historyButtonCheck = useCallback(
    () => !startSensors && allSessions.length > 0,
    [startSensors, allSessions]
  );

  // Button title showing the number of readings available in the current session
  const buttonTitle = `View This Session's Readings (${sensorsData.length})`;

  return (
    <View style={styles.container}>
      {/* Interval settings for sensor tracking */}
      <SensorTimeInterval />

      {/* Component handling accelerometer sensor */}
      <AccelerometerSensor />

      {/* If sensors are active, show a button to view the real-time graph */}
      {startSensors && (
        <NavigationButton
          navigateTo="/graphs"
          title="View Real-time Graph"
          style={{ paddingVertical: 10 }}
        />
      )}

      {/* Component handling location tracking */}
      <LocationTracking />

      {/* Display start and end times of the current session */}
      <View style={{ gap: 10, paddingVertical: 10 }}>
        {sessionStartTime && (
          <Text>Session Started at: {sessionStartTime.toLocaleString()}</Text>
        )}
        {sessionEndTime && !startSensors && (
          <Text>Session Ended at: {sessionEndTime.toLocaleString()}</Text>
        )}
      </View>

      {/* Buttons for starting/stopping sensors and navigating to data or history */}
      <View style={styles.buttons}>
        {/* Show a button to start/stop tracking if sensors are available */}
        {!noSensorAvailable && (
          <Button
            onPress={sensorsController}
            title={startSensors ? "Stop Tracking" : "Start Tracking"}
          />
        )}

        {/* Show buttons for session data and graph if tracking has stopped */}
        {dataButtonCheck() && (
          <>
            <NavigationButton title={buttonTitle} navigateTo="/data" />
            <NavigationButton title="View Graph" navigateTo="/graphs" />
          </>
        )}

        {/* Show a button to view session history if available */}
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
