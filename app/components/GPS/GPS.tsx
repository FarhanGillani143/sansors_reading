import { Button, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { useContext, useEffect, useState } from "react";
import {
  SensorsContext,
  SensorContextType,
} from "../../../Context/ContextProvider";

const emptyPositionObject = {
  timestamp: 0,
  coords: {
    accuracy: 0,
    altitude: 0,
    heading: 0,
    latitude: 0,
    longitude: 0,
    speed: 0,
    altitudeAccuracy: 0,
  },
};

export default function GPS() {
  const { locationPermission, startSensors } =
    useContext<SensorContextType>(SensorsContext);

  const [position, setPosition] =
    useState<Location.LocationObject>(emptyPositionObject);

  const watchPositionCallback = (position: Location.LocationObject) => {
    console.log(position);
    setPosition(position);
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | undefined;
    (async () => {
      console.log(locationPermission, startSensors);
      if (locationPermission && startSensors) {
        locationSubscription = await Location.watchPositionAsync(
          { timeInterval: 200, distanceInterval: 0 },
          watchPositionCallback
        );
      } else {
        locationSubscription && locationSubscription.remove();
        setPosition(emptyPositionObject);
      }
    })();

    return () => locationSubscription && locationSubscription.remove();
  }, [startSensors, locationPermission]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Tracking</Text>
      <Text>Altitude: {position?.coords.altitude?.toFixed(4)}</Text>
      <Text>Latitude: {position?.coords.latitude.toFixed(4)}</Text>
      <Text>Longitude: {position?.coords.longitude.toFixed(4)}</Text>
      <Text>Heading: {position?.coords.heading?.toFixed(2)}</Text>
      <Text>Speed: {position?.coords.speed?.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "yellow",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
