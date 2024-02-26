//import { createLegend } from "/public/js/legend.js";
//import { loadData } from "/public/js/load-data.js";
//import { drawPieChart } from "/public/js/piechart.js";
//import { drawSunburstChart } from "/public/js/sunburst.js";
//import { drawForceDirectedGraph } from "/public/js/forceDirected.js";
//import { drawFamilyTree } from "/public/js/familyTree.js";
//import { drawBarChart } from "/public/js/barchart.js";

//////////////////////////////// load-data.js //////////////////////////////////////////////////////////

export async function loadData(path) {
    try {
      const response = await fetch(path);
      const data = await response.json();
      return data
    } catch (error) {
      console.error("Errore nel caricamento dei dati", error);
    }
  }

//////////////////////////////// helper.js //////////////////////////////////////////////////////////////

/*export*/ const main_types = [
    { type: "Titan", color: "#ff5e63", order: 1 },
    { type: "God", color: "#6e40aa", order: 2 },
    { type: "Human", color: "#aff05b", order: 3 },
    { type: "Personification", color: "#1ac7c2", order: 4 },
  ];
  
/*export*/ const link_types = [
    { type: "Male Child", color: "#00b4d8", order: 1 },
    { type: "Female Child", color: "#ff70a6", order: 2 },
    { type: "Genderless Child", color: "#999d9e", order: 3 },
  ];
  

/////////////////////////// scales.js ///////////////////////////////////////////////////////////////

//il precedente: import { scaleRadial, scaleOrdinal, scaleLinear } from "d3-scale";
//import { scaleRadial, scaleOrdinal } from "/node_modules/d3-scale/dist/d3-scale.js";
//import { main_types } from "../js/helper.js";

/*export*/ const getRadius = (maxLines, lines) => {
  const radialScale = d3.scaleRadial()
    .domain([0, maxLines])
    .range([0, 60]);

  return radialScale(lines);
};

/*export*/ const colorScale = d3.scaleOrdinal()
  .domain(main_types.map(type => type.type))
  .range(main_types.map(type => type.color));


/////////////////////////////////// legends.js //////////////////////////////////////////////////////////

//import { select } from "d3-selection";
//import { main_types, link_types } from "../js/helper.js";
//import { getRadius } from "../js/scales.js";

/*export*/ const createLegend = () => {
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


////////////////////////////////////// barchart.js //////////////////////////////////////////////////////////

/*export*/ async function drawBarChart(){
    // Append a SVG container
    const svg = d3
    .select(".bar-chart-container")
    .append("svg")
    .attr("viewBox", "0 0 600 700");

    d3.csv("/public/data/greek-gods-popularity.csv", (d) => {
        return {
            name: d.name,
            popularity: +d.popularity,
        };
    }).then((data) => {
    //console.log(data);
    
    data.sort((a, b) => b.popularity - a.popularity);
    //take the 30 most popular
    data = data.slice(0, 30);

    d3.max(data, (d) => d.popularity);
    //console.log(d3.max(data, (d) => d.popularity));  
    d3.min(data, (d) => d.popularity);
    //console.log(d3.min(data, (d) => d.popularity));
    d3.extent(data, (d) => d.popularity);
    //console.log(d3.extent(data, (d) => d.popularity));

    //data.sort((a, b) => b.popularity - a.popularity);
    
    createViz(data);
    });

    const createViz = (data) => {
    const xScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.popularity)]).range([0, 450]);
    const yScale = d3
        .scaleBand()
        .domain(data.map((d) => d.name))
        .range([0, 700])
        .padding(0.2);

    const barAndLabel = svg
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (d) => `translate(0, ${yScale(d.name)})`);
    //bars
    barAndLabel
        .append("rect")
        .attr("width", (d) => xScale(d.popularity))
        .attr("height", yScale.bandwidth())
        .attr("x", 80)
        .attr("y", 0)
        .attr("fill", (d) => (d.name === "Zeus" ? "orange" : "teal"));
    //names
    barAndLabel
        .append("text")
        .text((d) => d.name)
        .attr("x", 70)
        .attr("y", 12)
        .attr("text-anchor", "end")
        .style("font-family", "sans-serif")
        .style("font-size", "16px");
    //popularity number
    barAndLabel
        .append("text")
        .text((d) => d.popularity)
        .attr("x", (d) => 80 + xScale(d.popularity) + 4)
        .attr("y", 12)
        .style("font-family", "sans-serif")
        .style("font-size", "9px");
    //separator
    svg
        .append("line")
        .attr("x1", 80)
        .attr("y1", 0)
        .attr("x2", 80)
        .attr("y2", 700)
        .attr("stroke", "black");
    };
}

