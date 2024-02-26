import { loadData } from "../js/load-data.js";

// Funzione principale asincrona
export async function drawSunburstChart() {

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
