import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";

import { downloadCSV } from "../../utils/ArrayToCSV";
import { renderItem } from "./RenderItem";
import {
  SensorsContext,
  SensorContextType,
} from "../../context/ContextProvider";

const EmptyListComponent = (
  <View style={{ alignItems: "center" }}>
    <Text>No Readings Found</Text>
  </View>
);

export default function DisplayDataList() {
  const { sensorsData } = useContext<SensorContextType>(SensorsContext);

  /** Downloads the sensor readings and saves them as a CSV file. */
  const handleDownload = async () =>
    await downloadCSV({
      arr: sensorsData,
      sensor: "Accelerometer",
    });

  return (
    <View style={styles.dataContainer}>
      <Button onPress={handleDownload} title={"Download Data as CSV"} />
      <View style={styles.flatListContainer}>
        <FlatList
          data={sensorsData}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          contentContainerStyle={styles.contentStyle}
          ListEmptyComponent={EmptyListComponent}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dataContainer: {
    flex: 1,
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  flatListContainer: {
    height: "80%",
    width: "90%",
    borderWidth: 2,
    overflow: "hidden",
    borderColor: "black",
  },
  flatList: {
    width: "100%",
  },
  contentStyle: {
    gap: 10,
    padding: 10,
  },
});
