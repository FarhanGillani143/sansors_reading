import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Path, Svg } from "react-native-svg";

import DateLabel from "../Shared/DateLabel";
import RenderXAxis from "../Shared/RenderXAxis";
import RenderYAxis from "../Shared/RenderYAxis";
import { SVG_HEIGHT, SVG_WIDTH } from "../Shared/Contants";
import { generateVarianceCurve } from "../../../utils/Graphs/VarianceCurve";
import { VarianceDataType, VarianceGraphType } from "../../../types/DataTypes";
import { calculateMeanVariance } from "../../../utils/Graphs/CalculateVariance";
import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorsData/SensorContext";

interface Props {
  recordsLimit: number;
  graphType: "real-time" | "general";
}

/**
 * AccelerationVarianceGraph is a real-time graph component that renders the variance of acceleration
 * data captured from the device sensors. It updates dynamically as new data is received, showing
 * accelerometer readings over the last minute.
 *
 * @returns {React.ReactElement} A rendered SVG graph of the variance data or a loading indicator.
 */
export default function AccelerationVarianceGraph({
  graphType,
  recordsLimit,
}: Props) {
  // Extract sensor data and time interval from the global context
  const { startSensors, sensorsData, varianceData, updateVarianceData } =
    useContext<SensorContextType>(SensorsContext);

  // Store the generated graph data (such as curves and axis labels)
  const [graphData, setGraphData] = useState<VarianceGraphType>();

  // A reference to store variance data points
  const varianceDataRef = useRef<VarianceDataType[]>([]);

  const standardMax = +0.09;
  const standardMin = -0.03;

  // References for min and max values used to scale the y-axis dynamically
  const maxValueRef = useRef<number>(standardMax); // Initialize max value for y-axis
  const minValueRef = useRef<number>(standardMin); // Initialize min value for y-axis

  /**
   * Generates the variance graph using the most recent sensor data points.
   * It calculates the variance, updates the min/max values, and generates SVG path data.
   */
  const generateGraphData = () => {
    if (graphType === "general") {
      const lastMinuteVarianceData = varianceData.slice(-recordsLimit);
      // Generate the graph using the variance data
      const graph = generateVarianceCurve({
        minValue: minValueRef.current,
        maxValue: maxValueRef.current,
        varianceData: lastMinuteVarianceData,
      });

      setGraphData(graph);
    } else {
      // Get the most recent data points for the last minute
      const lastMinuteData = sensorsData.slice(0, recordsLimit);

      // Calculate the variance for the selected data points
      const variance = calculateMeanVariance(lastMinuteData);
      const timestamp = new Date();

      // Append the new variance data point with a timestamp
      varianceDataRef.current.push({ variance, timestamp });
      // Update the value in context provider
      updateVarianceData({ variance, timestamp });

      // Dynamically adjust min and max values based on the calculated variance
      minValueRef.current = Math.min(minValueRef.current, variance);
      maxValueRef.current = Math.max(maxValueRef.current, variance);

      const lastMinuteVariance = varianceDataRef.current.slice(-recordsLimit);

      // Generate the graph using the variance data
      const graph = generateVarianceCurve({
        minValue: minValueRef.current,
        maxValue: maxValueRef.current,
        varianceData: lastMinuteVariance,
      });

      // Update the state with the generated graph data
      setGraphData(graph);
    }
  };

  // Generate the variance graph when the sensor data exceeds the limit
  useEffect(() => {
    generateGraphData();
  }, [sensorsData]);

  const currentValue =
    varianceDataRef?.current[varianceDataRef.current.length - 1]?.variance;

  const showCurrentValue =
    startSensors && graphType === "real-time" && !!currentValue;

  return (
    <React.Fragment>
      {showCurrentValue && (
        <Text style={styles.value}>
          Current Value: {currentValue.toFixed(3)}
        </Text>
      )}
      {graphData && (
        <Svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          style={{ alignItems: "center" }}
        >
          {/* Render the X-axis and Y-axis using the graph data */}
          {graphData.xAxisData.map(RenderXAxis)}
          {graphData.yAxisData.map(RenderYAxis)}

          {/* Display the date label for the most recent sensor data */}
          <DateLabel sensorData={sensorsData[0]} />

          {/* Render the generated curve representing the variance */}
          {graphData.curve && (
            <Path
              d={graphData.curve}
              fill={"none"}
              strokeWidth={2}
              stroke={"green"}
            />
          )}
        </Svg>
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  value: {
    color: "green",
    fontWeight: "600",
    textAlign: "center",
  },
});
