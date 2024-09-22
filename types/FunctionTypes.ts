import * as Location from "expo-location";
import { AccelerometerDataType, SensorDataType } from "./DataTypes";

/**
 * Type representing the structure for storing session data.
 */
export type StoreSessionData = {
  /**
   * The name of the session, typically a string that uniquely identifies
   * the session, often including start and end times.
   */
  sessionName: string;

  /**
   * An array containing sensor data records for the session.
   * Each entry in the array corresponds to a data point captured by the sensors.
   */
  sensorsData: SensorDataType[];
};

/**
 * Arguments type for the function used to update sensor data within the ContextProvider.
 * This type is used to pass the latest sensor readings to the context.
 */
export type UpdateSensorsData = {
  /**
   * Optional accelerometer data captured from the device.
   * This can include information about the device's movement along the X, Y, and Z axes.
   */
  acceleration?: AccelerometerDataType;

  /**
   * Optional location data, which includes the device's geographic coordinates.
   * This data is retrieved using the Expo Location API and can include latitude,
   * longitude, altitude, and other relevant location information.
   */
  location?: Location.LocationObjectCoords;
};

export type UpdateMinMaxType = {
  prevMin: number;
  prevMax: number;
  sensorData: SensorDataType;
};