////////////////////////////////////// piechart.js //////////////////////////////////////////////////////////

//import { loadData } from "../js/load-data.js";

//PIE CHART
// Funzione principale asincrona
/*export*/ async function drawPieChart() {
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
  //console.log(radius);
  
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

////////////////////////////////////// sunburst.js //////////////////////////////////////////////////////////

//import { loadData } from "../js/load-data.js";

// Funzione principale asincrona
/*export*/ async function drawSunburstChart() {

    // Importazione del JSON organizzato in modo gerarchico
    const data = await loadData("/public/data/greek-gods-hierarchy.json");

    // Dimensioni del contenitore SVG
    const width = 500;
    const height = width;
    const radius = width / 10;

    // Creazione della scala di colori
    //const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    const colorMap = {
        god: "rgb(110, 64, 170)",
        titan: "rgb(255, 94, 99)",
        human: "rgb(175, 240, 91)",
        personification: "rgb(26, 199, 194)",
        other: "rgb(110, 64, 170)",
      };

    function color(d) {
        return colorMap[d.data.name];
    }
    

    // Creazione della gerarchia
    const hierarchy = d3.hierarchy(data)
        /* .sum(d => d.popularity + 1) // Assumiamo che "popularity" sia la proprietà da sommare
        .sort((a, b) => b.value - a.value); */
        //based on count
        .count()
        .sort((a, b) => b.height - a.height || b.value - a.value);
    const root = d3.partition()
        .size([2 * Math.PI, hierarchy.height + 1])
        (hierarchy);
    root.each(d => d.current = d);

    // Creazione del contenitore SVG per il sunburst diagram
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    // Creazione del contenitore SVG per il sunburst diagram
    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, width])
        .style("font", "7px sans-serif")
        .style("margin-top", -width / 2 + 100 + "px")
        .style("margin-bottom", -width / 2 + 100 + "px")
    

    // Aggiunta degli archi.
    const path = svg.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
        .attr("d", d => arc(d.current));

    // Resa degli archi interattivi se hanno figli, aggiunta delle etichette e del cerchio centrale.
    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    const format = d3.format(",d");
    path.append("title")
        /* .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`); */
        .text(d => `${d.ancestors().map(d => d.data.name.charAt(0).toUpperCase() + d.data.name.slice(1)).reverse().slice(1).join(", ")}`);

    const label = svg.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    const parent = svg.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    // Gestione dello zoom on click.
    function clicked(event, p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        const t = svg.transition().duration(750);

        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")
            .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 0 && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 0 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    //document.body.appendChild(svg.node());


    // Aggiunta del sunburst diagram al documento HTML
    const sunburstChartContainer = d3.select("#sunburst-chart");
    sunburstChartContainer.node().appendChild(svg.node());
}



////////////////////////////////////// familyTree.js //////////////////////////////////////////////////////////

//import { loadData } from "./load-data.js";

