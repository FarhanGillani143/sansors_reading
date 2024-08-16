import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { AccelerometerMeasurement } from "expo-sensors";

interface AccelerometerReading {
  timestamp: string;
  data: AccelerometerMeasurement;
}

interface PropsType {
  data: AccelerometerReading[];
}

export default function ReadingsList({ data }: PropsType) {
  const renderItem = ({ item }: { item: AccelerometerReading }) => {
    return (
      <View style={styles.listItem}>
        <Text>{item.timestamp} - </Text>
        <Text>x: {item.data.x.toFixed(2)}</Text>
        <Text>y: {item.data.y.toFixed(2)}</Text>
        <Text>z: {item.data.z.toFixed(2)}</Text>
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
});
