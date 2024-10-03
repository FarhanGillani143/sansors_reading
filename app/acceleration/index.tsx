import React, { useContext, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import GraphDetails from "./Shared/GraphDetails";
import TextButton from "../../components/TextButton";
import { AccelerationParams } from "../../routes/Params";
import ProgressIndicator from "./Shared/ProgressIndicator";
import AccelerationVarianceGraph from "./VarianceGraph/VarianceGraph";
import { ShowAccelerationData } from "../home/Accelerometer/Accelerometer";
import {
  SensorsContext,
  SensorContextType,
} from "../../context/SensorsData/SensorContext";
import {
  ConfigContextType,
  ConfigurationContext,
} from "../../context/Configuration/ConfigurationContext";

/**
 * AccelerationGraph component renders the acceleration graph and provides controls to
 * start/stop sensor tracking. It displays additional details about the graph and tracks
 * real-time accelerometer data.
 *
 * @returns {React.ReactElement} The acceleration graph UI with the start/stop tracking functionality.
 */
export default function AccelerationGraph() {
  const { sensorsData, startSensors, sensorsController } =
    useContext<SensorContextType>(SensorsContext);

  const { sensorTimeInterval } =
    useContext<ConfigContextType>(ConfigurationContext);

  const { graphType } = useLocalSearchParams<AccelerationParams>();

  const latestReading = sensorsData[0].accelerationData;
  const recordsLimit = useRef<number>(60000 / sensorTimeInterval).current;
  // Track remaining time for generating the graph
  const remainingTimeToGenerateRef = useRef<number>(
    sensorTimeInterval * sensorsData.length
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
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
          <ProgressIndicator
            remainingTime={remainingTimeToGenerateRef.current}
          />
        )}
        {startSensors && sensorsData.length > recordsLimit && (
          <TextButton title={"Stop Tracking"} onPress={sensorsController} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
    alignItems: "center", // Center align the graph container horizontally
  },
});
