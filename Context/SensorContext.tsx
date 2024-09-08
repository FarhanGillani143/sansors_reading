import { createContext } from "react";
import { SensorDataType } from "../types/DataTypes";
import { UpdateSensorsData } from "../types/FunctionTypes";

/**
 * Context to manage and provide sensor-related state, including accelerometer and location data.
 * The context offers functions to control sensors and update their data, and initializes with default values.
 */
export const SensorsContext = createContext<SensorContextType>({
  sensorsData: [],
  startSensors: false,
  timeInterval: 200,
  locationPermission: false,
  sessionStartTime: undefined,
  sessionEndTime: undefined,
  allSessions: [],
  noSensorAvailable: false,
  isAccelerometerAvailable: false,
  sensorsController() {},
  updateSensorsData() {},
  requestLocationPermission() {},
  async updateTimeIntervalAsync(interval) {},
});

/**
 * Interface representing the structure of the context used for managing sensor data and state.
 */
export interface SensorContextType {
  noSensorAvailable: boolean;
  isAccelerometerAvailable: boolean;
  /**
   * Array of sensor data records (accelerometer and location).
   */
  sensorsData: SensorDataType[];

  /**
   * Time interval for sensor data collection.
   */
  timeInterval: number;

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
   * Function to update the sensor data in the context.
   *
   * @param {UpdateSensorsData} params - Object containing the accelerometer and/or location data to be updated.
   */
  updateSensorsData: (params: UpdateSensorsData) => void;

  /**
   * Function to update the time interval asynchronously.
   *
   * @param {number} interval - The new time interval to be set.
   * @returns {Promise<void>} - A promise that resolves once the time interval is updated.
   */
  updateTimeIntervalAsync: (interval: number) => Promise<void>;

  /**
   * Function to request location permission from the user.
   */
  requestLocationPermission: VoidFunction;
}
