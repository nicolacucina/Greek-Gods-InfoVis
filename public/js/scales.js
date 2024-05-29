const colorScale = d3.scaleOrdinal()
  .domain(main_types.map(type => type.type))
  .range(main_types.map(type => type.color));
