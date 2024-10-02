import React from "react";
import { Line, Text as SVGText } from "react-native-svg";

import { XAxisDataType } from "../../../types/DataTypes";
import {
  MARGIN_TOP,
  GRAPH_HEIGHT,
  X_AXIS_COLOR,
  Y_AXIS_COLOR,
} from "./Contants";

/**
 * Renders a single X-axis grid line and label for the graph.
 *
 * @param {XAxisDataType} param0 - Contains the label (timestamp) and the scaled position on the X-axis.
 * @param {Date} param0.label - The time label to be displayed at the X-axis tick.
 * @param {number} param0.scaledLabel - The X-axis pixel position of the tick, scaled to the graph's width.
 * @param {number} index - The index of the X-axis tick, used to differentiate between the Y-axis and other grid lines.
 *
 * @returns {React.ReactElement} A fragment containing the X-axis grid line and label.
 */
export default function RenderXAxis(
  { label, scaledLabel }: XAxisDataType,
  index: number
) {
  return (
    <React.Fragment key={index}>
      {/* Grid lines */}
      <Line
        x1={scaledLabel} // X position of the line
        y1={MARGIN_TOP} // Starts from the top margin
        x2={scaledLabel} // X position of the line (same as x1)
        y2={GRAPH_HEIGHT} // Draws to the bottom edge of the graph
        stroke={index === 0 ? Y_AXIS_COLOR : "lightgray"} // Y-axis line is different from other grid lines
        strokeWidth={2}
      />
      {/* Labels */}
      <SVGText
        x={scaledLabel} // Position the text on the X-axis
        y={GRAPH_HEIGHT + 20} // Offset the label below the graph
        fontSize="12" // Font size for the label
        fill={X_AXIS_COLOR} // Text color
        textAnchor="middle" // Horizontally centers the text
      >
        {new Date(label).toLocaleTimeString([], {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}{" "}
        {/* Render the time label */}
      </SVGText>
    </React.Fragment>
  );
}
