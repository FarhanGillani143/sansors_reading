import { line, curveMonotoneX } from "d3";
import { getXAxisData } from "./XAxisData";
import { getYAxisData } from "./YAxisData";
import { VarianceDataType } from "../../types/DataTypes";

type GraphLineParameters = {
  minValue: number;
  maxValue: number;
  varianceData: VarianceDataType[];
};

/**
 * Generates the required data to plot a variance curve on a graph, including 
 * x-axis (time) and y-axis (variance) labels, and the SVG path representing 
 * the variance curve based on the provided data.
 *
 * This function computes the necessary scales for both axes, generates tick labels,
 * and creates a smooth line (SVG path) representing the variance of acceleration over time.
 *
 * @param {GraphLineParameters} params - Parameters for generating the variance curve graph.
 * @param {number} params.minValue - Minimum variance value for scaling the y-axis.
 * @param {number} params.maxValue - Maximum variance value for scaling the y-axis.
 * @param {VarianceDataType[]} params.varianceData - Array of variance data points, each with a timestamp and variance value.
 *
 * @returns {{
 *   xAxisData: object[],
 *   yAxisData: object[],
 *   curve: string | null
 * }} Object containing:
 * - `xAxisData`: Tick labels and scaling information for the x-axis (time).
 * - `yAxisData`: Tick labels and scaling information for the y-axis (variance).
 * - `curve`: SVG path data for rendering the variance curve. Returns `null` if no data.
 */
export function generateVarianceCurve({
  minValue,
  maxValue,
  varianceData,
}: GraphLineParameters) {
  // Determine the time range for the x-axis using the first and last data points
  const startTime = varianceData[0].timestamp; // Timestamp of the first data point
  const endTime = varianceData[varianceData.length - 1].timestamp; // Timestamp of the last data point

  // Generate x-axis scale and tick labels based on the time range
  const { xAxisScale, xAxisData } = getXAxisData(startTime, endTime);

  const numOfTicks = 5;

  // Generate y-axis scale and tick labels based on the variance range (minValue to maxValue)
  const { yAxisScale, yAxisData } = getYAxisData(
    minValue,
    maxValue,
    numOfTicks
  );

  // Create an SVG path for the variance curve with a smooth line (monotone curve)
  const curve = line<VarianceDataType>()
    .x((d) => xAxisScale(d.timestamp)) // Map x-axis values to time
    .y((d) => yAxisScale(d.variance)) // Map y-axis values to variance
    .curve(curveMonotoneX)(varianceData); // Use monotone interpolation for smoothness

  // Return the generated data for the graph, including axis labels and the curve path
  return {
    xAxisData, // Data and labels for the x-axis (time)
    yAxisData, // Data and labels for the y-axis (variance)
    curve, // SVG path data for rendering the variance curve
  };
}
