import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import * as Location from "expo-location"; // Import Expo's location API

import TextButton from "../../../components/TextButton";
import { LocationDataType } from "../../../types/DataTypes";
import { mpsToKph, mpsToMph } from "../../../utils/SpeedConversions"; // Utility functions to convert speed
import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorsData/SensorContext"; // Sensor context for sensor-related data
import {
  ConfigContextType,
  ConfigurationContext,
} from "../../../context/Configuration/ConfigurationContext"; // Configuration context for app configuration data

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
  speed: "0",
  altitudeAccuracy: 0,
};

export default function LocationTracking() {
  const {
    startSensors,
    locationPermission,
    updateSensorsData,
    requestLocationPermission,
  } = useContext<SensorContextType>(SensorsContext);

  const { speedUnit, sensorTimeInterval } =
    useContext<ConfigContextType>(ConfigurationContext);

  const [currentPosition, setCurrentPosition] =
    useState<LocationDataType>(emptyPositionObject); // State to store the current location data

  /**
   * Converts the raw speed data (in meters per second) to the appropriate unit (KM/H or Miles/H)
   */
  const speedCalculation = (speed: number | null) => {
    if (speed && speed != -1) {
      // Convert the speed to the configured speed unit
      if (speedUnit === "mph") return `${mpsToMph(speed).toFixed(2)} Miles/H`;
      return `${mpsToKph(speed).toFixed(2)} KM/H`;
    } else {
      // Default to 0 if speed is null or invalid
      return `0${speedUnit === "kph" ? " KM/H" : " Miles/H"}`;
    }
  };

  /**
   * Callback function to handle location updates from the Location API.
   * @param {Location.LocationObject} position - The latest location object.
   */
  const watchPositionCallback = (position: Location.LocationObject) => {
    const speed = speedCalculation(position.coords.speed); // Calculate speed with unit conversion
    setCurrentPosition({ ...position.coords, speed }); // Update state with the latest location data
    updateSensorsData({
      location: { ...position.coords, speed }, // Update sensor data context with the location and speed
    });
  };

  // Configuration options for Location.watchPositionAsync
  const watchPositionConfig = {
    timeInterval: sensorTimeInterval, // Interval for receiving location updates
    distanceInterval: 0, // Track location updates regardless of the distance moved
    accuracy: Location.LocationAccuracy.BestForNavigation, // Set the highest accuracy level for navigation purposes
  };

  const subscriptionRef = useRef<Location.LocationSubscription>(); // Ref to hold the subscription object

  useEffect(() => {
    (async () => {
      if (locationPermission && startSensors) {
        // If location permission is granted and sensors are active, start tracking location
        try {
          subscriptionRef.current = await Location.watchPositionAsync(
            watchPositionConfig,
            watchPositionCallback // Use callback to handle position updates
          );
        } catch (error) {
          Alert.alert("Error", "Unable to track location."); // Show alert if there's an error
        }
      } else {
        // If sensors are stopped or permission is not granted, stop tracking and reset the position state
        if (subscriptionRef.current) subscriptionRef.current.remove();
        setCurrentPosition(emptyPositionObject); // Reset location data when sensors stop
      }
    })();

    // Clean up the subscription when the component unmounts or dependencies change
    return () => {
      if (subscriptionRef.current) subscriptionRef.current.remove();
    };
  }, [startSensors, locationPermission]);

  return (
    <View style={styles.container}>
      {locationPermission ? (
        <View style={styles.container}>
          <Text style={styles.title}>Location Tracking</Text>
          <Text>
            Heading: {currentPosition.heading?.toFixed(2)}° from north
          </Text>
          <Text>Latitude: {currentPosition.latitude.toFixed(4)}°</Text>
          <Text>Longitude: {currentPosition.longitude.toFixed(4)}°</Text>
          <Text>Altitude: {currentPosition.altitude?.toFixed(2)}m</Text>
          <Text>Speed: {currentPosition.speed}</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Location Tracking</Text>
          <Text style={{ fontSize: 16 }}>Location permission not granted</Text>
          <TextButton
            title="Request Permission"
            onPress={requestLocationPermission}
          />
        </View>
      )}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    gap: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e1bee7", // Light purple background color
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});
