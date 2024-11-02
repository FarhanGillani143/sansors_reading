import React, { useContext } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import TextButton from "../../components/TextButton";
import { retrieveSessionData } from "../../utils/ManageStorage";
import {
  SensorsConfigContext,
  SensorsConfigContextType,
} from "../../context/SensorsConfig/ConfigContext";

export default function SessionHistory() {
  const { allSessions } =
    useContext<SensorsConfigContextType>(SensorsConfigContext);

  const EmptyListComponent = (
    <View style={{ alignItems: "center" }}>
      <Text>No Sessions Found</Text>
    </View>
  );

  const renderItem = ({ item }: { item: string }) => (
    <TextButton
      title={item}
      onPress={async () => await retrieveSessionData(item)}
    />
  );

  return (
    <View style={styles.flatListContainer}>
      <FlatList
        data={allSessions}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        contentContainerStyle={styles.contentStyle}
        ListEmptyComponent={EmptyListComponent}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    width: "100%",
    overflow: "hidden",
  },
  flatList: {
    width: "100%",
  },
  contentStyle: {
    gap: 10,
    padding: 10,
  },
});
