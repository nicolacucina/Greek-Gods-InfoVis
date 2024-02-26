export async function drawBarChart(){
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
