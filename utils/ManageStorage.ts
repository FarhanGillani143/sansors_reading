import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";

// Define the file path for storing the sensor time interval in the app's document directory.
const fileUri = FileSystem.documentDirectory + "sensorTimeInterval";

/**
 * Asynchronously stores the sensor time interval in a file.
 * The interval is stored as a JSON string.
 *
 * @param {number} interval - The time interval to be stored.
 */
export const storeTimeIntervalAsync = async (interval: number) => {
  try {
    // Convert the interval to a JSON string and save it to the specified file.
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(interval));
  } catch (error: any) {
    Alert.alert("Error saving new time interval", error.message);
  }
};

/**
 * Asynchronously retrieves the sensor time interval from the file.
 * The interval is parsed from a JSON string and returned as a number.
 *
 * @returns {Promise<number | false>} - The retrieved time interval or `false` if an error occurs.
 */
export const retrieveTimeIntervalAsync = async (): Promise<number | false> => {
  try {
    // Read the content of the file and parse it as a number.
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    return Number(JSON.parse(fileContent));
  } catch (error) {
    // Return `false` if any error occurs during the file read operation.
    return false;
  }
};
