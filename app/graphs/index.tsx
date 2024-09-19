import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import SpeedGraph from "./Speed/Graph";
import AccelerationGraph from "./Acceleration/Graph";
import { SensorContextType, SensorsContext } from "../../context/SensorContext";

export default function index() {
  const { sensorsData } = useContext<SensorContextType>(SensorsContext);

  return (
    <>
      {sensorsData.length > 0 ? (
        <>
          <AccelerationGraph />
          {/* <SpeedGraph /> */}
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
