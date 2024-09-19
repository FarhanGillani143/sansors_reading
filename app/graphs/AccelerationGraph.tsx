import { useContext } from "react";
import { Dimensions, StyleSheet, Text as RNText, View } from "react-native";
import { Path, Svg, Text, Line, G } from "react-native-svg";
import { SensorContextType, SensorsContext } from "../../context/SensorContext";
import { generateAccelerationCurves } from "../../utils/AccelerationCurves";

/**
 * Renders a graph displaying acceleration data from sensors.
 *
 * @returns {JSX.Element} A view containing an SVG graph with X and Y axes and curves representing acceleration data.
 */
export default function AccelerationGraph() {
  const { sensorsData } = useContext<SensorContextType>(SensorsContext);

  const yAxisColor = "maroon";
  const xAxisColor = "crimson";

  // Set SVG height and width based on device screen dimensions
  const SVG_HEIGHT = 350;
  const SVG_WIDTH = Dimensions.get("window").width;

  // Calculate graph dimensions by subtracting space for labels
  const GRAPH_HEIGHT = SVG_HEIGHT - 50; // Margin for labels at the bottom
  const GRAPH_WIDTH = SVG_WIDTH - 30; // Margin for graph on the right

  // Generate graph data for rendering based on sensor data
  const graph = generateAccelerationCurves({
    sensorsData: sensorsData,
    yAxisRange: [GRAPH_HEIGHT, 10], // Range for Y-axis with margin at the top for the graph
    xAxisRange: [30, GRAPH_WIDTH], // Range for X-axis with margin on the left for the labels
  });

  return (
    <View style={styles.container}>
      <RNText style={styles.graphTitle}>Acceleration Graph</RNText>
      <Svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        style={{ alignItems: "center" }}
      >
        {/* X-Axis line */}
        <Line
          x1={30}
          y1={GRAPH_HEIGHT}
          x2={GRAPH_WIDTH}
          y2={GRAPH_HEIGHT}
          stroke={xAxisColor} // Color of the X-axis line
          strokeWidth="2" // Thickness of the X-axis line
        />
        {/* Y-Axis line */}
        <Line
          x1={30}
          y1={GRAPH_HEIGHT}
          x2={30}
          y2={10}
          stroke={yAxisColor} // Color of the Y-axis line
          strokeWidth="2" // Thickness of the Y-axis line
        />

        {/* Acceleration curves */}
        <G strokeWidth={2} fill={"none"}>
          {graph.accelerationXCurve && (
            <Path d={graph.accelerationXCurve} stroke="blue" />
          )}
          {graph.accelerationYCurve && (
            <Path d={graph.accelerationYCurve} stroke="green" />
          )}
          {graph.accelerationZCurve && (
            <Path d={graph.accelerationZCurve} stroke="red" />
          )}
        </G>

        {/* X-Axis labels */}
        {graph.xAxisLabels.map((label, index) => (
          <Text
            key={index}
            x={graph.xAxisScale(label)}
            y={GRAPH_HEIGHT + 20}
            fontSize="12"
            fill={xAxisColor}
            textAnchor="middle" // Center-align the text
          >
            {new Date(label).toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Text>
        ))}

        {/* Date label under the X-Axis */}
        {sensorsData.length > 0 && (
          <Text
            x={GRAPH_WIDTH / 2} // Center the date label under the graph
            y={GRAPH_HEIGHT + 40} // Position the date text below the X-axis labels
            fontSize="14" // Font size of the date label
            fill={xAxisColor} // Color of the date text
            textAnchor="middle" // Center-align the text
          >
            {sensorsData[0].timeDateObject.toLocaleDateString([], {
              dateStyle: "full", // Full date format
            })}
          </Text>
        )}

        {/* Y-Axis labels */}
        {graph.yAxisLabels.map((label, index) => (
          <Text
            key={index}
            x={15} // Position label along the Y-axis
            y={graph.yAxisScale(Number(label))} // Map the value to the Y-axis scale
            fontSize="12" // Font size of the Y-axis label
            fill={yAxisColor} // Color of the Y-axis label text
            textAnchor="middle" // Center-align the text
            alignmentBaseline="middle" // Vertically align the text
          >
            {label}
          </Text>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // Center the graph container horizontally
  },
  graphTitle: {
    fontSize: 20,
    marginTop: 20, // Margin above the title
    color: "#36454F", // Dark color for the title text
    fontWeight: "bold", // Bold font style for the title
  },
});
