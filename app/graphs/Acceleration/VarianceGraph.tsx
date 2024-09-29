import React, { useContext, useEffect, useRef, useState } from "react";
import { Path, Svg } from "react-native-svg";

import DateLabel from "./DateLabel";
import RenderYAxis from "./RenderYAxis";
import RenderXAxis from "./RenderXAxis";
import { SVG_HEIGHT, SVG_WIDTH } from "./Contants";
import ProgressIndicator from "./ProgressIndicator";
import { generateVarianceCurve } from "../../../utils/Graphs/VarianceCurve";
import { VarianceDataType, VarianceGraphType } from "../../../types/DataTypes";
import { calculateMeanVariance } from "../../../utils/Graphs/CalculateVariance";
import {
  SensorsContext,
  SensorContextType,
} from "../../../context/SensorContext";
import { StyleSheet, Text } from "react-native";

/**
 * AccelerationVarianceGraph is a real-time graph component that renders the variance of acceleration
 * data captured from the device sensors. It updates dynamically as new data is received, showing
 * accelerometer readings over the last minute.
 *
 * @returns {React.ReactElement} A rendered SVG graph of the variance data or a loading indicator.
 */
export default function AccelerationVarianceGraph() {
  // Extract sensor data and time interval from the global context
  const { sensorsData, timeInterval } =
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

  // Track remaining time for generating the graph
  const remainingTimeToGenerateRef = useRef<number>(
    timeInterval * sensorsData.length
  );

  // Limit the records to display only the most recent 1-minute worth of data
  const recordsLimit = 60000 / timeInterval; // Display 60 seconds of records based on the time interval

  /**
   * Generates the variance graph using the most recent sensor data points.
   * It calculates the variance, updates the min/max values, and generates SVG path data.
   */
  const generateVarianceGraph = () => {
    // Get the most recent data points for the last minute
    const lastMinuteData = sensorsData.slice(0, recordsLimit);

    // Calculate the variance for the selected data points
    const variance = calculateMeanVariance(lastMinuteData);

    // Dynamically adjust min and max values based on the calculated variance
    minValueRef.current = Math.min(minValueRef.current, variance, standardMin);
    maxValueRef.current = Math.max(maxValueRef.current, variance, standardMax);

    // Append the new variance data point with a timestamp
    varianceDataRef.current.push({ variance, timestamp: new Date() });

    // Slice the data to retain only the most recent points for a 1-minute graph
    const recentVarianceData = varianceDataRef.current.slice(-recordsLimit);

    // Generate the graph using the variance data
    const graph = generateVarianceCurve({
      minValue: minValueRef.current,
      maxValue: maxValueRef.current,
      varianceData: recentVarianceData,
    });

    // Update the state with the generated graph data
    setGraphData(graph);
  };

  // Generate the variance graph when the sensor data exceeds the limit
  useEffect(() => {
    if (sensorsData.length > recordsLimit) generateVarianceGraph();
  }, [sensorsData]);

  // Update the remaining time for generating the graph when the component is mounted
  useEffect(() => {
    remainingTimeToGenerateRef.current = timeInterval * sensorsData.length;
  }, []);

  const latestValue =
    varianceDataRef?.current[varianceDataRef.current.length - 1]?.variance;

  return (
    <React.Fragment>
      {latestValue && (
        <>
          <Text style={styles.info}>
            0.000 indicates no change in device orientation in last 1 min
          </Text>
          <Text style={styles.value}>
            Current Value: {latestValue.toFixed(3)}
          </Text>
        </>
      )}
      {graphData ? (
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
      ) : (
        <ProgressIndicator remainingTime={remainingTimeToGenerateRef.current} />
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  info: {
    textAlign: "center",
    paddingHorizontal: "5%",
  },
  value: {
    color: "green",
    fontWeight: "600",
    textAlign: "center",
  },
});
