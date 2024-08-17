import React, { createContext, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { AccelerometerMeasurement } from "expo-sensors";
import dateTimeStringWithMilliseconds from "../utils/dateTimeStringwithMs";
import { AccelerometerDataType } from "../app/components/Accelerometer/Accelerometer";

export type SensorDataType = {
  accelerometerData: AccelerometerDataType[];
};

export interface SensorContextType {
  sensorsData: AccelerometerDataType[];
  locationPermission: boolean;
  startSensors: boolean;
  sensorsController: VoidFunction;
  updateData: (data: AccelerometerMeasurement) => void;
}

export const SensorsContext = createContext<SensorContextType>({
  sensorsData: [],
  startSensors: false,
  locationPermission: false,
  sensorsController() {},
  updateData(data) {},
});

type PropsType = {
  children: JSX.Element[];
};

export default function SensorContextProvider({ children }: PropsType) {
  const sensorDataRef = useRef<AccelerometerDataType[]>([]);
  const [startSensors, setStartSensors] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  const [status, requestPermission] = Location.useForegroundPermissions();

  const requestLocatonPermission = async () => {
    console.log("Requesting location permission");
    if (status?.granted) {
      console.log("Location permission granted");
      setLocationPermission(true);
    } else {
      console.log("Location permission denied");
      const { granted } = await requestPermission();
      if (granted) {
        console.log("Now granted");
        setLocationPermission(true);
      } else {
        console.log("denied again");
      }
    }
  };

  /** Starts or stops the sensor based on its current state. */
  const sensorsController = () => setStartSensors(!startSensors);

  /**
   * Prepends newly measured sensor readings to the list to ensure it remains up-to-date.
   */
  const updateData = (data: AccelerometerMeasurement) => {
    /*
     * The `timestamp` property in the `AccelerometerMeasurement` object
     * consistently returns `undefined` on Android devices.
     * To address this issue, we manually add timestamps to ensure accurate timing data.
     */

    const timestamp = dateTimeStringWithMilliseconds();
    const reading = { ...data, timestamp };
    sensorDataRef.current.unshift(reading);
  };

  useEffect(() => {
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
