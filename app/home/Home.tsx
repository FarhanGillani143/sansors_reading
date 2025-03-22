import React, { useContext, useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";

import TextButton from "../../components/TextButton";
import LocationTracking from "./Location/LocationTracking";
import NavigationLink from "../../components/NavigationButton";
import AccelerometerSensor from "./Accelerometer/Accelerometer";
import {
  SensorsContext,
  SensorContextType,
} from "../../context/SensorsData/SensorContext";
import { 
  SensorsConfigContext,
  SensorsConfigContextType,
} from "../../context/SensorsConfig/ConfigContext";

/**
 * Home Component - Main dashboard for displaying sensor data and navigation controls.
 */
export default function Home() {
  const { sensorsData, emptySessionData, storeSessionDataAsync } =
    useContext<SensorContextType>(SensorsContext);

  const {
    allSessions,
    startSensors,
    sessionEndTime,
    sessionStartTime,
    noSensorAvailable,
    sensorsController,
  } = useContext<SensorsConfigContextType>(SensorsConfigContext);

  /**
   * Determines whether to show the "View This Session's Readings" button
   * based on whether tracking has stopped and data is available.
   */
  const showDataButton = useMemo(
    () => !startSensors && sensorsData.length > 0,
    [startSensors]
  );

  /**
   * Determines whether to show the "View All Sessions" button
   * based on whether tracking has stopped and session history exists.
   */
  const showHistoryButton = useMemo(
    () => !startSensors && allSessions.length > 0,
    [startSensors, allSessions]
  );

  const handleSensorsControl = async () => {
    if (startSensors) {
      sensorsController();
      await storeSessionDataAsync();
    } else {
      emptySessionData();
      sensorsController();
    }
  };

  // Button title showing the number of readings available in the current session
  const buttonTitle = `View This Session's Readings (${sensorsData.length})`;

  return (
    <View style={styles.container}>
      {/* Component handling accelerometer sensor */}
      <AccelerometerSensor />

      {/* If sensors are active, show a button to view the real-time graph */}
      {startSensors && (
        <NavigationLink
          navigateTo="/acceleration"
          params={{ graphType: "real-time" }}
          title="View Real-time Variance Graph" 
          style={{ paddingVertical: 10,  }}
        />
      )}

      {/* Component handling location tracking */}
      <LocationTracking />

      {/* Display start and end times of the current session */}
      <View
        style={[
          sessionStartTime && styles.sessionInfo,
          { borderWidth: sessionStartTime ? 1 : 0 },
        ]}
      >
        {sessionStartTime && (
          <Text>{startSensors ? "Current Session" : "Last Session"}</Text>
        )}
        {sessionStartTime && (
          <Text>Started at: {sessionStartTime.toLocaleString()}</Text>
        )}
        {sessionEndTime && !startSensors && (
          <Text>Ended at: {sessionEndTime.toLocaleString()}</Text>
        )}
      </View>

      {/* Buttons for starting/stopping sensors and navigating to data or history */}
      <View style={styles.buttons}>
        {/* Show a button to start/stop tracking if sensors are available */}
        {!noSensorAvailable && (
          <TextButton
            onPress={handleSensorsControl}
            title={startSensors ? "Stop Tracking" : "Start Tracking"}
          />
        )}

        {/* Show buttons for session data and graph if tracking has stopped */}
        {showDataButton && (
          <>
            <NavigationLink navigateTo="/data" title={buttonTitle} />
            <NavigationLink
              navigateTo="/acceleration"
              params={{ graphType: "general" }}
              title="View Real-time Variance Graph"
              style={{ paddingVertical: 10 }}
            />
          </>
        )}

        {/* Show a button to view session history if available */}
        {showHistoryButton && (
          <NavigationLink title="View All Sessions" navigateTo="/history" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  sessionInfo: {
    gap: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: "black",
    paddingHorizontal: 20,
  },
  buttons: {
    gap: 10,
    alignItems: "center",
  },
});
