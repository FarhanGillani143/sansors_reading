import { STORAGE_KEYS } from "./StorageKeys";
import { SpeedUnits } from "../../types/DataTypes";
import { retrieveValueAsync } from "../../utils/ManageStorage";

export const retrieveConfigDataAsync = async () => {
  const timeInterval: number | null = await retrieveValueAsync(
    STORAGE_KEYS.SENSOR_TIME_INTERVAL
  );

  const unitOfSpeed: SpeedUnits | null = await retrieveValueAsync(
    STORAGE_KEYS.SPEED_UNIT
  );

  const displayComfortGraph: boolean | null = await retrieveValueAsync(
    STORAGE_KEYS.DISPLAY_COMFORT_GRAPH
  );

  const warningSpeedLimit: number | null = await retrieveValueAsync(
    STORAGE_KEYS.WARNING_SPEED_LIMIT
  );

  const accelerationStart: number | null = await retrieveValueAsync(
    STORAGE_KEYS.ACCELERATION_START_SPEED
  );

  const accelerationEnd: number | null = await retrieveValueAsync(
    STORAGE_KEYS.ACCELERATION_END_SPEED
  );

  return {
    unitOfSpeed,
    timeInterval,
    accelerationEnd,
    accelerationStart,
    warningSpeedLimit,
    displayComfortGraph,
  };
};
