import { Alert, Linking } from "react-native";
import * as Location from "expo-location";

/**
 * Displays an alert to the user informing them that location permission is denied,
 * and provides an option to open the app's settings to manually enable location permissions.
 */
const alertToOpenAppSettings = () => {
  const openAppSettings = () =>
    Linking.openURL("app-settings:").catch((error) =>
      Alert.alert("Can't Open App Settings", error.message)
    );

  Alert.alert(
    "Location Permission Denied",
    "Please click on the 'Open Settings' button and manually turn on location if you wish to use the GPS feature.",
    [
      {
        text: "Cancel",
      },
      {
        text: "Open Settings",
        onPress: openAppSettings,
      },
    ]
  );
};

/**
 * Requests location permission asynchronously.
 *
 * This function first checks if location permission has already been granted. If not, it will attempt to request permission.
 * If the app can no longer request permission (i.e., the user has denied it in a way that prevents future prompts),
 * it will prompt the user to manually enable the permission in the app's settings.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if permission is granted, `false` otherwise.
 */
export const requestLocatonPermissionAsync = async () => {
  const { canAskAgain, granted } =
    await Location.getForegroundPermissionsAsync();

  if (granted) {
    return true; // Permission has already been granted
  } else if (canAskAgain) {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    return granted; // Return the result of the new permission request
  } else {
    alertToOpenAppSettings(); // Prompt the user to manually enable location in settings
    return false; // Permission was not granted
  }
};
