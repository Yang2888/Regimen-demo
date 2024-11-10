
import React, { useState, useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import orgChart from '../jsons/aaa.json'; // Adjusted path to reflect that jsons is inside src
import { useContext } from 'react';
import { DataContext } from './dataProcess/dataContext';
import DateLine from './Dateline';

// Custom node rendering function with adjusted toggle button size and margin
const renderRectSvgNode = ({ nodeDatum, toggleNode, foreignObjectProps, set_node_fun = (data)=>{console.log("111")} }) => {

  
  const showDetails = (e) => {
    set_node_fun(nodeDatum)
  };

  return (
    <g>
      <foreignObject {...foreignObjectProps}>
        
        <div style={{ display: 'flex', alignItems: 'center', width: '220px', height: 'auto', padding: '5px', backgroundColor: '#f0f2f5', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h3 style={{ fontSize: '15px', margin: 0 }}>{nodeDatum?.Title && nodeDatum.Title}</h3>
            <hr style={{ margin: '4px 0', borderColor: '#d9d9d9' }} />
            {nodeDatum?.Summary && (
              <div style={{ fontSize: '8px', marginTop: '8px' }}>{nodeDatum.Summary}</div>
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

          {nodeDatum.children && nodeDatum.children.length > 0 && (
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
export default function OrgChartTree({ width = '800px', height = '600px', treeData = orgChart, }) {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1.5); 
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  const treeWrapperRef = useRef(null);
  const { data_global, updateDataGlobal, node_displayed, set_node_displayed, refresh_key } = useContext(DataContext); 

  const [text, setText] = useState(200)

  const moveInitChart = () => {
    if (treeWrapperRef.current) {
      const dimensions = treeWrapperRef.current.getBoundingClientRect();
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      setTranslate({ x: centerX / 2, y: centerY / 2 });
      // console.log("moved...")
    }
  };

  useEffect(() => {
    moveInitChart()
  }, []);

  

  useEffect(() => {
    if (treeWrapperRef.current) {
      setTranslate({ x: text, y: text });
      setText(text + 1e-9)
      // console.log(translate)
      // console.log("Tree moved and zoom reset...");
    }
  }, [refresh_key]);

  const foreignObjectProps = { width: 270, height: 270, x: -110, y: -50 };

  const [isDragging, setIsDragging] = useState(false);

  const handleNodeDrag = (nodeData, event) => {
    const { x, y } = event;
    setDragPos({ x, y });
    setTranslate({x,y})
    console.log(dragPos)
    console.log("Dragged position:", { x, y });
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  // Handler to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse move handler while dragging within the treeWrapper
  const handleMouseMove = (event) => {
    if (isDragging) {
      const { left, top } = treeWrapperRef.current.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      setDragPos({ x, y });
    }
  };

  // Wheel handler for zooming within the treeWrapper
  useEffect(() => {
    const handleGlobalWheel = (event) => {
      if (treeWrapperRef.current && treeWrapperRef.current.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
        setZoomLevel((prevZoom) => {
          const newZoom = prevZoom + event.deltaY * -0.001;
          return Math.max(1, Math.min(newZoom, 4));  // Constrain zoom level between 0.1 and 3
        });
      }
    };

    // Add global event listener for wheel events
    document.addEventListener("wheel", handleGlobalWheel, { passive: false });

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("wheel", handleGlobalWheel);
    };
  }, []);
  return (
    <div onMouseMove={handleMouseMove}  // Track mouse movement only while dragging
    onMouseDown={handleMouseDown}  // Start dragging on mouse down
    onMouseUp={handleMouseUp}  // Stop dragging on mouse up
    >
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
      onDoubleClick={(e) => {e.preventDefault()}}

    >
      <Tree
        data={treeData}  // Use the imported orgChart JSON
        nodeSize={{ x: 270, y: 200 }}  // Keep the node size for better spacing
        renderCustomNodeElement={(rd3tProps) => renderRectSvgNode({ ...rd3tProps, foreignObjectProps, set_node_fun: set_node_displayed })}  // Custom node rendering
        orientation="horizontal"  // Set orientation to horizontal
        pathFunc="diagonal"  // Use diagonal path for smoother lines
        translate={translate}  // Automatically center the tree
        zoom={zoomLevel}
        zoomable={false}  // Disable zooming
        draggable={false}
        scaleExtent={{ min: 0.01, max: 10 }}  // Lock zoom level to 100%
      />

    </div>
    <DateLine zoom={zoomLevel} translate={dragPos}></DateLine>
    </div>
  );
}
