import { SensorDataType } from "../../types/DataTypes";

/**
 * Calculates the mean variance of acceleration data for the X, Y, and Z axes from the provided sensor data.
 *
 * This function computes the average variance of acceleration readings across all three axes
 * (X, Y, Z) by first calculating the mean acceleration for each axis and then determining how much
 * each data point deviates from this mean. The variance for each axis is calculated individually,
 * and the final mean variance is the average of the three axis variances.
 *
 * @param {SensorDataType[]} data - Array of sensor data points, each containing acceleration readings for X, Y, and Z axes.
 *
 * @returns {number} The average variance across the X, Y, and Z axes.
 */
export function calculateMeanVariance(data: SensorDataType[]) {
  const total = data.length;

  // Initialize sums for the X, Y, and Z axes
  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  // Sum up the acceleration data for each axis
  data.forEach((dataPoint) => {
    sumX += dataPoint.accelerationData?.x ?? 0;
    sumY += dataPoint.accelerationData?.y ?? 0;
    sumZ += dataPoint.accelerationData?.z ?? 0;
  });

  // Calculate the mean (average) acceleration for each axis
  const meanX = sumX / total;
  const meanY = sumY / total;
  const meanZ = sumZ / total;

  // Initialize variance sums for the X, Y, and Z axes
  let sumXForVariance = 0;
  let sumYForVariance = 0;
  let sumZForVariance = 0;

  // Compute the variance for each axis by summing the squared deviations from the mean
  data.forEach((dataPoint) => {
    const x = dataPoint.accelerationData?.x ?? 0;
    const y = dataPoint.accelerationData?.y ?? 0;
    const z = dataPoint.accelerationData?.z ?? 0;

    sumXForVariance += Math.pow(x - meanX, 2);
    sumYForVariance += Math.pow(y - meanY, 2);
    sumZForVariance += Math.pow(z - meanZ, 2);
  });

  // Calculate the variance for each axis (dividing by total - 1 to account for sample size)
  const varianceX = sumXForVariance / (total - 1);
  const varianceY = sumYForVariance / (total - 1);
  const varianceZ = sumZForVariance / (total - 1);

  // Compute the mean variance by averaging the variances of the three axes
  const meanVariance = (varianceX + varianceY + varianceZ) / 3;

  return meanVariance;
}
