import { line, scaleTime, scaleLinear, curveMonotoneX } from "d3";
import { SensorDataType } from "../types/DataTypes";

type GraphLineParameters = {
  sensorsData: SensorDataType[]; // Array of sensor data containing time and acceleration values
  yAxisRange: number[]; // Pixel range for the y-axis [min, max]
  xAxisRange: number[]; // Pixel range for the x-axis [min, max]
};

/**
 * Creates a smooth line chart representing acceleration data from sensors.
 * Configures x and y scales, sets tick intervals, and generates curves for acceleration data.
 *
 * @param {GraphLineParameters} params - Parameters for generating the graph.
 * @param {SensorDataType[]} params.sensorsData - Array of sensor data with time and acceleration values.
 * @param {number[]} params.xAxisRange - Pixel range for the x-axis [min, max].
 * @param {number[]} params.yAxisRange - Pixel range for the y-axis [min, max].
 *
 * @returns {object} - Contains xAxisScale, yAxisScale, xAxisLabels, yAxisLabels, and curves for acceleration data.
 */
export function generateAccelerationCurves({
  sensorsData,
  xAxisRange,
  yAxisRange,
}: GraphLineParameters) {
  // Extract acceleration values X, Y, and Z from sensor data
  const xValues = sensorsData.map((d) => d.accelerationData?.x ?? 0);
  const yValues = sensorsData.map((d) => d.accelerationData?.y ?? 0);
  const zValues = sensorsData.map((d) => d.accelerationData?.z ?? 0);

  // Determine the minimum and maximum values across all acceleration data
  const allValues = [...xValues, ...yValues, ...zValues];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Create a y-scale to map acceleration values to pixel positions on the y-axis
  const yAxisScale = scaleLinear()
    .domain([minValue, maxValue]) // Set domain to cover the range of acceleration values
    .range(yAxisRange) // Map the domain to the y-axis pixel range
    .clamp(true)

  // Identify the time range of the sensor data session
  const sessionEndTime = sensorsData[0].timeDateObject; // Most recent timestamp
  const sessionStartTime = sensorsData[sensorsData.length - 1].timeDateObject; // Oldest timestamp

  // Create an x-scale to map time values to pixel positions on the x-axis
  const xAxisScale = scaleTime()
    .domain([sessionStartTime, sessionEndTime]) // Set domain to cover the time range of the session
    .range(xAxisRange); // Map the domain to the x-axis pixel range

  // Calculate the time interval needed to generate 5 evenly spaced tick marks on the x-axis
  const totalDuration = sessionEndTime.getTime() - sessionStartTime.getTime(); // Total duration in milliseconds
  const xTickInterval = totalDuration / 4; // Interval to achieve 5 tick marks

  // Generate labels for the x-axis ticks based on time intervals
  const xAxisLabels = Array.from(
    { length: 5 }, // Total number of labels
    (_, i) => new Date(sessionStartTime.getTime() + i * xTickInterval) // Create labels at each interval
  );

  // Calculate the time interval needed to generate 5 evenly spaced tick marks on the x-axis
  const totalValues = maxValue - minValue; // Total duration in milliseconds
  const yTickInterval = totalValues / 5; // Interval to achieve 5 tick marks

  // Generate labels for the x-axis ticks based on time intervals
  const yAxisLabels = Array.from(
    { length: 6 }, // Total number of labels
    (_, i) => (minValue + i * yTickInterval).toFixed(2)
  ); // Create labels at each interval

  // Create a smooth line path for the X-axis acceleration data
  const accelerationXCurve = line<SensorDataType>()
    .x((d) => xAxisScale(d.timeDateObject)) // Map x-coordinate to timestamp
    .y((d) => yAxisScale(d.accelerationData?.x ?? 0)) // Map y-coordinate to X-axis acceleration data
    .curve(curveMonotoneX)(sensorsData); // Apply a smooth curve to the data

  // Create a smooth line path for the Y-axis acceleration data
  const accelerationYCurve = line<SensorDataType>()
    .x((d) => xAxisScale(d.timeDateObject)) // Map x-coordinate to timestamp
    .y((d) => yAxisScale(d.accelerationData?.y ?? 0)) // Map y-coordinate to Y-axis acceleration data
    .curve(curveMonotoneX)(sensorsData); // Apply a smooth curve to the data

  // Create a smooth line path for the Z-axis acceleration data
  const accelerationZCurve = line<SensorDataType>()
    .x((d) => xAxisScale(d.timeDateObject)) // Map x-coordinate to timestamp
    .y((d) => yAxisScale(d.accelerationData?.z ?? 0)) // Map y-coordinate to Z-axis acceleration data
    .curve(curveMonotoneX)(sensorsData); // Apply a smooth curve to the data

  // Return all generated graph components and scales
  return {
    xAxisScale,
    yAxisScale,
    xAxisLabels, // Labels for the x-axis ticks
    yAxisLabels, // Labels for the y-axis ticks
    accelerationXCurve,
    accelerationYCurve,
    accelerationZCurve,
  };
}
