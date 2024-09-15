import { useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import Animated from "react-native-reanimated";

import { makeGraph } from "../../utils/Graphs";
import { SensorContextType, SensorsContext } from "../../context/SensorContext";

type GraphDataType = {
  max: number;
  curve: string;
};

export default function Graph() {
  const { sensorsData } = useContext<SensorContextType>(SensorsContext);

  const GRAPH_HEIGHT = 300;
  const GRAPH_WIDTH = Dimensions.get("window").width;

  const graphData: GraphDataType | null = makeGraph({
    data: sensorsData,
    height: GRAPH_HEIGHT,
    width: GRAPH_WIDTH,
  });

  return (
    <Animated.View style={styles.container}>
      <Svg
        height={GRAPH_HEIGHT}
        width={GRAPH_WIDTH}
        style={{ borderWidth: 2, borderColor: "green" }}
      >
        {graphData && <Path d={graphData.curve} strokeWidth={2} />}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
