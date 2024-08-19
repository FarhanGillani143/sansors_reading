import * as Location from "expo-location";
import { AccelerometerMeasurement } from "expo-sensors";

/**
 * Type representing the accelerometer data, excluding the `timestamp` property
 * as timestamps will be manually added when tracking the data.
 */
export type AccelerometerDataType = Omit<AccelerometerMeasurement, "timestamp">;

/**
 * Type representing the sensor data, which includes manually added timestamps,
 * accelerometer data, and optional location data.
 */
export type SensorDataType = {
  timestamp: string; // Manually added timestamp in string format
  accelerationData: AccelerometerDataType | undefined; // Accelerometer data without timestamp
  locationData: Location.LocationObjectCoords | undefined; // Location data if available
};

/**
 * Arguments type for the function used to update data in the ContextProvider.
 */
export type UpdateDataArguments = {
  acceleration?: AccelerometerDataType; // Optional accelerometer data
  location?: Location.LocationObjectCoords; // Optional location data
};

/**
 * Interface representing the structure of the context used for managing sensor data and state.
 */
export interface SensorContextType {
  sensorsData: SensorDataType[]; // Array of sensor data records (accelerometer and location)
  timeInterval: number; // Time interval for sensor data collection.
  locationPermission: boolean; // Flag indicating if location permission has been granted
  startSensors: boolean; // Flag to indicate whether the sensors should be active
  sensorsController: VoidFunction; // Function to toggle the sensor's active state
  updateSensorsData: ({ acceleration, location }: UpdateDataArguments) => void; // Function to update the sensor data in the context
  updateTimeIntervalAsync: (interval: number) => Promise<void>; // Function to update the time interval asynchronously.
  requestLocationPermission: VoidFunction; // Function to request location permission from the user
}
