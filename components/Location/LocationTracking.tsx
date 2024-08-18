import { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

import { SensorContextType } from "../../utils/DataTypes";
import { SensorsContext } from "../../context/ContextProvider";

/**
 * Default position object used to reset the position state
 * when the location is not being tracked or the permission is not granted.
 */
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

/**
 * GPS component that tracks and displays the user's location.
 * It integrates with the SensorsContext to control and update location data.
 *
 * @returns {JSX.Element} The GPS tracking component.
 */
export default function LocationTracking() {
  // Access the sensor context values and functions
  const {
    startSensors, // Indicates if sensors should be active
    locationPermission, // Indicates if location permission is granted
    updateData, // Function to update the sensor data in the context
    requestLocationPermission, // Function to request location permission
  } = useContext<SensorContextType>(SensorsContext);

  // State to hold the current position data
  const [position, setPosition] =
    useState<Location.LocationObject>(emptyPositionObject);

  /**
   * Callback function to handle the position updates from Location.watchPositionAsync.
   * It updates the position state and the sensor data in the context.
   *
   * @param {Location.LocationObject} position - The latest position data.
   */
  const watchPositionCallback = (position: Location.LocationObject) => {
    console.log(position); // Log the position data for debugging purposes
    setPosition(position); // Update the state with the new position
    updateData({ location: position.coords }); // Update the context with the new location data
  };

  // Configuration for Location.watchPositionAsync
  const watchPositionConfig = {
    distanceInterval: 0, // Track location updates regardless of the distance moved
    accuracy: Location.LocationAccuracy.BestForNavigation, // Use the best accuracy available for navigation
  };

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    /**
     * Async function to manage the location tracking based on the permission and sensor state.
     */
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
        setPosition(emptyPositionObject);
      }
    })();

    // Clean up the subscription when the component unmounts or dependencies change
    return () => subscription && subscription.remove();
  }, [startSensors, locationPermission]); // Dependency array ensures effect runs when sensor state or permission changes

  return (
    <View style={styles.container}>
      {locationPermission ? (
        <View style={styles.container}>
          <Text style={styles.title}>Location Tracking</Text>
          {/* Display the current location data */}
          <Text>Altitude: {position?.coords.altitude?.toFixed(4)}</Text>
          <Text>Latitude: {position?.coords.latitude.toFixed(4)}</Text>
          <Text>Longitude: {position?.coords.longitude.toFixed(4)}</Text>
          <Text>Heading: {position?.coords.heading?.toFixed(2)}</Text>
          <Text>Speed: {position?.coords.speed?.toFixed(2)}</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Location Tracking</Text>
          <Text style={{ fontSize: 16 }}>Location permission not granted</Text>
          {/* Button to request location permission if not granted */}
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
