import { StyleSheet, Text, View } from "react-native";
import { SensorDataType } from "../../types/DataTypes";

export const renderItem = ({ item }: { item: SensorDataType }) => {
  return (
    <View style={styles.listItem}>
      <Text>{item.timestamp}</Text>
      <View style={styles.borderline}></View>
      <View style={styles.dataPoints}>
        <Text>x: {item.accelerationData?.x.toFixed(2)} gs</Text>
        <Text>y: {item.accelerationData?.y.toFixed(2)} gs</Text>
        <Text>z: {item.accelerationData?.z.toFixed(2)} gs</Text>
      </View>
      <View style={styles.borderline}></View>
      <View style={styles.dataPoints}>
        <Text>
          Heading: {item.locationData?.heading?.toFixed(4)}° from north
        </Text>
      </View>
      <View style={styles.borderline}></View>
      <View style={styles.dataPoints}>
        <Text>Longitude: {item.locationData?.longitude?.toFixed(4)}°</Text>
        <Text>Latitude: {item.locationData?.latitude?.toFixed(4)}°</Text>
      </View>
      <View style={styles.borderline}></View>
      <View style={styles.dataPoints}>
        <Text>Altitude: {item.locationData?.altitude?.toFixed(2)}m</Text>
        <Text>Speed: {item.locationData?.speed?.toFixed(3)}km/h</Text>
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
