import { line, curveBasis, scaleTime, scaleLinear } from "d3";
import { SensorDataType } from "../types/DataTypes";

type GraphValues = {
  sensorsData: SensorDataType[]; // Array of sensor data with time and acceleration values
  yScaleRange: number[]; // The pixel range for the y-axis [min, max]
  xScaleRange: number[]; // The pixel range for the x-axis [min, max]
};

/**
 * Generates an acceleration graph by creating a smooth line chart based on the sensor data.
 * The function configures the x and y scales, sets tick intervals, and creates a curved line
 * representing the acceleration data over time.
 *
 * @param {GraphValues} params - The input values required to make the graph.
 * @param {SensorDataType[]} params.sensorsData - Array of sensor data objects that include time and acceleration data.
 * @param {number[]} params.yScaleRange - Pixel range for the y-axis. Example: [minPixel, maxPixel].
 * @param {number[]} params.xScaleRange - Pixel range for the x-axis. Example: [minPixel, maxPixel].
 *
 * @returns {object | null} - Returns an object containing xLabels, yLabels, xScale, yScale, and the generated curve.
 *                            Returns null if the data array is empty.
 */
export function makeAccelerationGraph({
  sensorsData,
  yScaleRange,
  xScaleRange,
}: GraphValues) {
  // Return early if no data is available
  if (sensorsData.length === 0) return null;

  // Create the y-scale: maps the acceleration data domain [-1.0, 1.0] to the y-axis pixel range
  const y = scaleLinear()
    .domain([-1.0, 1.0]) // The expected range of acceleration values
    .range(yScaleRange); // The pixel range for the y-axis

  // The session start and end times are derived from the data points
  const sessionEndTime = sensorsData[0].timeDateObject; // The most recent timestamp
  const sessionStartTime = sensorsData[sensorsData.length - 1].timeDateObject; // The oldest timestamp

  // Create the x-scale: maps the time domain to the x-axis pixel range
  const x = scaleTime()
    .domain([sessionStartTime, sessionEndTime]) // The time range of the session
    .range(xScaleRange); // The pixel range for the x-axis

  // Calculate the time interval for exactly 5 ticks on the x-axis
  const totalDuration = sessionEndTime.getTime() - sessionStartTime.getTime(); // Total duration of the session
  const tickInterval = totalDuration / 4; // Dividing by 4 to create 5 tick marks

  // Generate 5 evenly spaced tick marks for the x-axis (time labels)
  const xLabels = Array.from(
    { length: 5 }, // Create 5 labels
    (_, i) => new Date(sessionStartTime.getTime() + i * tickInterval) // Calculate each label's time
  );

  // Dynamically generate y-axis labels using d3's ticks function for better scaling
  const yLabels = y.ticks(10); // Generate approximately 10 tick marks for the y-axis

  // Generate a smooth line path using the acceleration data and curveBasis for smoothing
  const curvedLine = line<SensorDataType>()
    .x((d) => x(d.timeDateObject)) // Map the x-coordinate to the timestamp
    .y((d) => y(d.accelerationData?.x ?? 0)) // Map the y-coordinate to the acceleration data (default to 0 if undefined)
    .curve(curveBasis)(sensorsData); // Apply a smooth curve to the line

  // Return the generated xLabels, yLabels, and the scaled values for x and y axes, along with the line curve
  return {
    xLabels, // Array of x-axis labels (time ticks)
    yLabels, // Array of y-axis labels (acceleration ticks)
    xScale: x, // The x-scale (time)
    yScale: y, // The y-scale (acceleration)
    curve: curvedLine, // The generated SVG path for the acceleration graph
  };
}
