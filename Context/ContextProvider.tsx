import React, { createContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import { AccelerometerMeasurement } from "expo-sensors";

import dateTimeStringWithMilliseconds from "../utils/dateTimeStringwithMs";
import { AccelerometerDataType } from "../components/Accelerometer/Accelerometer";

/**
 * Type representing the sensor data, specifically accelerometer data.
 */
export type SensorDataType = {
  accelerometerData: AccelerometerDataType[];
};

/**
 * Interface representing the structure of the context used for managing sensor data and state.
 */
export interface SensorContextType {
  sensorsData: AccelerometerDataType[]; // Array of accelerometer readings
  locationPermission: boolean; // Flag indicating if location permission is granted
  startSensors: boolean; // Flag to start or stop the sensors
  sensorsController: VoidFunction; // Function to toggle the sensor state
  updateData: (data: AccelerometerMeasurement) => void; // Function to update the sensor data
}

/**
 * Context to provide and manage the state related to sensors (e.g., accelerometer).
 * Initializes with default values.
 */
export const SensorsContext = createContext<SensorContextType>({
  sensorsData: [],
  startSensors: false,
  locationPermission: false,
  sensorsController() {},
  updateData(data) {},
});

/**
 * Props type for the SensorContextProvider component.
 */
type PropsType = {
  children: JSX.Element | JSX.Element[];
};

/**
 * SensorContextProvider component that provides sensor data and state management
 * to all its children components through context.
 *
 * @param {PropsType} props - The children components that will have access to the sensor context.
 * @returns {JSX.Element} The provider component wrapping its children with sensor context.
 */
export default function SensorContextProvider({ children }: PropsType) {
  const sensorDataRef = useRef<AccelerometerDataType[]>([]); // Ref to store the accelerometer data
  const [startSensors, setStartSensors] = useState<boolean>(false); // State to track if sensors should be running
  const [locationPermission, setLocationPermission] = useState<boolean>(false); // State to track location permission status

  const [status, requestPermission] = Location.useForegroundPermissions(); // Location permission hook from expo-location

  /**
   * Requests location permission if it has not been granted yet.
   * Updates the `locationPermission` state based on the user's decision.
   */
  const requestLocatonPermission = async () => {
    if (status?.granted) {
      setLocationPermission(true);
    } else {
      const { granted } = await requestPermission();
      if (granted) {
        setLocationPermission(true);
      } else {
        Alert.alert("Location Permission Denied");
      }
    }
  };

  /** Toggles the start or stop state of the sensors. */
  const sensorsController = () => setStartSensors(!startSensors);

  /**
   * Updates the accelerometer data by prepending the latest reading to the sensor data array.
   * Handles the issue of missing `timestamp` on Android by manually adding a timestamp.
   *
   * @param {AccelerometerMeasurement} data - The latest accelerometer measurement.
   */
  const updateData = (data: AccelerometerMeasurement) => {
    /*
     * The timestamp property in the AccelerometerMeasurement object
     * consistently returns undefined on Android devices.
     * To address this issue, we manually add timestamps to ensure accurate timing data.
     */
    const timestamp = dateTimeStringWithMilliseconds();
    const reading = { ...data, timestamp };
    sensorDataRef.current.unshift(reading); // Add the new reading to the start of the array
  };

  useEffect(() => {
    // Request location permission if it hasn't been granted yet
    (async () => !locationPermission && (await requestLocatonPermission()))();
  }, []);

  return (
    <SensorsContext.Provider
      value={{
        sensorsData: sensorDataRef.current,
        updateData,
        sensorsController,
        startSensors,
        locationPermission,
      }}
    >
      {children}
    </SensorsContext.Provider>
  );
}
