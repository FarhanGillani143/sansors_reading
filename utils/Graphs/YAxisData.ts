import { scaleLinear } from "d3";
import { Y_AXIS_RANGE } from "../../app/graphs/Acceleration/Contants";

/**
 * Generates y-axis scale and data for a graph based on acceleration values.
 *
 * This function calculates a linear scale for the y-axis using the given minimum
 * and maximum acceleration values. It then creates evenly spaced tick labels for
 * the y-axis, mapping them to their corresponding pixel positions on the graph.
 *
 * @param {number} minValue - The minimum acceleration value to display on the y-axis.
 * @param {number} maxValue - The maximum acceleration value to display on the y-axis.
 * @returns {{
 *  yAxisScale: (value: number) => number, // Function to map acceleration values to y-axis pixel positions.
 *  yAxisData: { label: string, scaledLabel: number }[] // Array of y-axis tick labels and their pixel positions.
 * }} - Returns an object containing the y-axis scale function and an array of y-axis data.
 */
export const getYAxisData = (minValue: number, maxValue: number) => {
  // Define a linear scale to map acceleration values (domain) to the graph's y-axis pixel range.
  const yAxisScale = scaleLinear()
    .domain([minValue, maxValue]) // Set the domain to represent the range of acceleration values.
    .range(Y_AXIS_RANGE) // Map the domain values to the corresponding pixel height on the y-axis.
    .clamp(true); // Ensure values stay within the y-axis bounds (prevents overshooting).

  // Calculate the total range of acceleration values for the y-axis.
  const totalValues = maxValue - minValue; // Difference between the max and min values.

  // Divide the total range into 5 equal intervals to create 6 evenly spaced ticks.
  const yTickInterval = totalValues / 5;

  // Generate y-axis tick labels and their corresponding scaled pixel positions.
  const yAxisData = Array.from(
    { length: 6 }, // Create 6 ticks, including the min and max.
    (_, i) => {
      const label = (minValue + i * yTickInterval).toFixed(2); // Generate a label for each tick, rounded to 2 decimal places.
      const scaledLabel = yAxisScale(Number(label)); // Scale the label to its y-axis pixel position.
      return { label, scaledLabel }; // Return the label and its pixel position.
    }
  );

  return {
    yAxisScale, // The scale function for mapping values to y-axis pixels.
    yAxisData, // Array of y-axis labels and corresponding pixel positions.
  };
};
