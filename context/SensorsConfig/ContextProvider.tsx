import React, { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { Accelerometer } from "expo-sensors";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

import { SensorsConfigContext } from "./ConfigContext";
import { requestLocatonPermissionAsync } from "../../utils/LocationPermission";
import { storeValueAsync, retrieveValueAsync } from "../../utils/ManageStorage";

interface Props {
  children: JSX.Element | JSX.Element;
}

export default function SensorsConfigContextProvider({ children }: Props) {
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

      await storeValueAsync({
        key: "sessionNames",
        value: [sessionName, ...allSessions],
      });
    } else {
      setStartSensors(true);
      setSessionStartTime(timeNow);
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

      const sessionNames: string[] = await retrieveValueAsync("sessionNames");
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
    <SensorsConfigContext.Provider
      value={{
        allSessions,
        startSensors,
        sessionEndTime,
        sessionStartTime,
        locationPermission,
        isAccelerometerAvailable,
        noSensorAvailable: !locationPermission && !isAccelerometerAvailable,
        sensorsController,
        requestLocationPermission,
      }}
    >
      {children}
    </SensorsConfigContext.Provider>
  );
}
