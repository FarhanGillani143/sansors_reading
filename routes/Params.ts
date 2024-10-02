export type AccelerationParams = {
  /**
   * Specifies whether the graph will display real-time tracking data or
   * use pre-recorded data for visualization.
   *
   * - `"real-time"`: The graph will show live sensor data updates.
   * - `"general"`: The graph will display data from previously recorded sessions.
   */
  graphType: "real-time" | "general";
};
