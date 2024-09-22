import React from "react";
import { Line, Text as SVGText } from "react-native-svg";
import {
  MARGIN_LEFT,
  GRAPH_WIDTH,
  X_AXIS_COLOR,
  Y_AXIS_COLOR,
} from "./Contants";

interface Props {
  y: number;
  label: string;
  index: number;
}

export default function RenderYAxis({ y, index, label }: Props) {
  return (
    <React.Fragment>
      {/* Grid lines */}
      <Line
        x1={MARGIN_LEFT}
        y1={y}
        x2={GRAPH_WIDTH}
        y2={y}
        stroke={index === 0 ? X_AXIS_COLOR : "lightgray"}
        strokeWidth={2}
      />
      {/* Labels */}
      <SVGText
        y={y}
        x={MARGIN_LEFT - 20} // Position along Y-axis
        fontSize="12"
        fill={Y_AXIS_COLOR}
        textAnchor="middle" // Center-align the text
        alignmentBaseline="middle" // Vertically align the text
      >
        {label}
      </SVGText>
    </React.Fragment>
  );
}
