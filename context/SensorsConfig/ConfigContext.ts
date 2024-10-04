import { createContext } from "react";

export type SensorsConfigContextType = {
  /**
   * Flag to indicate if no sensor is available.
   */
  noSensorAvailable: boolean;

  /**
   * Flag indicating if the accelerometer sensor is available.
   */
  isAccelerometerAvailable: boolean;

  /**
   * Flag indicating if location permission has been granted.
   */
  locationPermission: boolean;

  /**
   * Flag to indicate whether the sensors should be active.
   */
  startSensors: boolean;

  /**
   * The start time of the current sensor session, if any.
   */
  sessionStartTime: Date | undefined;

  /**
   * The end time of the current sensor session, if any.
   */
  sessionEndTime: Date | undefined;

  /**
   * Array storing the names of all the recorded sessions.
   */
  allSessions: string[];

  /**
   * Function to toggle the sensor's active state.
   */
  sensorsController: VoidFunction;

  /**
   * Function to request location permission from the user.
   */
  requestLocationPermission: VoidFunction;
};

export const SensorsConfigContext = createContext<SensorsConfigContextType>({
  startSensors: false,
  locationPermission: false,
  sessionStartTime: undefined,
  sessionEndTime: undefined,
  allSessions: [],
  noSensorAvailable: false,
  isAccelerometerAvailable: false,
  sensorsController() {},
  requestLocationPermission() {},
});
