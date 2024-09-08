import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { convertArrayToCSV } from "./ArrayToCSV";
import { StoreSessionData } from "../types/FunctionTypes";

// Define the file path for storing the sensor time interval in the app's document directory.
const sensorTimeIntervalUri =
  FileSystem.documentDirectory + "sensorTimeInterval";

/**
 * Asynchronously stores the sensor time interval in a file.
 * The interval is stored as a JSON string in the app's document directory.
 *
 * @param {number} interval - The time interval (in milliseconds) to be stored.
 */
export const storeTimeIntervalAsync = async (interval: number) => {
  try {
    await FileSystem.writeAsStringAsync(
      sensorTimeIntervalUri,
      JSON.stringify(interval)
    );
  } catch (error: any) {
    Alert.alert("Error Saving New Time Interval", error.message);
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
    const fileContent = await FileSystem.readAsStringAsync(
      sensorTimeIntervalUri
    );
    return Number(JSON.parse(fileContent));
  } catch (error) {
    return false;
  }
};

/**
 * Asynchronously stores the list of session names in a file.
 * The session names are stored as a JSON string in the app's document directory.
 *
 * @param {string[]} sessionNames - The array of session names to be stored.
 * @returns {Promise<boolean>} - Returns `true` if storage is successful, otherwise `false`.
 */
export const storeSessionNames = async (
  sessionNames: string[]
): Promise<boolean> => {
  const sessionNamesUri = FileSystem.documentDirectory + "sessionNames";
  try {
    await FileSystem.writeAsStringAsync(
      sessionNamesUri,
      JSON.stringify(sessionNames)
    );
    return true;
  } catch (error: any) {
    Alert.alert("Error Storing Session Names", error.message);
    return false;
  }
};

/**
 * Asynchronously retrieves the list of session names from the file.
 *
 * @returns {Promise<string[] | false>} - The array of session names or `false` if an error occurs.
 */
export const retrieveSessionNames = async (): Promise<string[] | false> => {
  const sessionNamesUri = FileSystem.documentDirectory + "sessionNames";
  try {
    const fileContent = await FileSystem.readAsStringAsync(sessionNamesUri);
    return JSON.parse(fileContent) as string[];
  } catch (error: any) {
    return false;
  }
};

/**
 * Sanitizes a filename by replacing disallowed characters with a hyphen (-).
 * It further refines the filename to make it more human-readable by replacing
 * consecutive hyphens with a comma and adjusting the output for easier recognition.
 *
 * This sanitization is necessary as certain special characters are not allowed
 * in file names or file paths across different operating systems.
 *
 * @param {string} filename - The original filename that needs to be sanitized.
 * @returns {string} - The sanitized and human-readable filename.
 */
function sanitizeFilename(filename: string): string {
  // Replace invalid characters with a hyphen
  let sanitizedName = filename.replace(/[/\\?%*:,|"<> ]/g, "-");

  // Replace consecutive hyphens ("--") with a comma (",") for readability
  sanitizedName = sanitizedName.replaceAll(/--/g, ",");

  // Replace any remaining occurrences of ",-" with "__" to clean up the result
  return sanitizedName.replace(/,-/g, "__");
}

/**
 * Asynchronously stores session data as a CSV file in the app's document directory.
 * The session data is converted to CSV format before storage.
 *
 * @param {StoreSessionData} session - The session data to be stored, including the session name and sensor data.
 * @returns {Promise<boolean>} - Returns `true` if storage is successful, otherwise `false`.
 */
export const storeSessionData = async (
  session: StoreSessionData
): Promise<boolean> => {
  const fileName = sanitizeFilename(session.sessionName);
  const sessionDataUri = FileSystem.documentDirectory + fileName + ".csv"; // Adding .csv because we're storing file in CSV format

  const csvString = convertArrayToCSV(session.sensorsData);
  try {
    await FileSystem.writeAsStringAsync(sessionDataUri, csvString);
    return true;
  } catch (error: any) {
    Alert.alert("Error Storing Session Data", error.message);
    return false;
  }
};

/**
 * Asynchronously retrieves and shares session data as a CSV file.
 * If sharing is available on the device, the CSV file is shared using the platform's sharing options.
 *
 * @param {string} sessionName - The name of the session to be retrieved and shared.
 */
export const retrieveSessionData = async (sessionName: string) => {
  const fileName = sanitizeFilename(sessionName);
  const sessionDataUri = FileSystem.documentDirectory + fileName + ".csv"; // Adding .csv because the stored file is in CSV format

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(sessionDataUri, {
        mimeType: "text/csv", // Android-specific
        dialogTitle: "Share CSV File", // Android-specific
        UTI: "public.comma-separated-values-text", // iOS-specific
      });
    } else {
      Alert.alert("Sharing is Not Available on This Device");
    }
  } catch (error: any) {
    Alert.alert("Error Reading Session Data", error.message);
  }
};
