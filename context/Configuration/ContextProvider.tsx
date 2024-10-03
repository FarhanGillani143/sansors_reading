import React, { useEffect, useMemo, useState } from "react";
import { SpeedDataType } from "../../types/DataTypes";
import { ConfigurationContext } from "./ConfigurationContext";
import { retrieveValueAsync, storeValueAsync } from "../../utils/ManageStorage";

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
  // State variables for configuration settings
  const [sensorTimeInterval, setSensorTimeInterval] = useState(200); // Default sensor interval set to 200ms
  const [speedUnit, setSpeedUnit] = useState<"kph" | "mph">("kph"); // Default speed unit set to 'kph'
  const [displayGraph, setDisplayGraph] = useState<boolean>(true); // By default, the graph is displayed
  const [warningSpeed, setWarningSpeed] = useState<SpeedDataType>({
    speed: 100,
    unit: "kph",
  }); // Default warning speed is 100 kph
  const [accelerationStartSpeed, setAccelerationStartSpeed] =
    useState<SpeedDataType>({ speed: 0, unit: "kph" }); // Default acceleration start speed
  const [accelerationEndSpeed, setAccelerationEndSpeed] =
    useState<SpeedDataType>({ speed: 70, unit: "kph" }); // Default acceleration end speed

  /**
   * Updates the time interval for sensor data collection and stores it locally.
   */
  const updateTimeIntervalAsync = async (interval: number) => {
    setSensorTimeInterval(interval); // Update the interval state
    await storeValueAsync({
      key: "sensorTimeInterval",
      value: interval,
    }); // Persist the interval setting
  };

  /**
   * Updates the speed unit (kph or mph) and stores it locally.
   */
  const updateSpeedUnit = async (unit: "kph" | "mph") => {
    setSpeedUnit(unit);
    await storeValueAsync({
      key: "speedUnit",
      value: unit,
    });
  };

  /**
   * Updates the graph display setting and stores it locally.
   */
  const updateDisplayGraph = async (flag: boolean) => {
    setDisplayGraph(flag);
    await storeValueAsync({
      key: "displayComfortGraph",
      value: flag,
    });
  };

  /**
   * Updates the warning speed limit and stores it locally.
   */
  const updateWarningSpeed = async (speed: number) => {
    const speedData = { speed, unit: speedUnit };
    setWarningSpeed(speedData);
    await storeValueAsync({
      key: "warningSpeedLimit",
      value: speedData,
    });
  };

  /**
   * Updates the acceleration start speed and stores it locally.
   */
  const updateAccelerationStartSpeed = async (speed: number) => {
    const speedData = { speed, unit: speedUnit };
    setAccelerationStartSpeed(speedData);
    await storeValueAsync({
      key: "accelerationStartSpeed",
      value: speedData,
    });
  };

  /**
   * Updates the acceleration end speed and stores it locally.
   */
  const updateAccelerationEndSpeed = async (speed: number) => {
    const speedData = { speed, unit: speedUnit };
    setAccelerationEndSpeed(speedData);
    await storeValueAsync({
      key: "accelerationEndSpeed",
      value: speedData,
    });
  };

  // Fetch stored configuration values when the component is mounted
  useEffect(() => {
    (async () => {
      const timeInterval: number = await retrieveValueAsync(
        "sensorTimeInterval"
      );
      if (timeInterval) setSensorTimeInterval(timeInterval);

      const unitOfSpeed: "kph" | "mph" = await retrieveValueAsync("speedUnit");
      if (unitOfSpeed) setSpeedUnit(unitOfSpeed);

      const displayComfortGraph: boolean = await retrieveValueAsync(
        "displayComfortGraph"
      );
      setDisplayGraph(displayComfortGraph);

      const warningSpeedLimit: SpeedDataType = await retrieveValueAsync(
        "warningSpeedLimit"
      );
      if (warningSpeedLimit) setWarningSpeed(warningSpeedLimit);

      const accelerationStartSpeedValue: SpeedDataType =
        await retrieveValueAsync("accelerationStartSpeed");
      if (accelerationStartSpeedValue)
        setAccelerationEndSpeed(accelerationStartSpeedValue);

      const accelerationEndSpeedValue: SpeedDataType = await retrieveValueAsync(
        "accelerationEndSpeed"
      );
      if (accelerationEndSpeedValue)
        setAccelerationEndSpeed(accelerationEndSpeedValue);
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
      updateSpeedUnit,
      updateDisplayGraph,
      updateWarningSpeed,
      updateTimeIntervalAsync,
      updateAccelerationEndSpeed,
      updateAccelerationStartSpeed,
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
