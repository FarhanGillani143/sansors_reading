import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Path, Svg, G } from "react-native-svg";

import DateLabel from "./DateLabel"; // Component to render the date label
import RenderXAxis from "./RenderXAxis"; // Component to render the x-axis ticks
import RenderYAxis from "./RenderYAxis"; // Component to render the y-axis ticks
import GraphDetails from "./GraphDetails"; // Component for additional graph details
import { SVG_WIDTH, SVG_HEIGHT } from "./Contants"; // Constants for graph dimensions
import { updateMaxMinValue } from "../../../utils/Graphs/MaxMinValue"; // Utility to update min and max values for the graph
import AccelerometerSensor from "../../home/Accelerometer/Accelerometer"; // Component for accelerometer sensor
import { generateAccelerationCurves } from "../../../utils/Graphs/AccelerationCurves"; // Utility to generate graph curves
import {
  SensorDataType,
  AccelerationGraphType,
} from "../../../types/DataTypes"; // Data types for sensor data
import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorContext"; // Context to access sensor data

interface Props {
  initialMaxValue: number; // Initial maximum value for the graph's y-axis
  initialMinValue: number; // Initial minimum value for the graph's y-axis
  recentMinuteData: SensorDataType[]; // Array containing the most recent minute's worth of sensor data
}

/**
 * Component to render a graph that visualizes real-time accelerometer data.
 *
 * The graph includes X, Y, and Z acceleration curves, along with labels and grid lines.
 * It dynamically updates based on incoming sensor data, displaying a rolling view of the most recent readings.
 * Component to render a graph that visualizes real-time accelerometer data.
 *
 * The graph includes X, Y, and Z acceleration curves, along with labels and grid lines.
 * It dynamically updates based on incoming sensor data, displaying a rolling view of the most recent readings.
 *
 * @param {Props} props - Component props.
 * @param {number} props.initialMaxValue - The initial maximum value for the y-axis scaling.
 * @param {number} props.initialMinValue - The initial minimum value for the y-axis scaling.
 * @param {SensorDataType[]} props.recentMinuteData - Array containing recent minute sensor data.
 *
 * @returns {JSX.Element} A React component that displays an acceleration graph with data from the device sensors.
 */
export default function AccelerationGraph(props: Props) {
  // Extract sensor-related values from the context
  const { startSensors, sensorsData } =
    useContext<SensorContextType>(SensorsContext);

  // Store generated graph data (curves, axis labels, etc.)
  const [graphData, setGraphData] = useState<AccelerationGraphType>();

  // Track the max and min values for scaling the graph over time
  const maxValueRef = useRef<number>(props.initialMaxValue); // Ref for tracking the maximum value on the y-axis
  const minValueRef = useRef<number>(props.initialMinValue); // Ref for tracking the minimum value on the y-axis

  const yAxisData = (label: string, index: number) => {
    if (!graphData) return null; // Ensure graphData is available before rendering
    const y = graphData.yAxisScale(Number(label)); // Map label to its y-coordinate
    return <RenderYAxis key={index} y={y} index={index} label={label} />; // Render y-axis tick & gridlines
  };

  const xAxisData = (label: Date, index: number) => {
    if (!graphData) return null; // Ensure graphData is available before rendering
    const x = graphData.xAxisScale(label); // Map label to its x-coordinate
    return <RenderXAxis key={index} label={label} index={index} x={x} />; // Render x-axis tick & gridlines
  };

  /**
   * useEffect hook to process incoming sensor data and update the graph.
   * Whenever sensor data changes, this effect recalculates the max/min values and updates the graph.
   */
  useEffect(() => {
    // If the length of recent data is different from the sensor data, update min/max values
    if (props.recentMinuteData.length !== sensorsData.length) {
      const { maxValue, minValue } = updateMaxMinValue({
        prevMin: minValueRef.current,
        prevMax: maxValueRef.current,
        sensorData: sensorsData[0], // Process the latest sensor data point
      });

      maxValueRef.current = maxValue; // Update max value reference
      minValueRef.current = minValue; // Update min value reference
    }

    // Take the most recent 299 data points for a 1-minute graph
    const recentMinuteData = sensorsData.slice(0, 299);

    // Generate the graph data using the updated sensor data and new min/max values
    const graph = generateAccelerationCurves({
      minValue: minValueRef.current,
      maxValue: maxValueRef.current,
      sensorsData: recentMinuteData, // Pass in recent minute data
    });

    setGraphData(graph); // Update the graph data state
  }, [sensorsData, props.recentMinuteData.length]);

  return (
    <View style={styles.container}>
      {startSensors && <AccelerometerSensor />}
      <GraphDetails />
      {graphData && (
        <Svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          style={{ alignItems: "center" }}
        >
          {graphData.xAxisLabels.map(xAxisData)}
          {graphData.yAxisLabels.map(yAxisData)}
          <DateLabel sensorData={sensorsData[0]} />

          <G strokeWidth={2} fill={"none"}>
            {graphData.accelerationCurves.length > 0 &&
              graphData.accelerationCurves.map(
                ({ curve, color }, index) =>
                  curve && <Path key={index} d={curve} stroke={color} />
              )}
          </G>
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    alignItems: "center", // Center align the graph container horizontally
  },
});
