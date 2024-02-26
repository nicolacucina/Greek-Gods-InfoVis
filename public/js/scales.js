//il precedente: import { scaleRadial, scaleOrdinal, scaleLinear } from "d3-scale";
//import { scaleRadial, scaleOrdinal } from "/node_modules/d3-scale/dist/d3-scale.js";
import { main_types } from "../js/helper.js";

export const getRadius = (maxLines, lines) => {
  const radialScale = d3.scaleRadial()
    .domain([0, maxLines])
    .range([0, 60]);

  return radialScale(lines);
};

export const colorScale = d3.scaleOrdinal()
  .domain(main_types.map(type => type.type))
  .range(main_types.map(type => type.color));
