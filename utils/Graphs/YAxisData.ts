import { scaleLinear } from "d3";
import { Y_AXIS_RANGE } from "../../app/graphs/Acceleration/Contants";

/**
 * Generates y-axis scaling and tick data for a graph, based on acceleration values.
 * This creates a linear scale for the y-axis and evenly spaced tick labels,
 * mapping the acceleration values to their corresponding pixel positions on the graph.
 *
 * @param {number} minValue - The minimum value to display on the y-axis.
 * @param {number} maxValue - The maximum value to display on the y-axis.
 * @param {number} numOfTicks - Number of ticks to display on the y-axis.
 *
 * @returns {{
 *  yAxisScale: (value: number) => number, // A function that maps values to y-axis pixel positions.
 *  yAxisData: { label: string, scaledLabel: number }[] // Array of y-axis tick labels and their pixel positions.
 * }} - An object containing the y-axis scaling function and an array of tick label data.
 */
export const getYAxisData = (
  minValue: number,
  maxValue: number,
  numOfTicks: number
) => {
  // Create a linear scale to map acceleration values (domain) to pixel positions (range) on the y-axis.
  const yAxisScale = scaleLinear()
    .domain([minValue, maxValue]) // Define the input domain for the y-axis (acceleration values).
    .range(Y_AXIS_RANGE) // Map these values to the pixel range for the graph's y-axis.
    .clamp(true); // Keep the scaled values within the y-axis bounds (prevents overshooting).

  // Calculate the total range of values between the minimum and maximum.
  const totalValues = maxValue - minValue;

  // Determine the interval between each y-axis tick (dividing the range into `numOfTicks - 1` intervals).
  const yTickInterval = totalValues / (numOfTicks - 1);

  // Generate an array of y-axis labels and their corresponding pixel positions.
  const yAxisData = Array.from(
    { length: numOfTicks }, // Create the specified number of ticks.
    (_, i) => {
      const label = (minValue + i * yTickInterval).toFixed(3); // Round tick labels to 2 or 3 decimal places depending on the number of ticks.
      const scaledLabel = yAxisScale(Number(label)); // Scale the tick label to its corresponding y-axis pixel position.
      return { label, scaledLabel }; // Return an object with the label and its scaled position.
    }
  );

  return {
    yAxisScale, // Function to map values to y-axis pixel positions.
    yAxisData, // Array of y-axis tick labels and their corresponding pixel positions.
  };
};
