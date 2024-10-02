import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { renderItem } from "./RenderItem";
import { downloadCSV } from "../../utils/ArrayToCSV";
import TextButton from "../../components/TextButton";
import { SensorContextType, SensorsContext } from "../../context/SensorContext";

const EmptyListComponent = (
  <View style={{ alignItems: "center" }}>
    <Text>No Readings Found</Text>
  </View>
);

export default function DisplayDataList() {
  const { sensorsData } = useContext<SensorContextType>(SensorsContext);

  /** Downloads the sensor readings and saves them as a CSV file. */
  const handleDownload = async () => await downloadCSV({ arr: sensorsData });

  return (
    <View style={styles.dataContainer}>
      <TextButton onPress={handleDownload} title={"Download Data as CSV"} />
      <Text>Total Records: {sensorsData.length}</Text>
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
    paddingTop: 10,
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
