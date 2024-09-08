import React, { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

import { SensorsContext } from "./SensorContext";
import { UpdateSensorsData } from "../types/FunctionTypes";
import dateTimeStringWithMilliseconds from "../utils/dateTimeStringwithMs";
import { requestLocatonPermissionAsync } from "../utils/LocationPermission";
import { SensorDataType, AccelerometerDataType } from "../types/DataTypes";
import {
  storeSessionData,
  storeSessionNames,
  retrieveSessionNames,
  storeTimeIntervalAsync,
  retrieveTimeIntervalAsync,
} from "../utils/ManageStorage";

type PropsType = {
  children: JSX.Element | JSX.Element[];
};

export default function SensorContextProvider({ children }: PropsType) {
  const sensorDataRef = useRef<SensorDataType[]>([]); // Ref to store sensor data (accelerometer and location).
  const [locationPermission, setLocationPermission] = useState<boolean>(false); // State to track location permission status.
  const [sessionEndTime, setSessionEndTime] = useState<Date>(); // State to track the session end time.
  const [sessionStartTime, setSessionStartTime] = useState<Date>(); // State to track the session start time.
  const [isAccelerometerAvailable, setIsAccelerometerAvailable] =
    useState<boolean>(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  ); // State to monitor the current app state.

  /** State to track whether sensors should be active */
  const [startSensors, setStartSensors] = useState<boolean>(false);

  /** Time interval property for sensors */
  const [timeInterval, setTimeInterval] = useState<number>(200);

  /** Contains names of all the sessions recorded so far */
  const [allSessions, setAllSessions] = useState<string[]>([]);

  /**
   * Toggles the state to start or stop the sensors.
   * If sensors are stopped, it stores the session data and updates the session history.
   */
  const sensorsController = async () => {
    const timeNow = new Date();
    if (startSensors) {
      setStartSensors(false);
      setSessionEndTime(timeNow);

      /** Generate a session name using start and end times for easy identification */
      const sessionName =
        sessionStartTime?.toLocaleString() + " - " + timeNow.toLocaleString();

      setAllSessions((previousState) => [sessionName, ...previousState]);

      // Store the session's data and update session names if successful.
      const isStored = await storeSessionData({
        sessionName,
        sensorsData: sensorDataRef.current,
      });

      if (isStored) {
        await storeSessionNames([sessionName, ...allSessions]);
      }
    } else {
      sensorDataRef.current = []; // Clear previous session data when starting a new session.
      setStartSensors(true);
      setSessionStartTime(timeNow);
    }
  };

  /**
   * Updates the time interval for sensor data collection and stores it locally.
   *
   * @param {number} interval - The new time interval to be set.
   */
  const updateTimeIntervalAsync = async (interval: number) => {
    setTimeInterval(interval);
    await storeTimeIntervalAsync(interval); // Persist the interval setting for future sessions.
  };

  let locationData: Location.LocationObjectCoords | undefined;
  let accelerationData: AccelerometerDataType | undefined;

  /**
   * Updates the sensor data by adding the latest accelerometer and/or location reading
   * to the beginning of the sensor data array.
   *
   * @param {UpdateSensorsData} data - The latest accelerometer and/or location data.
   */
  const updateSensorsData = ({ acceleration, location }: UpdateSensorsData) => {
    if (location) {
      locationData = location; // Update the location data if available.
    }

    if (acceleration) {
      accelerationData = acceleration; // Update the acceleration data if available.
    }

    /**
     * Record data based on location permission status.
     * If location permission is granted, record both location and accelerometer data.
     * Otherwise, record only accelerometer data.
     */
    const recordDataWithLocation =
      acceleration && locationPermission && locationData;
    const recordDataWithoutLocation = acceleration && !locationPermission;
    const recordDataWithoutAcceleration =
      locationPermission && locationData && !isAccelerometerAvailable;

    /** Doing all these checks because we want to record data of all the sensors in
     * a sync if all the sensors are available
     */
    if (
      recordDataWithLocation ||
      recordDataWithoutLocation ||
      recordDataWithoutAcceleration
    ) {
      const timestamp = dateTimeStringWithMilliseconds();
      const reading = {
        timestamp,
        locationData,
        accelerationData,
      };
      sensorDataRef.current.unshift(reading); // Add the new reading to the start of the array.
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

  /** Verifies the availability of the sensor on the device. */
  const checkAccelerometerAvailability = async () => {
    const isAvailable = await Accelerometer.isAvailableAsync();
    setIsAccelerometerAvailable(isAvailable);
  };

  useEffect(() => {
    /**
     * On component mount, request location permission if not already granted,
     * retrieve the stored time interval, and load session names from storage.
     */
    (async () => {
      await checkAccelerometerAvailability();

      if (!locationPermission) {
        await requestLocationPermission();
      }

      const sensorTimeInterval = await retrieveTimeIntervalAsync();
      if (sensorTimeInterval) setTimeInterval(sensorTimeInterval);

      const sessionNames = await retrieveSessionNames();
      if (sessionNames) setAllSessions(sessionNames);
    })();
  }, []);

  useEffect(() => {
    /**
     * Manages the screen wake state based on the sensor activity.
     * Keeps the screen awake if sensors are active to ensure continuous tracking.
     */
    (async () => {
      if (startSensors) {
        await activateKeepAwakeAsync();
      } else {
        deactivateKeepAwake();
      }
    })();
  }, [startSensors]);

  /**
   * Callback function that handles app state changes.
   * Requests location permission if the app becomes active from an inactive
   * or background state.
   */
  const appStateCallback = async (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      await requestLocationPermission();
    }
    setAppState(nextAppState);
  };

  /**
   * Monitors app state changes to update the location permission state if the
   * user changes location settings while the app is inactive or in the background.
   */
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      appStateCallback
    );

    return () => appStateSubscription.remove(); // Cleanup the listener on unmount.
  }, [appState]);

  return (
    <SensorsContext.Provider
      value={{
        allSessions,
        startSensors,
        timeInterval,
        sessionEndTime,
        sessionStartTime,
        locationPermission,
        isAccelerometerAvailable,
        sensorsData: sensorDataRef.current,
        noSensorAvailable: !locationPermission && !isAccelerometerAvailable,
        sensorsController,
        updateSensorsData,
        updateTimeIntervalAsync,
        requestLocationPermission,
      }}
    >
      {children}
    </SensorsContext.Provider>
  );
}
