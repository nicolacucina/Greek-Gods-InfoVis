import { loadData } from "../js/load-data.js";

//PIE CHART
// Funzione principale asincrona
export async function drawPieChart() {
  // Caricamento dei dati
  const godsData = await loadData("/public/data/greek-gods.json");

  const nodes = godsData.nodes;
  // Calcolo del numero di divinità maschili e femminili
  const total = nodes.length;
  const males = nodes.filter(d => d.sex === "M").length;
  const females = nodes.filter(d => d.sex === "F").length;
  const unknown = total - males - females;

  // Dati per il pie chart
  const data = [
    { name: "Male", value: males },
    { name: "Female", value: females },
    { name: "Unknown", value: unknown}
  ];

  const width = 150;
  const height = 150;
  const radius = Math.min(width, height) / 2;
  console.log(radius);
  
  // Creazione del pie chart
  const pie = d3.pie().sort(null).value(d => d.value);
  const arcs = pie(data);
  
  const colorScale = d3.scaleOrdinal().domain(data.map(d => d.name)).range(["#00b4d8", "#ff70a6", "#999d9e"]); // male, female, unknown
  // decommentare se si vuole usare una scala radiale come per sunburst: const colorScale = d3.scaleOrdinal()
  //   .domain(data.map(d => d.name))
  //   .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

  const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);

  // Creazione del contenitore SVG per il pie chart
  //  const svg = d3.create("svg").attr("viewBox", [-width, -height, width*2, height*2]);
  const svg = d3.create("svg").attr("viewBox", [-width+50, -height, width+50, height+100]);

  // Aggiunta delle fette del pie chart
  svg.append("g")
    .attr("stroke", "white")
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr("fill", d => colorScale(d.data.name))
    .attr("d", arc)
    .append("title");
    //.text(d => `${d.data.name}: ${((d.data.value / total) * 100).toFixed(2)}%`);

  // Aggiunta delle etichette al pie chart
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
  
  // Aggiunta del tooltip
  /* const tooltip = d3.select("#pie-chart")
  .append("div")
  .attr("class", "tooltip")  // Aggiungi la classe "tooltip" al tooltip
  .style("opacity", 0); */

  /* svg.selectAll("path")
    .on("mouseover", function (event, d) {
      const percent = ((d.data.value / total) * 100).toFixed(2);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`${d.data.name}: ${percent}%`)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      tooltip.transition().duration(500).style("opacity", 0);
    }); */

  // // Aggiunta della legenda
  // const piechar_legend = svg.selectAll('.piechart-legend')
  //   .data(data.map(d => d.name))
  //   .enter()
  //   .append('g')
  //   .attr('class', 'piechart-legend')
  //   .attr('transform', (d, i) => `translate(-20,${i * 10})`);

  // piechar_legend.append('rect')
  //   .attr('width', 5)
  //   .attr('height', 5)
  //   .style('fill', d => colorScale(d));

  // piechar_legend.append('text')
  //   .attr('x', 30)
  //   .attr('y', 9)
  //   .attr('dy', '.35em')
  //   .style('text-anchor', 'start')
  //   .text(d => d);

  // Aggiunta del pie chart al documento HTML
  const pieChartContainer = d3.select("#pie-chart");
  pieChartContainer.node().appendChild(svg.node());
}

// Chiamata alla funzione principale, ma non serve o duplica piechart
//drawPieChart();
