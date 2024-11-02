import React, {
  useRef,
  useMemo,
  useState,
  useContext,
  useCallback,
} from "react";

import { SensorsContext } from "./SensorContext";
import { storeSessionData } from "../../utils/ManageStorage";
import { UpdateSensorsData } from "../../types/FunctionTypes";
import dateTimeStringWithMilliseconds from "../../utils/dateTimeStringwithMs";
import {
  SensorDataType,
  VarianceDataType,
  LocationDataType,
  AccelerometerDataType,
} from "../../types/DataTypes";
import {
  SensorsConfigContext,
  SensorsConfigContextType,
} from "../SensorsConfig/ConfigContext";

type PropsType = {
  children: JSX.Element | JSX.Element[];
};

/**
 * SensorContextProvider is responsible for managing sensor data and variance
 * updates, handling sensor sessions, and providing context values for sensor-related
 * data management.
 *
 * @param {PropsType} children - Components that will consume the SensorContext.
 */
export default function SensorContextProvider({ children }: PropsType) {
  const { locationPermission, isAccelerometerAvailable } =
    useContext<SensorsConfigContextType>(SensorsConfigContext);
  const [sensorsData, setSensorsData] = useState<SensorDataType[]>([]);

  // Reference to track variance data across different sensor readings
  const varianceDataRef = useRef<VarianceDataType[]>([]);

  /**
   * Updates variance data and appends new variance readings to the existing data.
   *
   * @param {VarianceDataType} data - Variance data from sensor readings.
   */
  const updateVarianceData = (data: VarianceDataType) => {
    varianceDataRef.current.push(data);
  };

  /**
   * Clears both the recorded sensor data and variance data. Resets the session.
   */
  const emptySessionData = useCallback(() => {
    setSensorsData([]); // Clear sensor data
    varianceDataRef.current = []; // Clear variance data
  }, []);

  // Variables to hold the latest location and acceleration data
  let locationData: LocationDataType | undefined;
  let accelerationData: AccelerometerDataType | undefined;

  /**
   * Updates sensor data by appending new readings from accelerometer and/or location sensors.
   *
   * @param {UpdateSensorsData} data - Object containing the latest accelerometer and/or location data.
   */
  const updateSensorsData = ({ acceleration, location }: UpdateSensorsData) => {
    if (location) {
      locationData = location; // Capture latest location data if provided
    }

    if (acceleration) {
      accelerationData = acceleration; // Capture latest acceleration data if provided
    }

    /**
     * Determine whether data from both location and accelerometer sensors
     * should be recorded based on the availability of sensors and permissions.
     */
    const recordDataWithLocation = !!acceleration && !!locationData;
    const recordDataWithoutLocation = !!acceleration && locationPermission;
    const recordDataWithoutAcceleration =
      locationPermission && !!locationData && !isAccelerometerAvailable;

    // Ensure that data from all available sensors is recorded simultaneously if conditions are met
    if (
      recordDataWithLocation ||
      recordDataWithoutLocation ||
      recordDataWithoutAcceleration
    ) {
      const timestamp = dateTimeStringWithMilliseconds(); // Timestamp for the reading
      const timeDateObject = new Date(); // Date object for time reference

      // Structure the new sensor reading
      const reading = {
        timeDateObject,
        timestamp,
        locationData,
        accelerationData,
      };

      // Add the new reading at the beginning of the sensorsData array
      setSensorsData((prevData) => [reading, ...prevData]);
    }
  };

  /**
   * Stores the session's sensor data asynchronously, including the start and end times of the session.
   *
   * @returns {Promise<boolean>} - A promise that resolves to indicate whether the session was successfully stored.
   */
  const storeSessionDataAsync = useCallback(async () => {
    const sessionStartTime =
      sensorsData[sensorsData.length - 1]?.timeDateObject;
    const timeNow = new Date();

    const sessionName =
      sessionStartTime?.toLocaleString() + " - " + timeNow.toLocaleString(); // Generate a session name based on the start and end times

    const isStored = await storeSessionData({ sessionName, sensorsData }); // Store the session data

    return isStored; // Return whether storage was successful
  }, [sensorsData]);

  // Memoize context values to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      sensorsData,
      varianceData: varianceDataRef.current,
      emptySessionData,
      updateSensorsData,
      updateVarianceData,
      storeSessionDataAsync,
    }),
    [sensorsData, varianceDataRef.current]
  );

  return (
    <SensorsContext.Provider value={contextValue}>
      {children}
    </SensorsContext.Provider>
  );
}
