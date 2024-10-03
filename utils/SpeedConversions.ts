/**
 * Converts meters per second (mps) to kilometers per hour (kph).
 *
 * @param {number} mps - Speed in meters per second.
 * @returns {number} - The equivalent speed in kilometers per hour.
 */
export const mpsToKph = (mps: number): number => mps * 3.6;

/**
 * Converts meters per second (mps) to miles per hour (mph).
 *
 * @param {number} mps - Speed in meters per second.
 * @returns {number} - The equivalent speed in miles per hour.
 */
export const mpsToMph = (mps: number): number => mps * 2.23694;

/**
 * Converts kilometers per hour (kph) to miles per hour (mph).
 *
 * @param {number} kph - Speed in kilometers per hour.
 * @returns {number} - The equivalent speed in miles per hour.
 */
export const kphToMph = (kph: number): number => kph * 0.621371;

/**
 * Converts miles per hour (mph) to kilometers per hour (kph).
 *
 * @param {number} mph - Speed in miles per hour.
 * @returns {number} - The equivalent speed in kilometers per hour.
 */
export const mphToKph = (mph: number): number => mph / 0.621371;
