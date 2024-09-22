import React from "react";
import { Text as SVGText } from "react-native-svg";
import { SensorDataType } from "../../../types/DataTypes";
import { GRAPH_HEIGHT, GRAPH_WIDTH, X_AXIS_COLOR } from "./Contants";

interface Props {
  sensorData: SensorDataType;
}

export default function DateLabel({ sensorData }: Props) {
  return (
    <SVGText
      x={GRAPH_WIDTH / 2} // Center the date label
      y={GRAPH_HEIGHT + 40} // Position below X-axis labels
      fontSize="14"
      fill={X_AXIS_COLOR}
      textAnchor="middle" // Center-align the text
    >
      {sensorData.timeDateObject.toLocaleDateString([], {
        dateStyle: "full", // Format the date in full
      })}
    </SVGText>
  );
}
