import { ScaleLinear, ScaleTime } from "d3";
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
  timeDateObject: Date; // To access actual date object
  timestamp: string; // Manually added timestamp in string format
  accelerationData: AccelerometerDataType | undefined; // Accelerometer data without timestamp
  locationData: Location.LocationObjectCoords | undefined; // Location data if available
};

export type AccelerationGraphType = {
  xAxisScale: ScaleTime<number, number, never>;
  yAxisScale: ScaleLinear<number, number, never>;
  xAxisLabels: Date[]; // Labels for the x-axis ticks
  yAxisLabels: string[]; // Labels for the y-axis ticks
  accelerationCurves: {
    curve: string | null;
    color: string;
  }[];
};
