import { SensorDataType } from "../../types/DataTypes";
import { UpdateMinMaxType } from "../../types/FunctionTypes";

/**
 * Updates the minimum and maximum acceleration values based on the latest sensor reading.
 * 
 * This function compares the latest X, Y, and Z acceleration values with the previous minimum and 
 * maximum values to determine new bounds for graph scaling.
 * 
 * @param {UpdateMinMaxType} params - The parameters required to update the min and max values.
 * @param {number} params.prevMax - The previous maximum acceleration value.
 * @param {number} params.prevMin - The previous minimum acceleration value.
 * @param {SensorDataType} params.latestReading - The latest sensor data containing acceleration values.
 * 
 * @returns {{ newMinValue: number, newMaxValue: number }} - The updated minimum and maximum acceleration values.
 */
export const updateMaxMinValue = ({
  prevMax,
  prevMin,
  latestReading,
}: UpdateMinMaxType) => {
  // Extract the latest X, Y, and Z acceleration values, defaulting to 0 if not available
  const latestXValue = latestReading.accelerationData?.x ?? 0;
  const latestYValue = latestReading.accelerationData?.y ?? 0;
  const latestZValue = latestReading.accelerationData?.z ?? 0;

  // Calculate the new minimum and maximum values by comparing with the previous values
  const newMinValue = Math.min(latestXValue, latestYValue, latestZValue, prevMin);
  const newMaxValue = Math.max(latestXValue, latestYValue, latestZValue, prevMax);

  // Return the updated min and max values
  return {
    newMinValue,
    newMaxValue,
  };
};

/**
 * Calculates the minimum and maximum acceleration values from a set of sensor data.
 * 
 * This function extracts the X, Y, and Z acceleration values from each sensor reading and determines
 * the overall minimum and maximum values for scaling purposes.
 * 
 * @param {SensorDataType[]} sensorsData - An array of sensor data containing acceleration values.
 * 
 * @returns {{ minValue: number, maxValue: number }} - The minimum and maximum acceleration values.
 */
export const getMaxMinValue = (sensorsData: SensorDataType[]) => {
  // Extract the X, Y, and Z acceleration values from the sensor data
  const xValues = sensorsData.map((d) => d.accelerationData?.x ?? 0);
  const yValues = sensorsData.map((d) => d.accelerationData?.y ?? 0);
  const zValues = sensorsData.map((d) => d.accelerationData?.z ?? 0);

  // Combine all the X, Y, and Z values into a single array
  const allValues = [...xValues, ...yValues, ...zValues];

  // Calculate the minimum and maximum values from all acceleration data
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Return the calculated min and max values
  return {
    minValue,
    maxValue,
  };
};
