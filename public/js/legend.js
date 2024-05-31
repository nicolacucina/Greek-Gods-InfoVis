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
      .text("0 - 1.080 K");
  
  popularitylabels
    .append("text")
      .attr("x", gap*2)
      .attr("y", 9+gap)
      .text("1.080 K - 2.740 K");
  
  popularitylabels
    .append("text")
      .attr("x", gap*2)
      .attr("y", 13+gap*2)
      .text("2.740 K - 8.690 K");
  
  popularitylabels
    .append("text")
      .attr("x", gap*2)
      .attr("y", gap*4)
      .text("8.690 K - 196.000 K");

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

};