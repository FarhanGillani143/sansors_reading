import React, { useContext, useState } from "react";
import {
  Text,
  View,
  Button,
  Keyboard,
  TextInput,
  StyleSheet,
} from "react-native";

import {
  SensorsContext,
  SensorContextType,
} from "../../../tempContext/SensorContext";

export default function SensorTimeInterval() {
  const { timeInterval, updateTimeIntervalAsync } =
    useContext<SensorContextType>(SensorsContext);

  // State to hold the new time interval entered by the user
  const [newTimeInterval, setNewTimeInterval] = useState<number | null>();

  // State to track if the text input is focused
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  // State to track if there's an error due to an invalid time interval
  const [rangeError, setRangeError] = useState<boolean>(false);

  /**
   * Handles the application of the new sensor time interval.
   * If the interval is valid (>= 200ms), updates the interval, hides the keyboard,
   * and resets the input and error states. Otherwise, sets a range error.
   */
  const applyNewInterval = async () => {
    if (newTimeInterval && newTimeInterval >= 200) {
      await updateTimeIntervalAsync(newTimeInterval);
      Keyboard.dismiss();
      setInputFocused(false);
      setNewTimeInterval(null);
      setRangeError(false);
    } else setRangeError(true);
  };

  /**
   * Cancels the new time interval input by resetting the input and error states
   * and dismissing the keyboard.
   */
  const cancelNewInterval = () => {
    Keyboard.dismiss();
    setInputFocused(false);
    setNewTimeInterval(null);
    setRangeError(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.changeInterval}>
        <Text>Sensor Time Interval</Text>
        <TextInput
          style={styles.textInput}
          placeholder={`${timeInterval}ms`} // Placeholder shows the current interval
          value={newTimeInterval ? `${newTimeInterval}` : ""}
          keyboardType="number-pad"
          onFocus={() => setInputFocused(true)}
          onChange={(value) =>
            setNewTimeInterval(Number(value.nativeEvent.text))
          }
        />
      </View>

      {/* Conditional rendering based on whether the input is focused */}
      {inputFocused ? (
        <View style={{ flexDirection: "row" }}>
          <Button title="Apply" onPress={applyNewInterval} />
          <Button title="Cancel" onPress={cancelNewInterval} />
        </View>
      ) : (
        <Text style={{ fontSize: 10, color: "gray" }}>
          Enter value to change interval
        </Text>
      )}

      {/* Display an error message if the entered interval is invalid */}
      {rangeError && (
        <Text style={{ color: "red" }}>
          Sensor Time Interval should not be less than 200
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 20,
    width: "100%",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  changeInterval: {
    gap: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: "black",
  },
});
