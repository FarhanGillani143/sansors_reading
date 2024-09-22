import { Dimensions } from "react-native";

const Y_AXIS_COLOR = "maroon";
const X_AXIS_COLOR = "crimson";

const X_ACCELERATION_COLOR = "blue";
const Y_ACCELERATION_COLOR = "green";
const Z_ACCELERATION_COLOR = "red";

const MARGIN_TOP = 10;
const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 30;
const MARGIN_BOTTOM = 50;

// Set SVG height and width based on device screen dimensions
const SVG_HEIGHT = 350;
const SVG_WIDTH = Dimensions.get("window").width;

// Calculate graph dimensions by subtracting space for labels
const GRAPH_HEIGHT = SVG_HEIGHT - MARGIN_BOTTOM; // Margin for labels at the bottom
const GRAPH_WIDTH = SVG_WIDTH - MARGIN_RIGHT; // Margin for graph on the right

const X_AXIS_RANGE = [MARGIN_LEFT, GRAPH_WIDTH];
const Y_AXIS_RANGE = [GRAPH_HEIGHT, MARGIN_TOP];

export {
  Y_AXIS_COLOR,
  X_AXIS_COLOR,
  X_ACCELERATION_COLOR,
  Y_ACCELERATION_COLOR,
  Z_ACCELERATION_COLOR,
  MARGIN_TOP,
  MARGIN_LEFT,
  MARGIN_RIGHT,
  MARGIN_BOTTOM,
  SVG_WIDTH,
  SVG_HEIGHT,
  GRAPH_WIDTH,
  GRAPH_HEIGHT,
  X_AXIS_RANGE,
  Y_AXIS_RANGE,
};
