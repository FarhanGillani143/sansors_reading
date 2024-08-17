import { StyleSheet, Text, View } from "react-native";
import { AccelerometerDataType } from "../../components/Accelerometer/Accelerometer";

export const renderItem = ({ item }: { item: AccelerometerDataType }) => {
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

const styles = StyleSheet.create({
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
