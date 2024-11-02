import { createContext } from "react";
import { SpeedUnits } from "../../types/DataTypes";

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
  speedUnit: SpeedUnits;

  /**
   * Boolean flag indicating whether to display a graph.
   */
  displayGraph: boolean;

  /**
   * The speed at which warnings should be triggered.
   * This is an object containing speed and unit.
   */
  warningSpeed: number;

  /**
   * The speed at which acceleration starts.
   * This is an object containing speed and unit.
   */
  accelerationStartSpeed: number;

  /**
   * The speed at which acceleration ends.
   * This is an object containing speed and unit.
   */
  accelerationEndSpeed: number;

  /**
   * Function to update whether the graph should be displayed.
   *
   * @param {boolean} flag - New value to set for displaying the graph.
   */
  updateDisplayGraphAsync(flag: boolean): Promise<void>;

  /**
   * Function to update the warning speed.
   *
   * @param {number} speed - New speed value to set for the warning.
   */
  updateWarningSpeedAsync(speed: number): Promise<void>;

  /**
   * Function to update the start speed for acceleration.
   *
   * @param {number} speed - New start speed for acceleration.
   */
  updateAccelerationStartAsync(speed: number): Promise<void>;

  /**
   * Function to update the end speed for acceleration.
   *
   * @param {number} speed - New end speed for acceleration.
   */
  updateAccelerationEndAsync(speed: number): Promise<void>;

  /**
   * Function to update the speed unit (either 'kph' or 'mph').
   *
   * @param {"kph" | "mph"} unit - The new speed unit.
   */
  updateSpeedUnitAsync(unit: SpeedUnits): Promise<void>;

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
  speedUnit: "KM/H", // Default speed unit is kilometers per hour
  displayGraph: true, // By default, the graph is displayed
  warningSpeed: 100, // Default warning speed is 100 kph
  accelerationStartSpeed: 0, // Acceleration starts at 0 kph by default
  accelerationEndSpeed: 70, // Acceleration ends at 70 kph by default

  // Placeholder function to update the speed unit
  async updateSpeedUnitAsync(unit) {},

  // Placeholder function to update the display graph flag
  async updateDisplayGraphAsync(flag) {},

  // Placeholder function to update the warning speed
  async updateWarningSpeedAsync(speed) {},

  // Placeholder function to update the acceleration end speed
  async updateAccelerationEndAsync(speed) {},

  // Placeholder function to update the acceleration start speed
  async updateAccelerationStartAsync(speed) {},

  // Placeholder async function to update the time interval
  async updateTimeIntervalAsync(interval) {},
});
