import { line, curveMonotoneX, ScaleLinear, ScaleTime } from "d3";
import { getXAxisData } from "./XAxisData";
import { getYAxisData } from "./YAxisData";
import { CurvesType, SensorDataType } from "../../types/DataTypes";
import {
  X_ACCELERATION_COLOR,
  Y_ACCELERATION_COLOR,
  Z_ACCELERATION_COLOR,
} from "../../app/graphs/Acceleration/Contants";

type GraphLineParameters = {
  minValue: number;
  maxValue: number;
  sensorsData: SensorDataType[]; // Array containing time and acceleration values from the sensor.
};

type GenerateCurve = {
  sensorsData: SensorDataType[];
  xAxisScale: ScaleTime<number, number, never>;
  yAxisScale: ScaleLinear<number, number, never>;
};

type AccelerationKey = keyof NonNullable<SensorDataType["accelerationData"]>;

// Define the color mappings for X, Y, and Z acceleration curves
const acceleration = [
  { curve: "x", color: X_ACCELERATION_COLOR },
  { curve: "y", color: Y_ACCELERATION_COLOR },
  { curve: "z", color: Z_ACCELERATION_COLOR },
];

/**
 * Generates the SVG path data for plotting acceleration curves (X, Y, Z) over time.
 *
 * The function creates individual curves for each axis (X, Y, Z) based on the provided sensor data
 * and maps it to the scaled x and y coordinates for rendering.
 *
 * @param {GenerateCurve} params - Parameters for generating the curves.
 * @param {SensorDataType[]} params.sensorsData - Array containing sensor data with timestamps and acceleration values.
 * @param {ScaleTime<number, number, never>} params.xAxisScale - The scale for mapping time data to x-coordinates.
 * @param {ScaleLinear<number, number, never>} params.yAxisScale - The scale for mapping acceleration values to y-coordinates.
 *
 * @returns {CurvesType} - Array of SVG path data for X, Y, and Z acceleration curves, each with its respective color.
 */
const generateCurves = ({
  xAxisScale,
  yAxisScale,
  sensorsData,
}: GenerateCurve) => {
  // Map each timestamp to a scaled x-coordinate
  const scaledX = (d: SensorDataType) => xAxisScale(d.timeDateObject);

  // Initialize an array to hold the generated curves for X, Y, and Z axes
  const accelerationCurves: CurvesType = [];

  // Generate and push the path data for each acceleration curve (X, Y, Z)
  acceleration.map((value) => {
    const curve = line<SensorDataType>()
      .x(scaledX)
      .y((d) =>
        yAxisScale(d.accelerationData?.[value.curve as AccelerationKey] ?? 0)
      ) // Default to 0 if acceleration data is missing
      .curve(curveMonotoneX)(sensorsData); // Use a smooth curve for continuous data

    // Push the generated curve path and its color to the array
    accelerationCurves.push({
      curve: curve,
      color: value.color,
    });
  });

  return accelerationCurves;
};

/**
 * Generates the graph data required to plot X, Y, and Z acceleration values over time.
 *
 * This includes:
 * - x and y axis scales for time and acceleration.
 * - Tick labels for both axes.
 * - SVG path data for the X, Y, and Z acceleration curves.
 *
 * @param {GraphLineParameters} params - Parameters required for graph generation.
 * @param {number} params.minValue - The minimum acceleration value for scaling the y-axis.
 * @param {number} params.maxValue - The maximum acceleration value for scaling the y-axis.
 * @param {SensorDataType[]} params.sensorsData - Array containing time and acceleration values from the sensor.
 *
 * @returns {{
 *   xAxisData: object[],
 *   yAxisData: object[],
 *   accelerationCurves: CurvesType
 * }} An object containing x and y axis tick labels, and the SVG paths for the X, Y, and Z acceleration curves.
 */
export function generateAccelerationCurves({
  minValue,
  maxValue,
  sensorsData,
}: GraphLineParameters) {
  // The start and end times of the data for the x-axis range
  const endTime = sensorsData[0].timeDateObject; // Most recent timestamp
  const startTime = sensorsData[sensorsData.length - 1].timeDateObject; // Earliest timestamp

  // Get the x-axis scale and labels based on the time range
  const { xAxisScale, xAxisData } = getXAxisData(startTime, endTime);

  // Get the y-axis scale and labels based on the acceleration range
  const { yAxisScale, yAxisData } = getYAxisData(minValue, maxValue);

  // Generate the acceleration curves for X, Y, and Z axes
  const accelerationCurves = generateCurves({
    yAxisScale,
    xAxisScale,
    sensorsData,
  });

  // Return the x and y axis data along with the generated curves for rendering the graph
  return {
    xAxisData, // Labels for the x-axis (time)
    yAxisData, // Labels for the y-axis (acceleration)
    accelerationCurves, // SVG paths for X, Y, and Z acceleration curves
  };
}
