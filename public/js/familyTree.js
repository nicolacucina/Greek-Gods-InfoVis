async function drawFamilyTree() {
  d3.json("./public/data/family-tree-dataset.json", (d) => {
  }).then((treeData) => {
    createViz(treeData);
  });
  const createViz = (treeData) => { 
    const stratify = d3.graphStratify();
    const dag = stratify(treeData);

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
    const links = dag.links();

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
}