import React, { useContext, useRef } from "react";
import { Button, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import GraphDetails from "./Shared/GraphDetails";
import ProgressIndicator from "./Shared/ProgressIndicator";
import AccelerationVarianceGraph from "./VarianceGraph/VarianceGraph";
import { ShowAccelerationData } from "../home/Accelerometer/Accelerometer";
import { SensorContextType, SensorsContext } from "../../context/SensorContext";

type Params = {
  graphType: "real-time" | "general";
};

/**
 * AccelerationGraph component renders the acceleration graph and provides controls to
 * start/stop sensor tracking. It displays additional details about the graph and tracks
 * real-time accelerometer data.
 *
 * @returns {React.ReactElement} The acceleration graph UI with the start/stop tracking functionality.
 */
export default function AccelerationGraph() {
  const { sensorsData, timeInterval, startSensors, sensorsController } =
    useContext<SensorContextType>(SensorsContext);

  const { graphType } = useLocalSearchParams<Params>();

  const latestReading = sensorsData[0].accelerationData;
  const recordsLimit = useRef<number>(60000 / timeInterval).current;
  // Track remaining time for generating the graph
  const remainingTimeToGenerateRef = useRef<number>(
    timeInterval * sensorsData.length
  );

  return (
    <View style={styles.container}>
      {startSensors && (
        <ShowAccelerationData
          x={latestReading?.x}
          y={latestReading?.y}
          z={latestReading?.z}
        />
      )}
      {sensorsData.length > recordsLimit ? (
        <>
          <GraphDetails graphType="variance" />
          <AccelerationVarianceGraph
            graphType={graphType}
            recordsLimit={recordsLimit}
          />
        </>
      ) : (
        <ProgressIndicator remainingTime={remainingTimeToGenerateRef.current} />
      )}
      {startSensors && sensorsData.length > recordsLimit && (
        <Button title={"Stop Tracking"} onPress={sensorsController} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    width: "100%",
    alignItems: "center", // Center align the graph container horizontally
  },
});
