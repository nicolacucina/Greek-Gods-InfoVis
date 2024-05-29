const createLegend = () => {
  // Main Types
  const mainTypeLegend = d3.select(".legend-main-types")
    .append("ul")
    .selectAll(".legend-main-type")
    .data(main_types)
    .join("li")
    .attr("class", "legend-main-type");

  mainTypeLegend
    .append("span")
    .attr("class", "legend-main-type-color")
    .style("background-color", d => d.color);

  mainTypeLegend
    .append("span")
    .attr("class", "legend-main-type-label")
    .text(d => d.type);

  // Popularity
  const popularityLegend = d3.select(".legend-popularity")
    .append("svg")
      .attr("viewBox", "0 0 340 110")
    .append("g")
      .attr("transform", "translate(1, 10)");

  const popularityCircles = popularityLegend 
    .append("g")
      .attr("fill", "transparent")
      .attr("stroke", "#272626");

  const gap = 20;
  popularityCircles
    .append("circle")
      .attr("cx", 13)
      .attr("cy", 7)
      .attr("r", 7);

  popularityCircles
    .append("circle")
      .attr("cx", 13)
      .attr("cy", 7+gap)
      .attr("r", 9);

  popularityCircles
    .append("circle")
      .attr("cx", 13)
      .attr("cy", 11+gap*2)
      .attr("r", 11);

  popularityCircles
  .append("circle")
    .attr("cx", 13)
    .attr("cy", 19+gap*3)
    .attr("r", 13);
  
  const popularitylabels = popularityLegend
    .append("g")
      .attr("fill", "#272626")
      .attr("dominant-baseline", "middle");

  popularitylabels
    .append("text")
      .attr("x", gap*2)
      .attr("y", 9)
      .text("0 - 1.080.000");
  
  popularitylabels
    .append("text")
      .attr("x", gap*2)
      .attr("y", 9+gap)
      .text("1.080.000 - 2.740.000");
  
  popularitylabels
    .append("text")
      .attr("x", gap*2)
      .attr("y", 13+gap*2)
      .text("2.740.000 - 8.690.000");
  
  popularitylabels
    .append("text")
      .attr("x", gap*2)
      .attr("y", gap*4)
      .text("8.690.000 - 196.000.000");

  // Link Types
  const linkTypeLegend = d3.select(".legend-link-types")
    .append("ul")
    .selectAll(".legend-link-type")
    .data(link_types)
    .join("li")
    .attr("class", "legend-link-type");

  linkTypeLegend
    .append("span")
    .attr("class", "legend-link-type-color")
    .style("background-color", d => d.color);

  linkTypeLegend
    .append("span")
    .attr("class", "legend-link-type-label")
    .text(d => d.type);

    
  // Circle radius
  const linesMax = 600;
  const linesMedium = 200;
  const linesMin = 30;
  const maxRadius = getRadius(linesMax, linesMax);
  const mediumRadius = getRadius(linesMax, linesMedium);
  const minRadius = getRadius(linesMax, linesMin);
  const legendRadius = d3.select(".legend-radius")
    .append("svg")
      .attr("viewBox", "0 0 260 200")
    .append("g")
      .attr("transform", "translate(1, 10)");
  const legendCircles = legendRadius 
    .append("g")
      .attr("fill", "transparent")
      .attr("stroke", "#272626");
  legendCircles
    .append("circle")
      .attr("cx", maxRadius)
      .attr("cy", maxRadius)
      .attr("r", maxRadius);
  legendCircles
    .append("circle")
      .attr("cx", maxRadius)
      .attr("cy", 2*maxRadius - mediumRadius)
      .attr("r", mediumRadius);
  legendCircles
    .append("circle")
      .attr("cx", maxRadius)
      .attr("cy", 2*maxRadius - minRadius)
      .attr("r", minRadius);

  const linesLength = 100;
  const legendLines = legendRadius
    .append("g")
      .attr("stroke", "#272626")
      .attr("stroke-dasharray", "6 4");
  legendLines
    .append("line")
      .attr("x1", maxRadius)
      .attr("y1", 0)
      .attr("x2", maxRadius + linesLength)
      .attr("y2", 0);
  legendLines
    .append("line")
      .attr("x1", maxRadius)
      .attr("y1", 2*maxRadius - 2*mediumRadius)
      .attr("x2", maxRadius + linesLength)
      .attr("y2", 2*maxRadius - 2*mediumRadius);
  legendLines
    .append("line")
      .attr("x1", maxRadius)
      .attr("y1", 2*maxRadius - 2*minRadius)
      .attr("x2", maxRadius + linesLength)
      .attr("y2", 2*maxRadius - 2*minRadius);

  const labels = legendRadius
    .append("g")
      .attr("fill", "#272626")
      .attr("dominant-baseline", "middle");
  labels
    .append("text")
      .attr("x", maxRadius + linesLength + 5)
      .attr("y", 0)
      .text(linesMax);
  labels
    .append("text")
      .attr("x", maxRadius + linesLength + 5)
      .attr("y", 2*maxRadius - 2*mediumRadius)
      .text(linesMedium);
  labels
    .append("text")
      .attr("x", maxRadius + linesLength + 5)
      .attr("y", 2*maxRadius - 2*minRadius)
      .text(linesMin);

};