import React, { useContext } from "react";
import { Card } from "antd";
import { Layout } from "antd"; // Ant Design components
import OrgChartTree from "./ChartGoals"; // Adjust the path if necessary
import { DataContext } from "./dataProcess/dataContext";

const { Header, Sider, Content, Footer } = Layout;

// Phase color mapping
const phaseColors = {
  "Pre-Induction": "#98FB98", // Light green
  Induction: "#ADD8E6", // Light blue
  Intensification: "#FFA07A", // Light salmon
  Consolidation: "#FA8072", // Salmon
  Root: "#FFFFFF", // White for root or other uncolored phases
};

const OrgChartV1 = () => {
  const { data_global, updateDataGlobal, node_displayed, refresh_key } =
    useContext(DataContext);

  // Function to render phase background color
  const renderPhaseBackground = (phase) => {
    console.log("Rendering phase:", phase);
    // Get the color for the current phase, defaulting to white if not found
    return phaseColors[phase] || "#FFFFFF";
  };

  // Recursive function to render each phase and its children with backgrounds
  const renderPhasesWithBackgrounds = (treeData) => {
    // Ensure treeData is an array and is not empty
    if (!Array.isArray(treeData) || treeData.length === 0) return null;

    return treeData.map((node) => {
      console.log("Rendering node:", node); // Debugging to check if each node is processed

      return (
        <div
          key={node.uid}
          style={{
            backgroundColor: renderPhaseBackground(node.phase) + " !important", // Add !important to enforce the background color
            padding: "20px",
            margin: "10px 0",
            borderRadius: "8px",
          }}
        >
          <h3>{node.Title}</h3>
          <p>{node.Summary}</p>
          {/* Recursive call for children */}
          {node.children && node.children.length > 0 && (
            <OrgChartTree
              width="1800px"
              height="1800px"
              treeData={node.children} // Pass node.children to render sub-phases
            />
          )}
        </div>
      );
    });
  };

  console.log("data_global", data_global); // Debugging the global data

  return (
    <Card
      bodyStyle={{ padding: "0" }}
      style={{ width: "100%", height: "100%", marginBottom: "20px" }}
    >
      {/* Render the root node and all its children */}
      {renderPhasesWithBackgrounds([data_global])}
    </Card>
  );
};

export default OrgChartV1;
