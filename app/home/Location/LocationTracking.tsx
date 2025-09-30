import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import * as Location from "expo-location"; // Import Expo's location API

import TextButton from "../../../components/TextButton";
import { LocationDataType } from "../../../types/DataTypes";
import { speedConversion } from "../../../utils/SpeedConversions"; // Utility functions to convert speed
import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorsData/SensorContext"; // Sensor context for sensor-related data
import {
  SensorsConfigContext,
  SensorsConfigContextType,
} from "../../../context/SensorsConfig/ConfigContext";
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
  const { startSensors, locationPermission, requestLocationPermission } =
    useContext<SensorsConfigContextType>(SensorsConfigContext);

  const { speedUnit, sensorTimeInterval } =
    useContext<ConfigContextType>(ConfigurationContext);

  const { updateSensorsData } = useContext<SensorContextType>(SensorsContext);
  const [currentPosition, setCurrentPosition] =
    useState<LocationDataType>(emptyPositionObject); // State to store the current location data

  /**
   * Callback function to handle location updates from the Location API.
   */
  const watchPositionCallback = (position: Location.LocationObject) => {
    const currentSpeed = speedConversion({
      newUnit: speedUnit,
      previousUnit: "mps",
      speed: position.coords.speed,
    }); // Calculate speed with unit conversion

    const locationData = {
      ...position.coords,
      speed: `${currentSpeed} ${speedUnit}`,
    };
    setCurrentPosition(locationData); // Update state with the latest location data
    updateSensorsData({ location: locationData }); // Update sensor data context with the location and speed
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
          <View style={styles.row}>
            <Text style={{color:'red', fontWeight:'bold'}}>Altitude: {currentPosition.altitude?.toFixed(2)}m</Text>
            <View style={styles.divider}></View>
            <Text style={{color:'red', fontWeight:'bold'}}>
              Heading: {currentPosition.heading?.toFixed(2)}° from north
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{color:'red', fontWeight:'bold'}}>Latitude: {currentPosition.latitude.toFixed(4)}°</Text>
            <View style={styles.divider}></View>
            <Text style={{color:'red',fontWeight:'bold'}}>Longitude: {currentPosition.longitude.toFixed(4)}°</Text>
          </View>
          <Text style={{color:'red', fontWeight:'bold', backgroundColor:'skyblue', padding:5,borderRadius:5,}}>Speed: {currentPosition.speed}</Text>
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
    padding: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333", // Light purple background color
    borderRadius:5
    
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginVertical: 10,
    color:'#ffffff'
  },
  row: {
    gap: 10,
    flexDirection: "row",
    backgroundColor:'skyblue',
    padding:5,
    borderRadius:5

  },
  divider: {
    borderWidth: 1,
    borderColor: "#000000",
  },
});
