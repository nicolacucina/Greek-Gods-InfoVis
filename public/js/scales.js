const getRadius = (maxLines, lines) => {
  const radialScale = d3.scaleRadial()
    .domain([0, maxLines])
    .range([0, 60]);

  return radialScale(lines);
};

const colorScale = d3.scaleOrdinal()
  .domain(main_types.map(type => type.type))
  .range(main_types.map(type => type.color));
