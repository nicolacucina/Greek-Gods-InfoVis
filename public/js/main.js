import { createLegend } from "/public/js/legend.js";
import { loadData } from "/public/js/load-data.js";
import { drawPieChart } from "/public/js/piechart.js";
import { drawSunburstChart } from "/public/js/sunburst.js";
import { drawForceDirectedGraph } from "/public/js/forceDirected.js";
import { drawFamilyTree } from "/public/js/familyTree.js";
import { drawBarChart } from "/public/js/barchart.js";

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
drawForceDirectedGraph();

// Draw the Bar Chart
drawBarChart();

