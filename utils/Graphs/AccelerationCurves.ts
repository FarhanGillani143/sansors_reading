import { line, scaleTime, scaleLinear, curveMonotoneX } from "d3";
import { SensorDataType } from "../../types/DataTypes";
import {
  X_AXIS_RANGE,
  Y_AXIS_RANGE,
  X_ACCELERATION_COLOR,
  Y_ACCELERATION_COLOR,
  Z_ACCELERATION_COLOR,
} from "../../app/graphs/Acceleration/Contants";

type GraphLineParameters = {
  minValue: number;
  maxValue: number;
  sensorsData: SensorDataType[]; // Array containing time and acceleration values from the sensor.
};

/**
 * Generates the graph data required to plot acceleration values over time.
 * This includes the x and y axis scales, tick labels, and curves for X, Y, and Z accelerations.
 *
 * @param {GraphLineParameters} params - Configuration parameters for the graph.
 * @param {number} params.minValue - The lowest acceleration value to display on the y-axis.
 * @param {number} params.maxValue - The highest acceleration value to display on the y-axis.
 * @param {SensorDataType[]} params.sensorsData - Array of sensor data with timestamps and acceleration values.
 *
 * @returns {object} An object containing x and y axis scales, tick labels, and paths for plotting acceleration curves.
 */
export function generateAccelerationCurves({
  minValue,
  maxValue,
  sensorsData,
}: GraphLineParameters) {
  // Create the y-axis scale to convert acceleration values to y-coordinates in pixels.
  const yAxisScale = scaleLinear()
    .domain([minValue, maxValue]) // Range of acceleration values for the y-axis.
    .range(Y_AXIS_RANGE) // Maps the domain to the y-axis height in pixels.
    .clamp(true); // Ensure the values stay within the bounds of the y-axis range.

  // Get the timestamps for the start and end of the sensor data to define the x-axis scale.
  const sessionEndTime = sensorsData[0].timeDateObject; // Most recent timestamp.
  const sessionStartTime = sensorsData[sensorsData.length - 1].timeDateObject; // Earliest timestamp.

  // Create the x-axis scale to convert timestamps to x-coordinates in pixels.
  const xAxisScale = scaleTime()
    .domain([sessionStartTime, sessionEndTime]) // Time range for the x-axis.
    .range(X_AXIS_RANGE); // Maps the domain to the width of the x-axis in pixels.

  // Calculate the time duration of the entire sensor data to create evenly spaced x-axis ticks.
  const totalDuration = sessionEndTime.getTime() - sessionStartTime.getTime(); // Total duration in milliseconds.
  const xTickInterval = totalDuration / 4; // Divide by 4 to create 5 evenly spaced ticks.

  // Generate tick labels for the x-axis at regular time intervals.
  const xAxisLabels = Array.from(
    { length: 5 }, // Create 5 x-axis tick labels.
    (_, i) => new Date(sessionStartTime.getTime() + i * xTickInterval) // Label positions at each time interval.
  );

  // Calculate the range of acceleration values to create evenly spaced y-axis ticks.
  const totalValues = maxValue - minValue; // Total range of acceleration values.
  const yTickInterval = totalValues / 5; // Divide by 5 to create 6 evenly spaced ticks.

  // Generate tick labels for the y-axis based on the calculated intervals.
  const yAxisLabels = Array.from(
    { length: 6 }, // Create 6 y-axis tick labels.
    (_, i) => (minValue + i * yTickInterval).toFixed(2) // Labels with 2 decimal precision.
  );

  // Create a smooth curve for the X-axis acceleration values using the x and y scales.
  const xCurve = line<SensorDataType>()
    .x((d) => xAxisScale(d.timeDateObject)) // Maps the x-coordinate to the timestamp.
    .y((d) => yAxisScale(d.accelerationData?.x ?? 0)) // Maps the y-coordinate to the X-axis acceleration.
    .curve(curveMonotoneX)(sensorsData); // Generates a smooth line using the data points.

  // Create a smooth curve for the Y-axis acceleration values.
  const yCurve = line<SensorDataType>()
    .x((d) => xAxisScale(d.timeDateObject)) // Maps the x-coordinate to the timestamp.
    .y((d) => yAxisScale(d.accelerationData?.y ?? 0)) // Maps the y-coordinate to the Y-axis acceleration.
    .curve(curveMonotoneX)(sensorsData); // Generates a smooth line using the data points.

  // Create a smooth curve for the Z-axis acceleration values.
  const zCurve = line<SensorDataType>()
    .x((d) => xAxisScale(d.timeDateObject)) // Maps the x-coordinate to the timestamp.
    .y((d) => yAxisScale(d.accelerationData?.z ?? 0)) // Maps the y-coordinate to the Z-axis acceleration.
    .curve(curveMonotoneX)(sensorsData); // Generates a smooth line using the data points.

  // Return the scales, tick labels, and curves to be used for graph rendering.
  return {
    xAxisScale, // The x-axis scale for mapping timestamps to pixel coordinates.
    yAxisScale, // The y-axis scale for mapping acceleration values to pixel coordinates.
    xAxisLabels, // Labels to display on the x-axis at regular time intervals.
    yAxisLabels, // Labels to display on the y-axis at regular acceleration intervals.
    accelerationCurves: [
      { curve: xCurve, color: X_ACCELERATION_COLOR }, // Path and color for X-axis acceleration curve.
      { curve: yCurve, color: Y_ACCELERATION_COLOR }, // Path and color for Y-axis acceleration curve.
      { curve: zCurve, color: Z_ACCELERATION_COLOR }, // Path and color for Z-axis acceleration curve.
    ],
  };
}
