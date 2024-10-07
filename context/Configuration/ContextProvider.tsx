import React, { useEffect, useMemo, useState } from "react";

import { STORAGE_KEYS } from "./StorageKeys";
import { SpeedUnits } from "../../types/DataTypes";
import { retrieveConfigDataAsync } from "./RetrieveData";
import { storeValueAsync } from "../../utils/ManageStorage";
import { ConfigurationContext } from "./ConfigurationContext";
import { speedConversion } from "../../utils/SpeedConversions";

interface Props {
  children: JSX.Element | JSX.Element[];
}

/**
 * Provides the configuration context to the entire app.
 * This context contains settings for speed units, sensor intervals, graph display, and acceleration speeds.
 *
 * @param {JSX.Element | JSX.Element[]} children - The components that will consume the context.
 * @returns {JSX.Element} - The provider component that wraps the application.
 */
export default function ConfigurationContextProvider({ children }: Props) {
  const [sensorTimeInterval, setSensorTimeInterval] = useState(200); // Default sensor interval set to 200ms
  const [speedUnit, setSpeedUnit] = useState<SpeedUnits>("KM/H"); // Default speed unit set to 'kph'
  const [displayGraph, setDisplayGraph] = useState<boolean>(true); // By default, the graph is displayed
  const [warningSpeed, setWarningSpeed] = useState<number>(100); // Default warning speed is 100 kph
  const [accelerationEndSpeed, setAccelerationEndSpeed] = useState<number>(70); // Default acceleration end speed
  const [accelerationStartSpeed, setAccelerationStartSpeed] =
    useState<number>(0); // Default acceleration start speed

  /**
   * Updates the time interval for sensor data collection and stores it locally.
   */
  const updateTimeIntervalAsync = async (interval: number) => {
    setSensorTimeInterval(interval); // Update the interval state
    await storeValueAsync({
      key: STORAGE_KEYS.SENSOR_TIME_INTERVAL,
      value: interval,
    }); // Persist the interval setting
  };

  /**
   * Updates the graph display setting and stores it locally.
   */
  const updateDisplayGraphAsync = async (flag: boolean) => {
    setDisplayGraph(flag);
    await storeValueAsync({
      key: STORAGE_KEYS.DISPLAY_COMFORT_GRAPH,
      value: flag,
    });
  };

  /**
   * Updates the warning speed limit and stores it locally.
   */
  const updateWarningSpeedAsync = async (speed: number) => {
    setWarningSpeed(speed);
    await storeValueAsync({
      key: STORAGE_KEYS.WARNING_SPEED_LIMIT,
      value: speed,
    });
  };

  /**
   * Updates the acceleration start speed and stores it locally.
   */
  const updateAccelerationStartAsync = async (speed: number) => {
    setAccelerationStartSpeed(speed);
    await storeValueAsync({
      key: STORAGE_KEYS.ACCELERATION_START_SPEED,
      value: speed,
    });
  };

  /**
   * Updates the acceleration end speed and stores it locally.
   */
  const updateAccelerationEndAsync = async (speed: number) => {
    setAccelerationEndSpeed(speed);
    await storeValueAsync({
      key: STORAGE_KEYS.ACCELERATION_END_SPEED,
      value: speed,
    });
  };

  /**
   * Updates the speed unit (kph or mph) and stores it locally.
   */
  const updateSpeedUnitAsync = async (unit: SpeedUnits) => {
    const warningSpeedValue = speedConversion({
      newUnit: unit,
      previousUnit: speedUnit,
      speed: warningSpeed,
    });

    const accelerationStartValue = speedConversion({
      newUnit: unit,
      previousUnit: speedUnit,
      speed: accelerationStartSpeed,
    });

    const accelerationEndValue = speedConversion({
      newUnit: unit,
      previousUnit: speedUnit,
      speed: accelerationEndSpeed,
    });

    setSpeedUnit(unit);
    await updateWarningSpeedAsync(warningSpeedValue);
    await updateAccelerationEndAsync(accelerationEndValue);
    await updateAccelerationStartAsync(accelerationStartValue);
    await storeValueAsync({
      key: STORAGE_KEYS.SPEED_UNIT,
      value: unit,
    });
  };

  // Fetch stored configuration values when the component is mounted
  useEffect(() => {
    (async () => {
      const {
        unitOfSpeed,
        timeInterval,
        accelerationEnd,
        accelerationStart,
        warningSpeedLimit,
        displayComfortGraph,
      } = await retrieveConfigDataAsync();
      if (unitOfSpeed) setSpeedUnit(unitOfSpeed);
      if (timeInterval) setSensorTimeInterval(sensorTimeInterval);
      if (warningSpeedLimit) setWarningSpeed(warningSpeedLimit);
      if (displayComfortGraph) setDisplayGraph(displayComfortGraph);
      if (accelerationEnd) setAccelerationEndSpeed(accelerationEnd);
      if (accelerationStart) setAccelerationStartSpeed(accelerationStart);
    })();
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      speedUnit,
      warningSpeed,
      displayGraph,
      sensorTimeInterval,
      accelerationEndSpeed,
      accelerationStartSpeed,
      updateSpeedUnitAsync,
      updateDisplayGraphAsync,
      updateWarningSpeedAsync,
      updateTimeIntervalAsync,
      updateAccelerationEndAsync,
      updateAccelerationStartAsync,
    }),
    [
      speedUnit,
      warningSpeed,
      displayGraph,
      sensorTimeInterval,
      accelerationEndSpeed,
      accelerationStartSpeed,
    ]
  );

  // Providing the configuration context to the children
  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
}
