import { SensorDataType } from "../../types/DataTypes";
import { UpdateMinMaxType } from "../../types/FunctionTypes";

export const updateMaxMinValue = ({
  prevMax,
  prevMin,
  sensorData,
}: UpdateMinMaxType) => {
  // Get the latest X, Y, and Z acceleration values
  const latestXValue = sensorData.accelerationData?.x ?? 0;
  const latestYValue = sensorData.accelerationData?.y ?? 0;
  const latestZValue = sensorData.accelerationData?.z ?? 0;

  // Update the min and max values for graph scaling
  const minValue = Math.min(latestXValue, latestYValue, latestZValue, prevMin);
  const maxValue = Math.max(latestXValue, latestYValue, latestZValue, prevMax);

  return {
    minValue,
    maxValue,
  };
};

export const getMaxMinValue = (sensorsData: SensorDataType[]) => {
  // Extract acceleration values X, Y, and Z from sensor data
  const xValues = sensorsData.map((d) => d.accelerationData?.x ?? 0);
  const yValues = sensorsData.map((d) => d.accelerationData?.y ?? 0);
  const zValues = sensorsData.map((d) => d.accelerationData?.z ?? 0);

  // Determine the minimum and maximum values across all acceleration data
  const allValues = [...xValues, ...yValues, ...zValues];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return {
    minValue,
    maxValue,
  };
};
