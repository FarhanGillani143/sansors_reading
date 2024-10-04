import { createContext } from "react";
import { UpdateSensorsData } from "../../types/FunctionTypes";
import { SensorDataType, VarianceDataType } from "../../types/DataTypes";

/**
 * Context to manage and provide sensor-related state, including accelerometer and location data.
 * The context offers functions to control sensors, update their data, and initializes with default values.
 */
export const SensorsContext = createContext<SensorContextType>({
  sensorsData: [], // Initial empty array for sensor data
  varianceData: [], // Initial empty array for variance data
  emptySessionData() {}, // Default empty session data function
  updateVarianceData(data) {}, // Default update variance data function
  updateSensorsData() {}, // Default update sensor data function
  storeSessionDataAsync: async () => true, // Default async function to store session data
});

/**
 * Interface representing the structure of the context used for managing sensor data and state.
 */
export interface SensorContextType {
  /**
   * Array of variance data related to accelerometer readings.
   */
  varianceData: VarianceDataType[];

  /**
   * Array of sensor data records (accelerometer and location).
   */
  sensorsData: SensorDataType[];

  /**
   * Function to clear the current session's sensor data and variance data.
   */
  emptySessionData: VoidFunction;

  /**
   * Function to update variance data in the context.
   *
   * @param {VarianceDataType} data - Object containing the variance data to update.
   */
  updateVarianceData: (data: VarianceDataType) => void;

  /**
   * Function to update the sensor data in the context.
   *
   * @param {UpdateSensorsData} params - Object containing the accelerometer and/or location data to be updated.
   */
  updateSensorsData: (params: UpdateSensorsData) => void;

  /**
   * Asynchronous function to store the current session data.
   *
   * @returns {Promise<boolean>} - A promise that resolves to indicate success or failure of the storage operation.
   */
  storeSessionDataAsync: () => Promise<boolean>;
}
