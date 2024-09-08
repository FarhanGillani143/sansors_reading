import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { SensorDataType } from "../types/DataTypes";

/**
 * Converts an array of sensor measurement objects into a CSV-formatted string.
 *
 * @param {SensorDataType[]} arr - An array of sensor measurement objects to be converted into CSV format.
 *
 * @returns {string} - A CSV-formatted string containing the headers and the sensor data.
 *
 * This function formats the data with the headers: "Timestamp", "X", "Y", "Z", "Altitude", "Altitude Accuracy",
 * "Heading", "Accuracy", "Latitude", "Longitude", and "Speed". It constructs CSV rows from the input data,
 * which includes both accelerometer and location data. The headers are included in the first row, followed by
 * the formatted data rows.
 */
export function convertArrayToCSV(arr: SensorDataType[]) {
  const headers = [
    "Timestamp",
    "X (gs where 1g = 9.81 m/s^2)",
    "Y (gs where 1g = 9.81 m/s^2)",
    "Z (gs where 1g = 9.81 m/s^2)",
    "Altitude (m)",
    "Altitude Accuracy (m)",
    "Heading (° from north)",
    "Accuracy (m)",
    "Latitude (°)",
    "Longitude (°)",
    "Speed (km/h)",
  ];

  const rows = arr.map(
    (obj: SensorDataType) =>
      `"${obj.timestamp}",${obj.accelerationData?.x},${obj.accelerationData?.y},${obj.accelerationData?.z},${obj.locationData?.altitude},${obj.locationData?.altitudeAccuracy},${obj.locationData?.heading},${obj.locationData?.accuracy},${obj.locationData?.latitude},${obj.locationData?.longitude},${obj.locationData?.speed}`
  );

  return [headers.join(","), ...rows].join("\n");
}

type Arguments = {
  arr: SensorDataType[];
  fileName?: string;
};

/**
 * Converts sensor measurement data to a CSV file, saves it, and provides an option to share it.
 *
 * @param {Arguments} params - An object containing the following properties:
 *   @param {SensorDataType[]} params.arr - An array of sensor measurement objects to be converted into CSV format.
 *   @param {string} [params.fileName] - An optional file name for the CSV file. Defaults to "Data" if not provided.
 *
 * @returns {Promise<void>} - A promise that resolves when the file is successfully written and sharing options are handled.
 *
 * The function uses `convertArrayToCSV` to generate a CSV-formatted string from the provided data. It then saves
 * this CSV string to a file with the specified or default file name in the document directory. If sharing is
 * available on the device, the function allows the user to share the CSV file. After sharing, the file is deleted.
 * If sharing is not available or if an error occurs during file operations, appropriate alerts are shown to the user.
 * If no data is found to convert, an alert is displayed.
 */
export async function downloadCSV({ arr, fileName }: Arguments) {
  const csvString = convertArrayToCSV(arr);
  const filePath = `${FileSystem.documentDirectory}${fileName || "Data"}.csv`;

  if (csvString) {
    try {
      await FileSystem.writeAsStringAsync(filePath, csvString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "text/csv",
          dialogTitle: "Share CSV File",
          UTI: "public.comma-separated-values-text",
        });
        await FileSystem.deleteAsync(filePath);
      } else {
        Alert.alert("Sharing is not available on this device");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  } else {
    Alert.alert("No Data Found");
  }
}
