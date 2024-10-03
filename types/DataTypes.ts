import * as Location from "expo-location";
import { AccelerometerMeasurement } from "expo-sensors";

/**
 * Type representing the accelerometer data, excluding the `timestamp` property
 * as timestamps will be manually added when tracking the data.
 */
export type AccelerometerDataType = Omit<AccelerometerMeasurement, "timestamp">;
export type LocationDataType = Omit<Location.LocationObjectCoords, "speed"> & {
  speed: string;
};
/**
 * Type representing the sensor data, which includes manually added timestamps,
 * accelerometer data, and optional location data.
 */
export type SensorDataType = {
  timeDateObject: Date; // Date object to capture the actual time the sensor data is recorded
  timestamp: string; // Manually added timestamp in string format for display or logging
  accelerationData: AccelerometerDataType | undefined; // Accelerometer data (x, y, z axes) without timestamp
  locationData: LocationDataType | undefined; // Optional location data if available (latitude, longitude, etc.)
};

/**
 * Type for representing an array of acceleration curve data with its associated color.
 */
export type CurvesType = {
  curve: string | null; // SVG path string for drawing the curve (could be null if no curve is available)
  color: string; // Color used to render the curve on the graph
}[];

/**
 * Type representing the x-axis label and its scaled value (mapped to pixels).
 */
export type XAxisDataType = {
  label: Date; // Date label for the x-axis tick
  scaledLabel: number; // Scaled pixel position for rendering the tick label
};

/**
 * Type representing the y-axis label and its scaled value (mapped to pixels).
 */
export type YAxisDataType = {
  label: string; // String label for the y-axis tick (e.g., acceleration value)
  scaledLabel: number; // Scaled pixel position for rendering the tick label
};

/**
 * Type representing the complete acceleration graph, which includes the
 * x and y axis data (for ticks) and the acceleration curves for X, Y, and Z axes.
 */
export type AccelerationGraphType = {
  xAxisData: XAxisDataType[]; // Array of labels and their positions for the x-axis ticks
  yAxisData: YAxisDataType[]; // Array of labels and their positions for the y-axis ticks
  accelerationCurves: CurvesType; // Array of SVG path strings and their associated colors for the acceleration curves
};

export type VarianceGraphType = {
  xAxisData: XAxisDataType[]; // Array of labels and their positions for the x-axis ticks
  yAxisData: YAxisDataType[]; // Array of labels and their positions for the y-axis ticks
  curve: string | null; // SVG path string for the variance acceleration curves
};

export type VarianceDataType = {
  variance: number; // Mean Variance of Acceleration values
  timestamp: Date;
};

export type SpeedDataType = {
  speed: number;
  unit: "kph" | "mph";
};
