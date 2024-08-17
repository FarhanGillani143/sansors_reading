import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { AccelerometerDataType } from "../components/Accelerometer/Accelerometer";

/**
 * Converts an array of objects into a CSV-formatted string depending on the type of sensor.
 *
 * @param {MeasurementType[]} arr - An array of measurement objects to be converted to CSV.
 * @param {"Accelerometer"} sensor - The type of sensor data being converted. Currently, only "Accelerometer" is supported.
 *
 * @returns {string} - A CSV-formatted string containing the headers and the sensor data.
 *
 * The function formats the data with the headers "timestamp", "x", "y", and "z". It assumes the input
 * data is from an accelerometer sensor and constructs the CSV rows accordingly. The headers are included
 * in the first row, followed by the formatted data rows.
 */

export function convertArrayToCSV(
  arr: AccelerometerDataType[],
  sensor: "Accelerometer"
) {
  if (sensor == "Accelerometer") {
    const headers = ["timestamp", "x", "y", "z"];

    const rows = arr.map(
      (obj: AccelerometerDataType) =>
        `"${obj.timestamp}",${obj.x},${obj.y},${obj.z}`
    );

    return [headers.join(","), ...rows].join("\n");
  }
}

type Arguments = {
  arr: AccelerometerDataType[];
  fileName?: string;
  sensor: "Accelerometer";
};

/**
 * Converts an array of sensor measurement objects into a CSV file, saves it, and provides an option to share it.
 *
 * @param {Arguments} params - An object containing the following properties:
 *   @param {MeasurementType[]} param.arr - An array of measurement objects to be converted into CSV format.
 *   @param {string} [param.fileName] - An optional file name for the CSV file. Defaults to "Data" if not provided.
 *   @param {"Accelerometer"} param.sensor - The type of sensor data being converted. Currently, only "Accelerometer" is supported.
 *
 * @returns {Promise<void>} - A promise that resolves when the file is written and sharing options are handled.
 *
 * The function uses the `convertArrayToCSV` function to generate a CSV-formatted string from the provided data.
 * It then saves the CSV string to a file with the specified or default file name in the document directory. If
 * sharing is available on the device, it allows the user to share the CSV file. After sharing, the file is deleted.
 * If sharing is not available or an error occurs during file operations, appropriate alerts are shown to the user.
 * If no data is found to convert, an alert is displayed.
 */

export async function downloadCSV({ arr, fileName, sensor }: Arguments) {
  const csvString = convertArrayToCSV(arr, sensor);
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
          UTI: "public.comma-seperated-values-text",
        });
        await FileSystem.deleteAsync(filePath);
      } else {
        Alert.alert("Sharing is not available on this device");
      }
    } catch (error: any) {
      Alert.alert("Error writing CSV file:", error.message);
    }
  } else {
    Alert.alert("No Data Found");
  }
}
