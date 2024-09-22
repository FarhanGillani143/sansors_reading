import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import SpeedGraph from "./Speed/Graph";
import AccelerationGraph from "./Acceleration/Graph"; 
import { SensorDataType } from "../../types/DataTypes";
import { getMaxMinValue } from "../../utils/Graphs/MaxMinValue";
import { SensorContextType, SensorsContext } from "../../context/SensorContext";

export default function index() {
  const { sensorsData, noSensorAvailable, startSensors, sensorsController } =
    useContext<SensorContextType>(SensorsContext);

  const [recentMinuteData, setRecentMinuteData] = useState<SensorDataType[]>(
    []
  );
  const [initialMinValue, setInitialMinValue] = useState<number>(0);
  const [initialMaxValue, setInitialMaxValue] = useState<number>(0);

  useEffect(() => {
    const recentMinuteData = sensorsData.slice(0, 299);

    const { maxValue, minValue } = getMaxMinValue(recentMinuteData);

    setRecentMinuteData(recentMinuteData);
    setInitialMaxValue(maxValue);
    setInitialMinValue(minValue);
  }, []);

  return (
    <>
      {recentMinuteData.length > 0 ? (
        <>
          <AccelerationGraph
            recentMinuteData={recentMinuteData}
            initialMaxValue={initialMaxValue}
            initialMinValue={initialMinValue}
          />
          {/* <SpeedGraph /> */}
          {/* Button to start/stop tracking the sensor */}
          {!noSensorAvailable && startSensors && (
            <Button
              onPress={sensorsController}
              title={startSensors ? "Stop Tracking" : "Start Tracking"}
            />
          )}
        </>
      ) : (
        <View style={styles.container}>
          <Text>No graphs available at the moment</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
