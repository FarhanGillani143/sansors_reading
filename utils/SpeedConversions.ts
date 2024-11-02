import { SpeedConversionType } from "../types/FunctionTypes";

/**
 * Converts meters per second (mps) to kilometers per hour (kph).
 *
 * @param {number} mps - Speed in meters per second.
 * @returns {number} - The equivalent speed in kilometers per hour.
 */
export const convertMpsToKph = (mps: number): number => {
  const speed = mps * 3.6;
  return Number(speed.toFixed(0));
};

/**
 * Converts meters per second (mps) to miles per hour (mph).
 *
 * @param {number} mps - Speed in meters per second.
 * @returns {number} - The equivalent speed in miles per hour.
 */
export const convertMpsToMph = (mps: number): number => {
  const speed = mps * 2.23694;
  return Number(speed.toFixed(0));
};

/**
 * Converts kilometers per hour (kph) to miles per hour (mph).
 *
 * @param {number} kph - Speed in kilometers per hour.
 * @returns {number} - The equivalent speed in miles per hour.
 */
export const convertKphToMph = (kph: number): number => {
  const speed = kph * 0.621371;
  return Number(speed.toFixed(0));
};

/**
 * Converts miles per hour (mph) to kilometers per hour (kph).
 *
 * @param {number} mph - Speed in miles per hour.
 * @returns {number} - The equivalent speed in kilometers per hour.
 */
export const convertMphToKph = (mph: number): number => {
  const speed = mph / 0.621371;
  return Number(speed.toFixed(0));
};

/**
 * Converts the raw speed data (in meters per second) to the appropriate unit (KM/H or Miles/H)
 */
export const speedConversion = ({
  speed,
  newUnit,
  previousUnit,
}: SpeedConversionType): number => {
  if (speed === null || speed === -1 || speed === 0) return 0;

  if (previousUnit === newUnit) {
    return speed; // No conversion needed
  }

  // Handle conversions when current unit is not mps
  if (previousUnit !== "mps") {
    return previousUnit === "KM/H"
      ? convertKphToMph(speed)
      : convertMphToKph(speed);
  }

  // Handle conversions from mps
  if (previousUnit === "mps") {
    return newUnit === "KM/H" ? convertMpsToKph(speed) : convertMpsToMph(speed);
  }

  return speed; // Fallback, if no conditions matched
};
