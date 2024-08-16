import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MeasurementType } from "./Accelerometer";

type PropsType = {
  data: MeasurementType[];
};

export default function ReadingsList({ data }: PropsType) {
  const renderItem = ({ item }: { item: MeasurementType }) => {
    return (
      <View style={styles.listItem}>
        <Text>{item.timestamp}</Text>
        <View style={styles.borderline}></View>
        <View style={styles.dataPoints}>
          <Text>x: {item.x.toFixed(2)}</Text>
          <Text>y: {item.y.toFixed(2)}</Text>
          <Text>z: {item.z.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  const EmptyListComponent = (
    <View style={{ alignItems: "center" }}>
      <Text>No Readings Found</Text>
    </View>
  );

  return (
    <View style={styles.dataContainer}>
      <View style={styles.flatListContainer}>
        <FlatList
          data={data}
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
  listItem: {
    gap: 5,
    padding: 5,
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "silver",
  },
  borderline: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  dataPoints: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
