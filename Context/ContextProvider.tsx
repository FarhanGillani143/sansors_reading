import React, { createContext, useRef, useState } from "react";
import { AccelerometerMeasurement } from "expo-sensors";
import dateTimeStringWithMilliseconds from "../utils/dateTimeStringwithMs";
import { AccelerometerDataType } from "../app/components/Accelerometer/Accelerometer";

export type SensorDataType = {
  accelerometerData: AccelerometerDataType[];
};

export interface SensorContextType {
  sensorsData: AccelerometerDataType[];
  startSensors: boolean;
  sensorsController: VoidFunction;
  updateData: (data: AccelerometerMeasurement) => void;
}

export const SensorsContext = createContext<SensorContextType>({
  sensorsData: [],
  startSensors: false,
  sensorsController() {},
  updateData(data) {},
});

type PropsType = {
  children: JSX.Element[];
};

export default function SensorContextProvider({ children }: PropsType) {
  const sensorDataRef = useRef<AccelerometerDataType[]>([]);
  const [startSensors, setStartSensors] = useState<boolean>(false);

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
  return (
    <SensorsContext.Provider
      value={{
        sensorsData: sensorDataRef.current,
        updateData,
        sensorsController,
        startSensors,
      }}
    >
      {children}
    </SensorsContext.Provider>
  );
}
