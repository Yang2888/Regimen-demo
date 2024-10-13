import React, { useState, useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import orgChart from './jsons/aaa.json';  // Adjusted path to reflect that jsons is inside src

// Custom node rendering function with adjusted toggle button size and margin
const renderRectSvgNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => (
  <g>
    {/* Use custom HTML and CSS for node rendering */}
    <foreignObject {...foreignObjectProps}>
      <div style={{ display: 'flex', alignItems: 'center', width: '220px', height: 'auto', padding: '5px', backgroundColor: '#f0f2f5', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        {/* Main content */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h3 style={{ fontSize: '14px', margin: 0 }}>{nodeDatum.name}</h3>
          <hr style={{ margin: '4px 0', borderColor: '#d9d9d9' }} />  {/* Divider Line */}
          {nodeDatum.attributes?.department && (
            <div style={{ fontSize: '12px', marginTop: '8px' }}>{nodeDatum.attributes.department}</div>
          )}
        </div>
        {/* Circle for expanding/collapsing button with adjusted position */}
        {nodeDatum.children && (
          <div
            onClick={toggleNode}
            style={{
              width: '30px',
              height: '30px',
              marginLeft: '10px',
              marginRight: '15px',
              backgroundColor: 'lightblue',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {/* Move + or - up a bit */}
            <span style={{
              fontSize: '16px',
              position: 'relative',
              top: '-2.5px',  // Adjust the value to move it up or down
            }}>
              {nodeDatum.__rd3t.collapsed ? '+' : '-'}
            </span>
          </div>
        )}
      </div>
    </foreignObject>
  </g>
);

export default function OrgChartTree() {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const treeWrapperRef = useRef(null);

  useEffect(() => {
    if (treeWrapperRef.current) {
      const dimensions = treeWrapperRef.current.getBoundingClientRect();
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      // Move the tree to the left by 400 pixels
      setTranslate({ x: centerX - 400, y: centerY });
    }
  }, []);

  const foreignObjectProps = { width: 220, height: 100, x: -110, y: -50 };  // Adjusted width to accommodate the circle

  // Utility function to collapse all nodes in the chart
  const collapseAllNodes = (node) => {
    if (node.children) {
      node.__rd3t = { collapsed: true };
      node.children.forEach(collapseAllNodes);
    }
  };

  // Collapse all children on load
  useEffect(() => {
    orgChart.__rd3t = { collapsed: false };  // Keep the root node open
    orgChart.children.forEach(collapseAllNodes);  // Collapse all children nodes
  }, []);

  return (
    <div id="treeWrapper" ref={treeWrapperRef} style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Tree 
        data={orgChart}  // Use the imported orgChart JSON
        nodeSize={{ x: 270, y: 120 }}  // Keep the node size for better spacing
        renderCustomNodeElement={(rd3tProps) => renderRectSvgNode({ ...rd3tProps, foreignObjectProps })}  // Custom node rendering
        orientation="horizontal"  // Set orientation to horizontal
        pathFunc="diagonal"  // Use diagonal path for smoother lines
        translate={translate}  // Automatically center the tree and move it further left by 400px
        zoom={0.8}  // Set initial zoom to 80% of default
      />
    </div>
  );
}
