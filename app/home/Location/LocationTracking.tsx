import { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorContext";

/**
 * Default position object used to reset the position state
 * when the location is not being tracked.
 */
const emptyPositionObject = {
  accuracy: 0,
  altitude: 0,
  heading: 0,
  latitude: 0,
  longitude: 0,
  speed: 0,
  altitudeAccuracy: 0,
};

export default function LocationTracking() {
  const {
    timeInterval,
    startSensors, // Indicates if sensors should be active
    locationPermission,
    updateSensorsData,
    requestLocationPermission,
  } = useContext<SensorContextType>(SensorsContext);

  const [currentPosition, setCurrentPosition] =
    useState<Location.LocationObjectCoords>(emptyPositionObject);

  const watchPositionCallback = (position: Location.LocationObject) => {
    setCurrentPosition(position.coords);
    updateSensorsData({ location: position.coords });
  };

  // Configuration for Location.watchPositionAsync
  const watchPositionConfig = {
    timeInterval,
    distanceInterval: 0, // Track location updates regardless of the distance moved
    accuracy: Location.LocationAccuracy.BestForNavigation, // Use the best accuracy available for navigation
  };

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    (async () => {
      if (locationPermission && startSensors) {
        // Start tracking the position if permission is granted and sensors are active
        subscription = await Location.watchPositionAsync(
          watchPositionConfig,
          watchPositionCallback
        );
      } else {
        // Stop tracking the position and reset the position state if sensors are stopped or permission is denied
        subscription && subscription.remove();
        setCurrentPosition(emptyPositionObject);
      }
    })();

    // Clean up the subscription when the component unmounts or dependencies change
    return () => subscription && subscription.remove();
  }, [startSensors, locationPermission]);

  return (
    <View style={styles.container}>
      {locationPermission ? (
        <View style={styles.container}>
          <Text style={styles.title}>Location Tracking</Text>
          <Text>Altitude: {currentPosition.altitude?.toFixed(4)}</Text>
          <Text>Latitude: {currentPosition.latitude.toFixed(4)}</Text>
          <Text>Longitude: {currentPosition.longitude.toFixed(4)}</Text>
          <Text>Heading: {currentPosition.heading?.toFixed(2)}</Text>
          <Text>Speed: {currentPosition.speed?.toFixed(2)}</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Location Tracking</Text>
          <Text style={{ fontSize: 16 }}>Location permission not granted</Text>
          <Button
            title="Request Permission"
            onPress={requestLocationPermission}
          />
        </View>
      )}
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
    backgroundColor: "#e1bee7",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
