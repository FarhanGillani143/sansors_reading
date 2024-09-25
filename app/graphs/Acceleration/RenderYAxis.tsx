import React from "react";
import { Line, Text as SVGText } from "react-native-svg";

import { YAxisDataType } from "../../../types/DataTypes";
import {
  MARGIN_LEFT,
  GRAPH_WIDTH,
  X_AXIS_COLOR,
  Y_AXIS_COLOR,
} from "./Contants";

/**
 * Renders a single Y-axis grid line and label for the graph.
 *
 * @param {YAxisDataType} param0 - Contains the label and the scaled position on the Y-axis.
 * @param {string} param0.label - The text label to be displayed at the Y-axis tick.
 * @param {number} param0.scaledLabel - The Y-axis pixel position of the tick, scaled to the graph's height.
 * @param {number} index - The index of the Y-axis tick, used to differentiate between the X-axis and other grid lines.
 *
 * @returns {React.ReactElement} A fragment containing the Y-axis grid line and label.
 */
export default function RenderYAxis(
  { label, scaledLabel }: YAxisDataType,
  index: number
) {
  return (
    <React.Fragment key={index}>
      {/* Grid lines */}
      <Line
        x1={MARGIN_LEFT} // Starts from the left margin
        y1={scaledLabel} // Y position of the line
        x2={GRAPH_WIDTH} // Draws to the right edge of the graph
        y2={scaledLabel} // Y position of the line (same as y1)
        stroke={index === 0 ? X_AXIS_COLOR : "lightgray"} // X-axis line is different from other grid lines
        strokeWidth={2}
      />
      {/* Labels */}
      <SVGText
        y={scaledLabel} // Position the text on the Y-axis
        x={MARGIN_LEFT - 20} // Offset the label to the left of the graph
        fontSize="12" // Font size for the label
        fill={Y_AXIS_COLOR} // Text color
        textAnchor="middle" // Horizontally centers the text
        alignmentBaseline="middle" // Vertically centers the text
      >
        {label} {/* Render the actual Y-axis label */}
      </SVGText>
    </React.Fragment>
  );
}
