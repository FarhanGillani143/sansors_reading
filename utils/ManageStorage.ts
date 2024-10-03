import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { convertArrayToCSV } from "./ArrayToCSV";
import { StoreSessionData } from "../types/FunctionTypes";

type StoreValueType = {
  value: any; // The value to be stored (could be any type).
  key: string; // The unique key to associate with the stored value.
};

/**
 * Stores a value asynchronously in the local filesystem using the provided key.
 *
 * @param {StoreValueType} params - An object containing the value to store and the associated key.
 * @param {any} params.value - The value to be stored. It can be of any type.
 * @param {string} params.key - The key used to associate the stored value.
 * @returns {Promise<void>} - A promise that resolves once the value is stored.
 */
export const storeValueAsync = async ({ value, key }: StoreValueType) => {
  const uriPath = FileSystem.documentDirectory + `${key}`; // Defines the storage path using the key
  try {
    await FileSystem.writeAsStringAsync(uriPath, JSON.stringify(value)); // Convert the value to a string and store it
  } catch (error: any) {
    Alert.alert("Error while saving value!", error.message); // Show an error alert if the operation fails
  }
};

/**
 * Retrieves a value asynchronously from the local filesystem using the provided key.
 *
 * @param {string} key - The unique key associated with the stored value.
 * @returns {Promise<any | boolean>} - A promise that resolves with the stored value, or `false` if an error occurs.
 */
export const retrieveValueAsync = async (key: string) => {
  const uriPath = FileSystem.documentDirectory + `${key}`; // Defines the path from which to retrieve the value
  try {
    const fileContent = await FileSystem.readAsStringAsync(uriPath); // Read the content from the file
    return JSON.parse(fileContent); // Parse the stored value and return it
  } catch (error) {
    return false; // Return `false` if the file can't be read (e.g., file doesn't exist)
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
