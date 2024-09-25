import { scaleTime } from "d3";
import { X_AXIS_RANGE } from "../../app/graphs/Acceleration/Contants";

/**
 * Generates x-axis scale and tick data for a graph based on time values.
 *
 * This function calculates a time scale for the x-axis using the given start and end times.
 * It also creates evenly spaced tick labels for the x-axis, mapping them to their corresponding
 * pixel positions on the graph.
 *
 * @param {Date} startTime - The starting time for the x-axis.
 * @param {Date} endTime - The ending time for the x-axis.
 * @returns {{
 *  xAxisScale: (date: Date) => number, // Function to map time values to x-axis pixel positions.
 *  xAxisData: { label: Date, scaledLabel: number }[] // Array of x-axis tick labels and their pixel positions.
 * }} - Returns an object containing the x-axis scale function and an array of x-axis tick data.
 */
export const getXAxisData = (startTime: Date, endTime: Date) => {
  // Create the x-axis time scale to map timestamps to pixel positions on the x-axis.
  const xAxisScale = scaleTime()
    .domain([startTime, endTime]) // Set the time range as the domain of the x-axis.
    .range(X_AXIS_RANGE); // Map the domain to the pixel width of the x-axis.

  // Calculate the total duration of the time range in milliseconds.
  const totalDuration = endTime.getTime() - startTime.getTime(); // Difference in milliseconds.

  // Divide the total duration into 4 intervals to generate 5 evenly spaced ticks.
  const xTickInterval = totalDuration / 4;

  // Generate x-axis tick labels and their corresponding scaled pixel positions.
  const xAxisData = Array.from(
    { length: 5 }, // Create 5 tick labels.
    (_, i) => {
      const label = new Date(startTime.getTime() + i * xTickInterval); // Create a label for each tick.
      const scaledLabel = xAxisScale(label); // Scale the label to its x-axis pixel position.
      return {
        label, // Time label.
        scaledLabel, // Scaled position on the x-axis in pixels.
      };
    }
  );

  return {
    xAxisScale, // Function to map time values to x-axis pixel positions.
    xAxisData, // Array of tick labels and corresponding pixel positions.
  };
};
