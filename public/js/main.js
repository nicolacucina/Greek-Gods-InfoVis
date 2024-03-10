import { createLegend } from "/public/js/legend.js";
import { drawPieChart } from "/public/js/piechart.js";
import { drawSunburstChart } from "/public/js/sunburst.js";
import { drawFamilyTree } from "/public/js/familyTree.js";
import { drawBarChart } from "/public/js/barchart.js";

createLegend();

// Draw the PieChart
drawPieChart();

// Draw the Sunburst diagram
drawSunburstChart();

// Draw the Family Tree
drawFamilyTree();

// Draw the Bar Chart
drawBarChart();

