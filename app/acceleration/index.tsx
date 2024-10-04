import React, { useContext, useMemo } from "react";
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
  SensorsConfigContext,
  SensorsConfigContextType,
} from "../../context/SensorsConfig/ConfigContext";
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
  const { sensorsData, emptySessionData, storeSessionDataAsync } =
    useContext<SensorContextType>(SensorsContext);

  const { startSensors, sensorsController } =
    useContext<SensorsConfigContextType>(SensorsConfigContext);

  const { sensorTimeInterval } =
    useContext<ConfigContextType>(ConfigurationContext);

  const { graphType } = useLocalSearchParams<AccelerationParams>();

  const recordsLimit = useMemo(
    () => 60000 / sensorTimeInterval,
    [sensorTimeInterval]
  );

  const timeToGenerateGraph = useMemo(
    () => sensorTimeInterval * sensorsData.length,
    [sensorTimeInterval]
  );

  console.log("Rendering Accleration Index...");

  const latestReading = sensorsData[0].accelerationData;
  const showGraph = sensorsData.length > recordsLimit;

  const handleSensorsControl = async () => {
    if (startSensors) {
      sensorsController();
      await storeSessionDataAsync();
    } else {
      emptySessionData();
      sensorsController();
    }
  };

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
        {showGraph ? (
          <>
            <GraphDetails graphType="variance" />
            <AccelerationVarianceGraph
              graphType={graphType}
              recordsLimit={recordsLimit}
            />
          </>
        ) : (
          <ProgressIndicator remainingTime={timeToGenerateGraph} />
        )}
        {startSensors && showGraph && (
          <TextButton title={"Stop Tracking"} onPress={handleSensorsControl} />
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
