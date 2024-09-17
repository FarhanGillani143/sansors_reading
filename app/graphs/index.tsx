import { useContext } from "react";
import { Dimensions, StyleSheet, Text as RNText } from "react-native";
import Animated from "react-native-reanimated";
import { Path, Svg, Text, Line } from "react-native-svg";

import { makeAccelerationGraph } from "../../utils/MakeGraphs";
import { SensorContextType, SensorsContext } from "../../context/SensorContext";

export default function Graph() {
  const { sensorsData } = useContext<SensorContextType>(SensorsContext);

  const yAxisColor = "maroon";
  const xAxisColor = "crimson";

  // Set up SVG height and width based on device screen dimensions
  const SVG_HEIGHT = 450;
  const SVG_WIDTH = Dimensions.get("window").width - 20; // Minus 20 for margins

  // Adjust graph size by subtracting additional space for margins
  const GRAPH_HEIGHT = SVG_HEIGHT - 50; // Minus 30 for top/bottom margin
  const GRAPH_WIDTH = SVG_WIDTH - 30; // Minus 30 for left/right margin

  // Generate the graph data for rendering based on sensor data
  const graphData = makeAccelerationGraph({
    sensorsData: sensorsData, // Sensor data to be plotted
    yScaleRange: [GRAPH_HEIGHT, 30], // yScale: maps sensor data to SVG height
    xScaleRange: [30, GRAPH_WIDTH], // xScale: maps time to SVG width
  });

  return (
    <Animated.View style={styles.container}>
      {graphData && (
        <>
          {/* Title */}
          <RNText style={styles.graphTitle}>Acceleration Graph (x)</RNText>
          <Svg
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            style={{ alignItems: "center" }}
          >
            {/* X and Y axis lines */}
            <Line
              x1={30}
              y1={GRAPH_HEIGHT}
              x2={GRAPH_WIDTH}
              y2={GRAPH_HEIGHT}
              stroke={xAxisColor} // Define the color of the X-axis
              strokeWidth="2" // Thickness of the X-axis line
            />
            <Line
              x1={30}
              y1={GRAPH_HEIGHT}
              x2={30}
              y2={30}
              stroke={yAxisColor} // Define the color of the Y-axis
              strokeWidth="2" // Thickness of the Y-axis line
            />

            {/* Curve Path */}
            {graphData.curve && (
              <Path
                d={graphData.curve} // SVG path data for the graph curve
                stroke="blue" // Stroke color for the curve
                strokeWidth="2" // Thickness of the curve
                fill="none" // No fill below the curve
              />
            )}

            {/* X-Axis Labels */}
            {graphData.xLabels.map((label, index) => (
              <Text
                key={index}
                x={graphData.xScale(label)} // Position of the label on the X-axis
                y={GRAPH_HEIGHT + 20} // Position the label below the X-axis
                fontSize="12" // Font size for the label
                fill={xAxisColor} // Text color for the label
                textAnchor="middle" // Center align the text
              >
                {new Date(label).toLocaleTimeString([], {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Text>
            ))}
            {sensorsData.length > 0 && (
              <Text
                x={GRAPH_WIDTH / 2} // Center the date text under the graph
                y={GRAPH_HEIGHT + 40} // Adjust the y-position to appear below the graph
                fontSize="14"
                fill={xAxisColor}
                textAnchor="middle"
              >
                {sensorsData[0].timeDateObject.toLocaleDateString([], {
                  dateStyle: "full",
                })}
              </Text>
            )}
            {/* Y-Axis Labels */}
            {graphData.yLabels.map((label, index) => (
              <Text
                key={index}
                x={10} // Position of the label on the Y-axis
                y={graphData.yScale(Number(label))} // Map the value to the Y-axis
                fontSize="12" // Font size for the label
                fill={yAxisColor} // Text color for the label
                textAnchor="middle" // Center align the text
                alignmentBaseline="middle" // Vertically center the text
              >
                {label.toFixed(1)}
              </Text>
            ))}
          </Svg>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // Center the graph container horizontally
  },
  graphTitle: {
    fontSize: 20,
    marginTop: 20,
    color: "#36454F",
    fontWeight: "bold",
  },
});
