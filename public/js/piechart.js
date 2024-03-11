async function drawPieChart() {
  d3.json("./public/data/greek-gods-sex.json", (d) => {
  }).then((pieChartData) => {
    createPieChart(pieChartData);
  });
  const createPieChart = (pieChartData) => {
    const total = pieChartData.length;
    const males = pieChartData.filter(d => d.sex === "M").length;
    const females = pieChartData.filter(d => d.sex === "F").length;
    const unknown = total - males - females;

    const data = [
      { name: "Male", value: males },
      { name: "Female", value: females },
      { name: "Unknown", value: unknown}
    ];

    const width = 150;
    const height = 150;
    const radius = Math.min(width, height) / 2;
    console.log(radius);
    
    const pie = d3.pie().sort(null).value(d => d.value);
    const arcs = pie(data);
    
    const colorScale = d3.scaleOrdinal().domain(data.map(d => d.name)).range(["#00b4d8", "#ff70a6", "#999d9e"]); // male, female, unknown
    const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);

    const svg = d3.create("svg").attr("viewBox", [-width+50, -height, width+50, height+100]);

    // Piechart slices
    svg.append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", d => colorScale(d.data.name))
      .attr("d", arc)
      .append("title");
      //.text(d => `${d.data.name}: ${((d.data.value / total) * 100).toFixed(2)}%`);

    // Labels
    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 6)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => `${((d.data.value / total) * 100).toFixed(2)}%`));

    const pieChartContainer = d3.select("#pie-chart");
    pieChartContainer.node().appendChild(svg.node());
  }
}
