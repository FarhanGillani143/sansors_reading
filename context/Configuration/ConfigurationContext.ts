import { createContext } from "react";
import { SpeedDataType } from "../../types/DataTypes";

/**
 * Configuration context type definition.
 * This type defines the structure of the configuration context, including sensor intervals,
 * speed units, display graph settings, and acceleration data, as well as functions to update these properties.
 */
export type ConfigContextType = {
  /**
   * Interval in milliseconds for sensor data retrieval.
   * Default is 200ms.
   */
  sensorTimeInterval: number;

  /**
   * Unit for speed measurement. Can be either 'kph' (Kilometers per hour) or 'mph' (Miles per hour).
   */
  speedUnit: "kph" | "mph";

  /**
   * Boolean flag indicating whether to display a graph.
   */
  displayGraph: boolean;

  /**
   * The speed at which warnings should be triggered.
   * This is an object containing speed and unit.
   */
  warningSpeed: SpeedDataType;

  /**
   * The speed at which acceleration starts.
   * This is an object containing speed and unit.
   */
  accelerationStartSpeed: SpeedDataType;

  /**
   * The speed at which acceleration ends.
   * This is an object containing speed and unit.
   */
  accelerationEndSpeed: SpeedDataType;

  /**
   * Function to update whether the graph should be displayed.
   *
   * @param {boolean} flag - New value to set for displaying the graph.
   */
  updateDisplayGraph(flag: boolean): void;

  /**
   * Function to update the warning speed.
   *
   * @param {number} speed - New speed value to set for the warning.
   */
  updateWarningSpeed(speed: number): void;

  /**
   * Function to update the start speed for acceleration.
   *
   * @param {number} speed - New start speed for acceleration.
   */
  updateAccelerationStartSpeed(speed: number): void;

  /**
   * Function to update the end speed for acceleration.
   *
   * @param {number} speed - New end speed for acceleration.
   */
  updateAccelerationEndSpeed(speed: number): void;

  /**
   * Function to update the speed unit (either 'kph' or 'mph').
   *
   * @param {"kph" | "mph"} unit - The new speed unit.
   */
  updateSpeedUnit(unit: "kph" | "mph"): void;

  /**
   * Function to update the time interval asynchronously.
   *
   * @param {number} interval - The new time interval to be set.
   * @returns {Promise<void>} - A promise that resolves once the time interval is updated.
   */
  updateTimeIntervalAsync: (interval: number) => Promise<void>;
};

/**
 * Default configuration context with initial values for sensor interval, speed unit,
 * display graph settings, and functions that can be overridden when the context is used in the app.
 */
export const ConfigurationContext = createContext<ConfigContextType>({
  sensorTimeInterval: 200, // Default time interval is set to 200ms
  speedUnit: "kph", // Default speed unit is kilometers per hour
  displayGraph: true, // By default, the graph is displayed
  warningSpeed: { speed: 100, unit: "kph" }, // Default warning speed is 100 kph
  accelerationStartSpeed: { speed: 0, unit: "kph" }, // Acceleration starts at 0 kph by default
  accelerationEndSpeed: { speed: 70, unit: "kph" }, // Acceleration ends at 70 kph by default

  // Placeholder function to update the speed unit
  updateSpeedUnit(unit) {},

  // Placeholder function to update the display graph flag
  updateDisplayGraph(flag) {},

  // Placeholder function to update the warning speed
  updateWarningSpeed(speed) {},

  // Placeholder function to update the acceleration end speed
  updateAccelerationEndSpeed(speed) {},

  // Placeholder function to update the acceleration start speed
  updateAccelerationStartSpeed(speed) {},

  // Placeholder async function to update the time interval
  async updateTimeIntervalAsync(interval) {},
});
