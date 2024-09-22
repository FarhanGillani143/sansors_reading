import React from "react";
import { Line, Text as SVGText } from "react-native-svg";
import {
  MARGIN_TOP,
  GRAPH_HEIGHT,
  X_AXIS_COLOR,
  Y_AXIS_COLOR,
} from "./Contants";

interface Props {
  x: number;
  label: Date;
  index: number;
}

export default function RenderXAxis({ label, index, x }: Props) {
  return (
    <React.Fragment>
      {/* Grid lines */}
      <Line
        x1={x}
        y1={MARGIN_TOP}
        x2={x}
        y2={GRAPH_HEIGHT}
        stroke={index === 0 ? Y_AXIS_COLOR : "lightgray"}
        strokeWidth={2}
      />
      {/* Labels */}
      <SVGText
        x={x}
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
      </SVGText>
    </React.Fragment>
  );
}
