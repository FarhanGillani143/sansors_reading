import React, { useContext, useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import { G, Path, Svg } from "react-native-svg";

import DateLabel from "../Shared/DateLabel";
import RenderYAxis from "../Shared/RenderYAxis";
import RenderXAxis from "../Shared/RenderXAxis";
import { SVG_HEIGHT, SVG_WIDTH } from "../Shared/Contants";
import { AccelerationGraphType } from "../../../types/DataTypes";
import { generateAccelerationCurves } from "../../../utils/Graphs/AccelerationCurves";
import {
  getMaxMinValue,
  updateMaxMinValue,
} from "../../../utils/Graphs/MaxMinValue";
import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorsData/SensorContext";

interface Props {
  recordsLimit: number;
}

/**
 * Graph component renders a real-time acceleration graph based on sensor data.
 * It tracks accelerometer readings over the last minute and adjusts the graph's y-axis scaling
 * by dynamically updating the min and max values.
 *
 * @returns {React.ReactElement} The real-time acceleration graph or a fallback text message.
 */
export default function AccelerationPropertiesGraph({ recordsLimit }: Props) {
  // Extract sensor-related values from the context
  const { sensorsData } = useContext<SensorContextType>(SensorsContext);

  // Store generated graph data (curves, axis labels, etc.)
  const [graphData, setGraphData] = useState<AccelerationGraphType>();

  // Track the max and min values for scaling the graph over time
  const maxValueRef = useRef<number>(); // Ref for tracking the maximum value on the y-axis
  const minValueRef = useRef<number>(); // Ref for tracking the minimum value on the y-axis

  /**
   * Generates the acceleration graph by processing the most recent sensor data,
   * updating the min and max values, and calculating the graph's curves and axes.
   */
  const generateAccelerationGraph = () => {
    const lastMinuteData = sensorsData.slice(0, recordsLimit); // Take the most recent 299 data points for a 1-minute graph
    const latestReading = lastMinuteData[0];

    // Update max and min values based on the latest reading
    const { newMaxValue, newMinValue } = updateMaxMinValue({
      prevMin: minValueRef.current ?? 0,
      prevMax: maxValueRef.current ?? 0,
      latestReading: latestReading, // Process the latest sensor data point
    });

    maxValueRef.current = newMaxValue; // Update max value reference
    minValueRef.current = newMinValue; // Update min value reference

    // Generate the graph data using the updated sensor data and new min/max values
    const graph = generateAccelerationCurves({
      minValue: minValueRef.current,
      maxValue: maxValueRef.current,
      sensorsData: lastMinuteData, // Pass in recent minute data
    });

    setGraphData(graph); // Store the generated graph data
  };

  /**
   * Initial useEffect hook to calculate the initial max and min values for the graph
   * based on the most recent minute of sensor data.
   */
  useEffect(() => {
    const recentMinuteData = sensorsData.slice(0, recordsLimit); // Get the most recent data points
    const { maxValue, minValue } = getMaxMinValue(recentMinuteData); // Calculate max and min values
    maxValueRef.current = maxValue; // Set max value ref
    minValueRef.current = minValue; // Set min value ref
  }, []);

  /**
   * useEffect hook to update the graph whenever the sensor data changes.
   * Only generate the graph if both max and min values are defined.
   */
  useEffect(() => {
    if (maxValueRef.current != undefined && minValueRef.current != undefined) {
      generateAccelerationGraph(); // Generate the graph when the sensor data changes
    }
  }, [sensorsData]);

  return (
    <React.Fragment>
      {graphData ? (
        <Svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          style={{ alignItems: "center" }}
        >
          {/* Render the X and Y axis */}
          {graphData.xAxisData.map(RenderXAxis)}
          {graphData.yAxisData.map(RenderYAxis)}

          {/* Render the date label */}
          <DateLabel sensorData={sensorsData[0]} />

          {/* Render the acceleration curves */}
          <G strokeWidth={2} fill={"none"}>
            {graphData.accelerationCurves.length > 0 &&
              graphData.accelerationCurves.map(
                ({ curve, color }, index) =>
                  curve && <Path key={index} d={curve} stroke={color} />
              )}
          </G>
        </Svg>
      ) : (
        <Text>No graph data available at the moment</Text>
      )}
    </React.Fragment>
  );
}