/*export*/ async function drawFamilyTree() {
  const data = await loadData("/public/data/family-tree-dataset.json");

  const stratify = d3.graphStratify();
  const dag = stratify(data);

  const svgContainter = d3.select("#family-tree");

  const width = svgContainter.node().clientWidth - 30;
  const height = 1000;

  const nodeRadius = 7;
  const nodeRadiusMap = {
    0: 7,
    1: 9,
    2: 11,
    3: 13,
  };
  const nodeSize = [nodeRadius * 2, nodeRadius * 2];
  const line = d3.line().curve(d3.curveBumpY);
  //const line = d3.line().curve(d3.curveMonotoneY);
  //const line = d3.line().curve(d3.curveCatmullRom);
  //const line = d3.line().curve(d3.curveBasis);
  const size = d3.tweakSize({ width, height });
  const shape = d3.tweakShape(nodeSize, d3.shapeEllipse);

  // Creazione della scala di colori
  const colorMap = {
    god: "rgb(110, 64, 170)",
    titan: "rgb(255, 94, 99)",
    human: "rgb(175, 240, 91)",
    personification: "rgb(26, 199, 194)",
    other: "rgb(110, 64, 170)",
  };

  function color(d) {
    return colorMap[d.data["main-type"]];
  }

  function LightenDarkenColor(col, val) {
    const rgbValues = col.match(/\d+/g).map(Number);
    val = parseInt(val);
    // Adjust each RGB component based on val
    const adjustedColor = rgbValues.map((component) => {
      const newValue = component + val;
      return newValue < 0 ? 0 : newValue > 255 ? 255 : newValue;
    });
    // Return the adjusted color in the format "rgb(r, g, b)"
    return `rgb(${adjustedColor[0]}, ${adjustedColor[1]}, ${adjustedColor[2]})`;
  }

  const layout = d3
    .sugiyama()
    //.layering(d3.layeringSimplex()) //fa schifo
    //.layering(d3.layeringTopological()) //crasha
    .layering(d3.layeringLongestPath().topDown(true))
    //.decross(d3.decrossTwoLayer())
    .decross(d3.decrossTwoLayer().order(d3.twolayerAgg()))
    //.decross(d3.decrossOpt().dist(true)) //crasha
    //.coord(d3.coordSimplex().weight([8, 5, 1])) //brutto
    .coord(d3.coordSimplex().weight([1, 2, 8]))
    //.coord(d3.coordQuad().vertStrong(1)) //lento
    .nodeSize(nodeSize)
    .gap([nodeRadius, 70])
    .tweaks([size, shape]);

  layout(dag);

  const nodes = dag.nodes();
  const links = await dag.links();

  const svg = d3
    .create("svg")
    .style("font", "8px sans-serif")
    .attr("width", width + 40)
    .attr("height", height + 60);

  // Draw links
  svg
    .append("g")
    .attr("id", "links")
    .attr("transform", "translate(0, 50)")
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("id", (d) => d.source.data.id + "-" + d.target.data.id)
    .attr("fill", "none")
    //If sex is M, the line is blue, otherwise it is red
    .attr("stroke", (d) => {
      if (d.target.data.sex === "M") {
        return "#00b4d8";
      } else if (d.target.data.sex === "F") {
        return "#ff70a6";
      } else {
        return "#6c757d";
      }
    })
    .attr("stroke-width", 1)
    .attr("d", ({ points }) => line(points));

  // Draw nodes
  const nodeGroup = svg
    .append("g")
    .attr("id", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("id", (d) => d.data.id)
    .attr("transform", (d) => `translate(${d.x},${d.y + 50})`);

  nodeGroup
    .append("circle")
    .attr("r", (d) => nodeRadiusMap[d.data["popularity"]])
    .attr("fill", (d) => color(d))
    .attr("stroke", (d) =>
      LightenDarkenColor(color(d), -100)
    )
    .attr("stroke-width", 1);

  nodeGroup
    .append("text")
    .text((d) => d.data.id)
    .attr("text-anchor", "start")
    .attr("dy", "-1em")
    .attr("dx", "0.8em")
    .attr("fill", "black")
    .attr("transform", "rotate(-45)")
    .style("font-size", "14px");

  // Tooltip
  d3.select("#family-tree")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function beginUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function sexToString(str) {
    if (str === "M") return "Male";
    else if (str === "F") return "Female";
    else return "Unknown";
  }

  function tooltipText(d) {
    let str = "";
    //HTML
    str += "<b>Name:</b> " + beginUpperCase(d.data.id) + "<br>";
    str += "<b>Sex:</b> " + sexToString(d.data.sex) + "<br>";
    str += "<b>Popularity:</b> " + readable(d.data["popularity-value"]) + "<br>";
    str += "<b>Type:</b> " + beginUpperCase(d.data["main-type"]) + "<br>";
    str += "<b>Sub-type:</b> " + beginUpperCase(d.data["sub-type"]) + "<br>";
    str +=
      "<b>Description:</b> " + beginUpperCase(d.data["description"]) + "<br>";
    str += "<b>Parents:</b> " + d.data.parentIds.join(", ") + "<br>";
    return str;
  }

  function readable(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Interactions

  // When the mouse is over a node's circle, make it slightly bigger
  nodeGroup.selectAll("circle").on("mouseover", function (event, d) {
    d3.select(this)
      .attr("r", (d) => nodeRadiusMap[d.data["popularity"]] + 2)
      .style("cursor", "pointer");

    // Show tooltip
    const tooltip = d3.select("#family-tree .tooltip");
    tooltip.transition().duration(500).style("opacity", 0.9);
    tooltip
      .html(tooltipText(d))
      //If tooltip is too close to the border, move it to the left
      .style("left", function () {
        if (d.x + 20 + this.clientWidth > width) {
          return d.x - 20 - this.clientWidth + "px";
        } else {
          return d.x + 20 + "px";
        }
      })
      .style("top", function () {
        if (d.y + 20 + this.clientHeight > height) {
          return d.y + 50 - this.clientHeight + "px";
        } else {
          return d.y + 20 + "px";
        }
      });
  });

  // When the mouse is out of a node's circle, make it normal size
  nodeGroup.selectAll("circle").on("mouseout", function (event, d) {
    d3.select(this).attr("r", (d) => nodeRadiusMap[d.data["popularity"]]);

    // Hide tooltip
    const tooltip = d3.select("#family-tree .tooltip");
    tooltip.transition().duration(500).style("opacity", 0);
  });

  let selectedNodes = [];
  nodeGroup.selectAll("circle").on("click", function (event, d) {
    const gNode = d3.select(this.parentNode);
    //If clicked on a selected node, unselect all selected nodes and remove transparency from all nodes and links
    //Otherwise, select it.
    //At any time, there can be at most two selected nodes, so if a third node is selected, unselect the first one.
    if (gNode.classed("selected")) {
      nodeGroup.classed("selected", false);
      nodeGroup.classed("transparent", false);
      svg.selectAll("path").classed("transparent", false);
      selectedNodes = [];
      return;
    } else {
      // If there are already two selected nodes, unselect the first one
      if (selectedNodes.length === 2) {
        const firstSelectedNode = selectedNodes[0];
        const firstSelectedNodeG = d3.select("#" + firstSelectedNode.data.id);
        firstSelectedNodeG.classed("selected", false);
        selectedNodes.shift();
      }
      // Select the clicked node
      gNode.classed("selected", true);
      selectedNodes.push(d);
    }

    if (selectedNodes.length === 1) {
      // Show close relatives
      const relatives = getCloseRelatives(d);
      highlight(relatives)
    } else if (selectedNodes.length === 2) {
      // Show LCA and path
      const lca = LCA(selectedNodes[0], selectedNodes[1]);
      //if lca is empty, show a dialog and empty selectedNodes
      if (lca.length === 0) {
        const dialog = d3.select("dialog");
        dialog.node().showModal();
        nodeGroup.classed("selected", false);
        nodeGroup.classed("transparent", false);
        svg.selectAll("path").classed("transparent", false);
        selectedNodes = [];
        return;
      }
      const path1 = getPath(lca[0], selectedNodes[0]);
      const path2 = getPath(lca[0], selectedNodes[1]);
      const path = concatPath(path1, path2);
      highlight(path);
    } else {
      // No nodes selected
      nodeGroup.classed("transparent", false);
      svg.selectAll("path").classed("transparent", false);
    }
  });

  svgContainter.node().appendChild(svg.node());

  // HELP FUNCTIONS

  function getCloseRelatives(d) {
    let nodes = [];
    let links = [];

    // Get parents
    const parents = d.data.parentIds;
    for (const parent of parents) {
      nodes.push(parent);
      links.push(parent + "-" + d.data.id);
    }

    // Get children
    for (const link of dag.links()) {
      if (link.source.data.id === d.data.id) {
        nodes.push(link.target.data.id);
        links.push(link.source.data.id + "-" + link.target.data.id);
      }
    }

    // Add the node itself
    nodes.push(d.data.id);

    return { nodes, links };
  }

  function getNodeById(nodeId) {
    const nodes = dag.nodes();
    for (const node of nodes) {
      if (node.data.id === nodeId) return node;
    }
  }

  function getParentNodes(d) {
    const parents = [];
    for (const parentId of d.data.parentIds) {
      parents.push(getNodeById(parentId));
    }
    return parents;
  }

  function getChildrenNodes(d) {
    const children = [];
    for (const link of dag.links()) {
      if (link.source.data.id === d.data.id) {
        children.push(link.target);
      }
    }
    return children;
  }

  function LCA(d1, d2) {
    // ALGORITHM TO FIND THE LOWEST COMMON ANCESTOR OF TWO NODES IN A DAG
    // LINK: https://www.baeldung.com/cs/lowest-common-ancestor-acyclic-graph
    //Find all ancestors of d1
    const d1Ancestors = [];
    let d1ParentNodes = getParentNodes(d1);
    while (d1ParentNodes.length !== 0) {
      d1Ancestors.push(...d1ParentNodes);
      d1ParentNodes = d1ParentNodes.flatMap((n) => getParentNodes(n));
    }

    //Find all ancestors of d2
    const d2Ancestors = [];
    let d2ParentNodes = getParentNodes(d2);
    while (d2ParentNodes.length !== 0) {
      d2Ancestors.push(...d2ParentNodes);
      d2ParentNodes = d2ParentNodes.flatMap((n) => getParentNodes(n));
    }

    //Find the intersection of the two arrays
    let intersection = d1Ancestors.filter((n) =>
      d2Ancestors.some((m) => m.data.id === n.data.id)
    );
    //Remove duplicates
    intersection = intersection.filter(
      (n, index) =>
        intersection.findIndex((m) => m.data.id === n.data.id) === index
    );

    //Consider the induced subgraph of the intersection
    const subgraphNodes = intersection;
    const subgraphLinks = [];
    for (const link of dag.links()) {
      if (
        subgraphNodes.some((n) => n.data.id === link.source.data.id) &&
        subgraphNodes.some((n) => n.data.id === link.target.data.id)
      ) {
        subgraphLinks.push(link);
      }
    }

    //Find the nodes with zero out-degree,
    //i.e. the nodes for which there are no links with them as source
    const nodesWithZeroOutDegree = [];
    for (const node of subgraphNodes) {
      let bool = true;
      for (const link of subgraphLinks) {
        if (link.source.data.id === node.data.id) {
          bool = false;
          break;
        }
      }
      if (bool) nodesWithZeroOutDegree.push(node);
    }

    return nodesWithZeroOutDegree;
  }

  function getPath(ancestor, node) {
    // Find the path from the ancestor to the node
    const currentNode = node;
    if (currentNode.data.id === ancestor.data.id)
      return { nodes: [currentNode], links: [] };
    for (const parent of getParentNodes(currentNode)) {
      const path = getPath(ancestor, parent);
      if (path !== null) {
        path.nodes.push(currentNode);
        path.links.push(parent.data.id + "-" + currentNode.data.id);
        return path;
      }
    }
    return null;
  }

  function concatPath(path1, path2) {
    // Concatenate two paths
    const nodes = path1.nodes.concat(path2.nodes);
    const links = path1.links.concat(path2.links);
    return { nodes, links };
  }

  function highlightNodes(nodes) {
    // Highlight the nodes
    //const nodeIds = nodes.map((n) => n.data.id);
    //If nodes are just strings, use them directly, otherwise get their ids
    const nodeIds = nodes.map((n) => (typeof n === "string" ? n : n.data.id));
    // Highlight nodes
    nodeGroup.classed("transparent", function (n) {
      return nodeIds.indexOf(n.data.id) === -1;
    });
  }

  function highlightLinks(links) {
    // Highlight the links
    svg.selectAll("path").classed("transparent", function (l) {
      return links.indexOf(l.source.data.id + "-" + l.target.data.id) === -1;
    });
  }

  function highlight(path) {
    highlightNodes(path.nodes);
    highlightLinks(path.links);
  }
}


createLegend();

// Load data

const godsData = await loadData("/public/data/greek-gods.json");

// Draw the PieChart
drawPieChart();

// Draw the Sunburst diagram
drawSunburstChart();

// Draw the Family Tree
drawFamilyTree();

// // Draw the network
//drawForceDirectedGraph();

// Draw the Bar Chart
drawBarChart();

