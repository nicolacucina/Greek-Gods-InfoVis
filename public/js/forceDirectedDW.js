//Importa le librerie necessarie
import { loadData } from "../js/load-data.js";

export async function drawForceDirectedGraph() {
  // Caricamento dei dati
  const graph = await loadData("../data/greek-gods.json");

  const edges = await graph.edges;
  const nodes = await graph.nodes;

  // // Larghezza e altezza del contenitore SVG
  const width = 800;
  const height = 600;

  let simulation = null;
  setSimulation(nodes, edges);

  function setSimulation(nodes, edges) {
    simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(edges)
          .id((d) => d.id)
          .distance(150)
      ) // per impostare la distanza desiderata tra i nodi
      .force("charge", d3.forceManyBody().strength(-100)) // per impostare la forza di carica tra i nodi (valori negativi sono attrattivi)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(10)) // per evitare che i nodi si sovrappongano
  }

  // Creazione del contenitore SVG
  const svg = d3.create("svg").attr("width", width).attr("height", height);

  // Creazione del tooltip
  d3.select("#force-directed-graph")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  /* // Creazione della scala di colori
  const colorScale = d3
    .scaleOrdinal()
    .domain([...new Set(graph.nodes.map((d) => d["main-type"]))]) // Dominio con tutti i valori unici di "main-type"
    .range(d3.schemeTableau10); // Scala di colori, personalizzabile (da mettere Rainbow) */
  // Creazione della scala di colori
  const colorMap = {
    god: "rgb(110, 64, 170)",
    titan: "rgb(255, 94, 99)",
    human: "rgb(175, 240, 91)",
    personification: "rgb(26, 199, 194)",
    other: "rgb(110, 64, 170)",
  };

  function color(node) {
    return colorMap[node["main-type"]];
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

  // Prendi nodo centrale, di default Zeus
  const centralNode = graph.nodes.find((node) => node.id === "Zeus");

  // Costruisci l'array dei nodi e dei link da visualizzare

    let currentNodes = getCurrentNodes(centralNode); 
    let currentLinks = getCurrentLinks(currentNodes); 

  updateCurrentNodesAndLinks(centralNode);
  setSimulation(currentNodes, currentLinks);
  drawVisualization(currentNodes, currentLinks);

  // Funzione per disegnare il grafico
  async function drawVisualization(currentNodes, currentLinks) {
    // Aggiunta degli archi.
    // Aggiunta dei collegamenti al grafico
    const link = svg
      .selectAll("line")
      .data(currentLinks)
      .join("line")
      .attr("stroke", "#999") // Colore del collegamento
      .attr("stroke-opacity", 0.6) // Opacità del collegamento
      .attr("stroke-width", 1.5); // Larghezza del collegamento

    //qui mettiamo solo nodi.
    const node = svg
      .selectAll("circle")
      .data(currentNodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", (d) => color(d)) // Colore del nodo
      .attr("stroke", (d) => LightenDarkenColor(color(d), -50)) // Colore del bordo del nodo
      .attr("stroke-width", 1.5) // Larghezza del bordo del nodo
      .call(drag(simulation))
      .on("click", handleNodeClick)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    // Funzione per aggiornare la posizione dei nodi e dei collegamenti
    simulation.on("tick", ticked);
    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    // Funzione per gestire il passaggio del mouse sopra un nodo
    function handleMouseOver(event, hoveredNode) {
      // make radius bigger and show tooltip
      d3.select(this)
        .attr("r", 12)
        .style("cursor", "pointer");

      // show tooltip
      const tooltip = d3.select("#force-directed-graph .tooltip");
      tooltip.transition().duration(500).style("opacity", 0.9);
      tooltip
        .html(tooltipText(hoveredNode))
        .style("left", function () {
          if (hoveredNode.x + 20 + this.clientWidth > width) {
            return hoveredNode.x - 20 - this.clientWidth + "px";
          } else {
            return hoveredNode.x + 20 + "px";
          }
        })
        .style("top", function () {
          if (hoveredNode.y + this.clientHeight > height) {
            return hoveredNode.y + 30 - this.clientHeight + "px";
          } else {
            return hoveredNode.y + "px";
          }
        });
    }

    // Funzione per gestire il passaggio del mouse sopra un nodo
    function handleMouseOut(event, hoveredNode) {
      // make radius normal again and hide tooltip
      d3.select(this).attr("r", 10);

      // hide tooltip
      const tooltip = d3.select("#force-directed-graph .tooltip");
      tooltip.transition().duration(500).style("opacity", 0);

    }

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
      str += "<b>Name:</b> " + beginUpperCase(d.id) + "<br>";
      str += "<b>Sex:</b> " + sexToString(d.sex) + "<br>";
      str += "<b>Type:</b> " + beginUpperCase(d["main-type"]) + "<br>";
      str += "<b>Sub-type:</b> " + beginUpperCase(d["sub-type"]) + "<br>";
      str +=
        "<b>Description:</b> " + beginUpperCase(d["description"]) + "<br>";
      return str;
    }
  }

  // Funzione per cancellare il grafico
  function clearVisualization() {
    svg.selectAll("line").remove();
    svg.selectAll("circle").remove();
  }

  // Aggiunta del Force Directed Graph al contenitore SVG
  const forceDirectedContainer = d3.select("#force-directed-graph");
  forceDirectedContainer.node().appendChild(svg.node());

  // Funzione per gestire il click su un nodo
  function handleNodeClick(event, clickedNode) {
    // Aggiorna i nodi e i collegamenti da visualizzare
    updateCurrentNodesAndLinks(clickedNode);
    //clearVisualization();
    setSimulation(currentNodes, currentLinks);
    drawVisualization(currentNodes, currentLinks);
    //Hide tooltip
    d3.select(this).attr("r", 10);
    const tooltip = d3.select("#force-directed-graph .tooltip");
    tooltip.transition().duration(500).style("opacity", 0);
  }

  // Funzione per gestire l'evento di trascinamento dei nodi
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  function getParents(centralNode) {
    let parents = [];
    for (const edge of edges) {
      if (edge.target.id === centralNode.id) {
        parents.push(edge.source);
      }
    }
    return parents;
  }

  function isParent(node) {
    for (const edge of edges) {
      if (edge.target.id === node.id) {
        return true;
      }
    }
    return false;
  }

  function isChild(node) {
    for (const edge of edges) {
      if (edge.source.id === node.id) {
        return true;
      }
    }
    return false;
  }

  function getChildren(centralNode) {
    let children = [];
    for (const edge of edges) {
      if (edge.source.id === centralNode.id) {
        children.push(edge.target);
      }
    }
    return children;
  }

  function getCurrentNodes(centralNode) {
    let currentNodes = [];
    currentNodes.push(centralNode);
    let parents = getParents(centralNode);
    let children = getChildren(centralNode);
    currentNodes.push(...parents);
    currentNodes.push(...children);
    return currentNodes;
  }

  function getCurrentLinks(currentNodes) {
    let currentLinks = [];
    for (const link of edges) {
      if (
        currentNodes.map((node) => node.id).includes(link.source.id) &&
        currentNodes.map((node) => node.id).includes(link.target.id)
      ) {
        currentLinks.push(link);
      }
    }
    return currentLinks;
  }

function updateCurrentNodesAndLinks(centralNode) {
    let parents = getParents(centralNode);
    let children = getChildren(centralNode);
  
    // Aggiunge solo i nuovi nodi che non sono già presenti
    currentNodes = [...currentNodes, ...parents, ...children].filter(
      (node, index, self) => self.findIndex((n) => n.id === node.id) === index
    );
  
    // Aggiunge solo i nuovi collegamenti che non sono già presenti
    currentLinks = [
      ...currentLinks,
      ...edges.filter(
        (link) =>
          currentNodes.map((node) => node.id).includes(link.source.id) &&
          currentNodes.map((node) => node.id).includes(link.target.id)
      ),
    ].filter(
      (link, index, self) =>
        self.findIndex(
          (l) =>
            l.source.id === link.source.id && l.target.id === link.target.id
        ) === index
    );
  }
  
}