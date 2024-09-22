import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Path, Svg, Text, Line, G } from "react-native-svg";

import GraphDetails from "./GraphDetails";
import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorContext";
import {
  SVG_WIDTH,
  SVG_HEIGHT,
  MARGIN_TOP,
  MARGIN_LEFT,
  GRAPH_WIDTH,
  GRAPH_HEIGHT,
  X_AXIS_COLOR,
  Y_AXIS_COLOR,
  SPEED_COLOR,
} from "./Contants";
import { generateSpeedCurve } from "../../../utils/Graphs/SpeedCurve";

/**
 * Renders a graph displaying speed data from sensors.
 *
 * @returns {JSX.Element} A view containing an SVG graph with X and Y axes and a curve representing speed data.
 */
export default function SpeedGraph() {
  const { sensorsData } = useContext<SensorContextType>(SensorsContext);

  // Access sensor data (assumed to be an array of objects) from the context
  const graph = generateSpeedCurve({
    sensorsData: sensorsData,
    yAxisRange: [GRAPH_HEIGHT, MARGIN_TOP], // Range for Y-axis with top margin
    xAxisRange: [MARGIN_LEFT, GRAPH_WIDTH], // Range for X-axis with left margin for labels
  });

  return (
    <View style={styles.container}>
      <GraphDetails />
      <Svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        style={{ alignItems: "center" }}
      >
        {/* Vertical grid lines for X-axis */}
        {graph.xAxisLabels.map((label, index) => (
          <Line
            key={`vertival-grid-${index}`}
            x1={graph.xAxisScale(label)}
            y1={MARGIN_TOP}
            x2={graph.xAxisScale(label)}
            y2={GRAPH_HEIGHT}
            stroke={index == 0 ? Y_AXIS_COLOR : "lightgray"}
            strokeWidth={2}
          />
        ))}

        {/* Horizontal grid lines for Y-axis */}
        {graph.yAxisLabels.map((label, index) => (
          <Line
            key={`horizontal-grid-${index}`}
            x1={MARGIN_LEFT}
            y1={graph.yAxisScale(Number(label))}
            x2={GRAPH_WIDTH}
            y2={graph.yAxisScale(Number(label))}
            stroke={index == 0 ? X_AXIS_COLOR : "lightgray"}
            strokeWidth={2}
          />
        ))}

        {graph.speedCurve && (
          <Path
            d={graph.speedCurve}
            fill={"none"}
            strokeWidth={2}
            stroke={SPEED_COLOR}
          />
        )}

        {/* X-Axis labels */}
        {graph.xAxisLabels.map((label, index) => (
          <Text
            key={index}
            x={graph.xAxisScale(label)}
            y={GRAPH_HEIGHT + 20}
            fontSize="12"
            fill={X_AXIS_COLOR}
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
            fill={X_AXIS_COLOR} // Color of the date text
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
            x={MARGIN_LEFT - 20} // Position label along the Y-axis
            y={graph.yAxisScale(Number(label))} // Map the value to the Y-axis scale
            fontSize="12" // Font size of the Y-axis label
            fill={Y_AXIS_COLOR} // Color of the Y-axis label text
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
});