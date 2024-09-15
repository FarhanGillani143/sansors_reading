import { curveBasis, line, scaleLinear, scaleTime } from "d3";
import { SensorDataType } from "../types/DataTypes";

type GraphValues = {
  data: SensorDataType[];
  height: number;
  width: number;
};

export function makeGraph({ data, height, width }: GraphValues) {
  if (data.length > 0) {
    const max = Math.max(
      ...data.map((log) => (log.accelerationData ? log.accelerationData.x : 0))
    );

    const y = scaleLinear().domain([0, max]).range([height, 35]);

    const sessionStartTime = data[0].timeDateObject;
    const sessionEndTime = data[data.length - 1].timeDateObject;

    const x = scaleTime()
      .domain([sessionStartTime, sessionEndTime])
      .range([10, width - 10]);

    const curvedLine = line<SensorDataType>()
      .x((d) => x(d.timeDateObject))
      .y((d) => y(d.accelerationData?.x!))
      .curve(curveBasis)(data);

    return {
      max: max,
      curve: curvedLine!,
    };
  } else return null;
}
