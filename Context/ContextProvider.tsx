import React, { createContext, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Location from "expo-location";

import dateTimeStringWithMilliseconds from "../utils/dateTimeStringwithMs";
import { requestLocatonPermissionAsync } from "../utils/LocationPermission";
import {
  SensorDataType,
  SensorContextType,
  UpdateDataArguments,
  AccelerometerDataType,
} from "../utils/DataTypes";

/**
 * Context to manage and provide sensor-related state, including accelerometer and location data.
 * The context offers functions to control sensors and update their data, and initializes with default values.
 */
export const SensorsContext = createContext<SensorContextType>({
  sensorsData: [],
  startSensors: false,
  locationPermission: false,
  sensorsController() {},
  updateData() {},
  requestLocationPermission() {},
});

type PropsType = {
  children: JSX.Element | JSX.Element[];
};

export default function SensorContextProvider({ children }: PropsType) {
  const sensorDataRef = useRef<SensorDataType[]>([]); // Ref to store the sensor data (accelerometer and location)
  const [startSensors, setStartSensors] = useState<boolean>(false); // State to track whether sensors should be active
  const [locationPermission, setLocationPermission] = useState<boolean>(false); // State to track location permission status
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  ); // State to monitor the current app state

  /**
   * Toggles the state to start or stop the sensors.
   */
  const sensorsController = () => setStartSensors(!startSensors);

  let locationData: Location.LocationObjectCoords | undefined;
  let accelerationData: AccelerometerDataType | undefined;

  /**
   * Updates the sensor data by adding the latest accelerometer and/or location reading
   * to the beginning of the sensor data array. If location permission is granted, location data
   * is included with the accelerometer data.
   *
   * @param {UpdateDataArguments} data - The latest accelerometer and/or location data.
   */
  const updateData = ({ acceleration, location }: UpdateDataArguments) => {
    if (location) {
      locationData = location; // Update the location data if newer version availabe
    }

    if (acceleration) {
      accelerationData = acceleration; // Update the acceleration data if newer version availabe
    }

    /**
     * Records data with or without location based on the availability of location permissions.
     * If location permission is granted, both location and accelerometer data are recorded.
     * Otherwise, only accelerometer data is recorded.
     */
    const recordDataWithLocation =
      acceleration && locationPermission && locationData;
    const recordDataWithoutLocation = acceleration && !locationPermission;

    if (recordDataWithLocation || recordDataWithoutLocation) {
      const timestamp = dateTimeStringWithMilliseconds();
      const reading = {
        timestamp,
        locationData,
        accelerationData,
      };
      sensorDataRef.current.unshift(reading); // Add the new reading to the start of the array
    }
  };

  /**
   * Requests location permission from the user and updates the locationPermission state
   * based on the user's response.
   */
  const requestLocationPermission = async () => {
    const permissionGranted = await requestLocatonPermissionAsync();
    setLocationPermission(permissionGranted);
  };

  /**
   * Callback function that handles app state changes.
   * If the app becomes active from an inactive or background state, location permission is requested.
   *
   * @param {AppStateStatus} nextAppState - The new app state.
   */
  const appStateCallback = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      await requestLocationPermission();
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    // Request location permission if it hasn't been granted yet
    (async () => {
      if (!locationPermission) {
        await requestLocationPermission();
      }
    })();
  }, []);

  /**
   * Monitors app state changes to update the location permission state
   * if the user changes location settings while the app is inactive or in the background.
   */
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      appStateCallback
    );

    return () => appStateSubscription.remove();
  }, [appState]);

  return (
    <SensorsContext.Provider
      value={{
        startSensors,
        locationPermission,
        sensorsData: sensorDataRef.current,
        updateData,
        sensorsController,
        requestLocationPermission,
      }}
    >
      {children}
    </SensorsContext.Provider>
  );
}
