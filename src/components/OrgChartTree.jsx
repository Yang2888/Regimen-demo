import React, { useState, useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import orgChart from '../jsons/aaa.json'; // Adjusted path to reflect that jsons is inside src

// Custom node rendering function with adjusted toggle button size and margin
const renderRectSvgNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => {
  const showDetails = (e) => {
    console.log("details");
    console.log(nodeDatum)
  };

  return (
    <g>
      <foreignObject {...foreignObjectProps}>
        <div style={{ display: 'flex', alignItems: 'center', width: '220px', height: 'auto', padding: '5px', backgroundColor: '#f0f2f5', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h3 style={{ fontSize: '14px', margin: 0 }}>{nodeDatum.name}</h3>
            <hr style={{ margin: '4px 0', borderColor: '#d9d9d9' }} />
            {nodeDatum.attributes?.department && (
              <div style={{ fontSize: '12px', marginTop: '8px' }}>{nodeDatum.attributes.department}</div>
            )}
          </div>

          <div
            onClick={showDetails}
            style={{
              width: '30px',
              height: '30px',
              marginLeft: '10px',
              marginRight: '15px',
              backgroundColor: 'lightgreen',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '16px', position: 'relative', top: '-2.5px' }}>i</span>
          </div>

          {nodeDatum.children && (
            <div
              onClick={toggleNode}
              style={{
                width: '30px',
                height: '30px',
                marginRight: '15px',
                marginLeft: '-5px',
                backgroundColor: 'lightblue',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{
                fontSize: '16px',
                position: 'relative',
                top: '-2.5px',
              }}>
                {nodeDatum.__rd3t.collapsed ? '+' : '-'}
              </span>
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
};

// Main component wrapping the tree
export default function OrgChartTree({ width = '800px', height = '600px', treeData = orgChart }) {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const treeWrapperRef = useRef(null);

  useEffect(() => {
    if (treeWrapperRef.current) {
      const dimensions = treeWrapperRef.current.getBoundingClientRect();
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      setTranslate({ x: centerX / 2, y: centerY / 2 });
    }
  }, []);

  const foreignObjectProps = { width: 220, height: 100, x: -110, y: -50 };

  return (
    <div
      id="treeWrapper"
      ref={treeWrapperRef}
      style={{
        // width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
        margin: '0px',
      }}
    >
      <Tree
        data={treeData}  // Use the imported orgChart JSON
        nodeSize={{ x: 270, y: 120 }}  // Keep the node size for better spacing
        renderCustomNodeElement={(rd3tProps) => renderRectSvgNode({ ...rd3tProps, foreignObjectProps })}  // Custom node rendering
        orientation="horizontal"  // Set orientation to horizontal
        pathFunc="step"  // Use diagonal path for smoother lines
        translate={translate}  // Automatically center the tree
        zoom={1.5}  // Set initial zoom to 150% of default for a bigger view
        scaleExtent={{ min: 0.1, max: 100 }}  // Allow zooming in to 300% and out to 10%
      />
    </div>
  );
}
