import { line, scaleTime, scaleLinear, curveMonotoneX } from "d3";
import { SensorDataType } from "../types/DataTypes";

type GraphLineParameters = {
  sensorsData: SensorDataType[]; // Array of sensor data containing timestamp and speed values.
  yAxisRange: number[]; // Pixel range for the y-axis [min, max].
  xAxisRange: number[]; // Pixel range for the x-axis [min, max].
};

/**
 * Generates a smooth line chart representing speed data from sensors.
 * Calculates scales and tick intervals for the x and y axes, 
 * and creates a smooth curve for speed data.
 *
 * @param {GraphLineParameters} params - Parameters for generating the graph.
 * @param {SensorDataType[]} params.sensorsData - Array of sensor data with timestamp and speed values.
 * @param {number[]} params.xAxisRange - Pixel range for the x-axis [min, max].
 * @param {number[]} params.yAxisRange - Pixel range for the y-axis [min, max].
 *
 * @returns {object} - Contains xAxisScale, yAxisScale, xAxisLabels, yAxisLabels, and speedCurve for speed data.
 */
export function generateSpeedCurve({
  sensorsData,
  xAxisRange,
  yAxisRange,
}: GraphLineParameters) {
  // Extract speed values from sensor data (assuming locationData?.speed exists)
  const speedValues = sensorsData.map((d) => d.locationData?.speed ?? 0);

  // Find minimum and maximum speed values
  const minValue = Math.min(...speedValues);
  const maxValue = Math.max(...speedValues);

  // Create a y-axis scale mapping speed values to y-axis pixel positions
  const yAxisScale = scaleLinear()
    .domain([minValue, maxValue]) // Set domain to cover speed value range
    .range(yAxisRange) // Map the domain to the y-axis pixel range
    .clamp(true); // Clamp values to the domain

  // Identify the time range covered by the sensor data
  const sessionEndTime = sensorsData[0].timeDateObject; // Most recent timestamp
  const sessionStartTime = sensorsData[sensorsData.length - 1].timeDateObject; // Oldest timestamp

  // Create an x-axis scale mapping timestamps to x-axis pixel positions
  const xAxisScale = scaleTime()
    .domain([sessionStartTime, sessionEndTime]) // Set domain to the session time range
    .range(xAxisRange); // Map the domain to the x-axis pixel range

  // Calculate x-axis tick interval for 5 evenly spaced ticks
  const totalDuration = sessionEndTime.getTime() - sessionStartTime.getTime();
  const xTickInterval = totalDuration / 4;

  // Generate x-axis tick labels based on time intervals
  const xAxisLabels = Array.from(
    { length: 5 },
    (_, i) => new Date(sessionStartTime.getTime() + i * xTickInterval)
  );

  // Calculate y-axis tick interval for 5 evenly spaced ticks
  const totalValues = maxValue - minValue;
  const yTickInterval = totalValues / 5;

  // Generate y-axis tick labels based on speed intervals
  const yAxisLabels = Array.from(
    { length: 6 }, // One more label to include max value
    (_, i) => (minValue + i * yTickInterval).toFixed(2)
  );

  // Create a smooth line path for the speed data
  const speedCurve = line<SensorDataType>()
    .x((d) => xAxisScale(d.timeDateObject)) // Map x-coordinate to timestamp
    .y((d) => yAxisScale(d.locationData?.speed ?? 0)) // Map y-coordinate to speed value
    .curve(curveMonotoneX)(sensorsData); // Apply a smooth curve to the data

  // Return all generated graph components and scales
  return {
    xAxisScale,
    yAxisScale,
    xAxisLabels,
    yAxisLabels,
    speedCurve,
  };
}