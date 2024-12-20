import React, { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";
import orgChart from "../jsons/aaa.json"; // Adjusted path to reflect that jsons is inside src
import { useContext } from "react";
import { DataContext } from "./dataProcess/dataContext";
import DateLine from "./Dateline";
import { zoom } from "d3";
import { css } from "@emotion/react";

// Custom node rendering function with adjusted toggle button size and margin
const renderRectSvgNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  set_node_fun = (data) => {
    console.log("111");
  },
  set_rightPanelShowing,
  rightPanelShowing,
}) => {
  const showDetails = (e) => {
    set_rightPanelShowing("Display");
    // console.log("adsfaf")
    // console.log(rightPanelShowing)
    set_node_fun(nodeDatum);
  };

  return (
    <g>
      <foreignObject {...foreignObjectProps}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "220px",
            height: "auto",
            padding: "5px",
            backgroundColor: "#f0f2f5",
            borderRadius: "8px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <h3 style={{ fontSize: "8px", margin: 0 }}>
              {nodeDatum?.Title && nodeDatum.Title}
            </h3>
            <hr style={{ margin: "2px 0", borderColor: "#d9d9d9" }} />

            
              {nodeDatum?.Summary && (
                <> 
                <div style={{ fontSize: "5px", marginTop: "3px" }}>
                   Summary: {nodeDatum.Summary}
                   <br/>
                </div>
                {/* <br/> */}
                </>
              )
            }

{nodeDatum?.Note && (
                <> 
                <div style={{ fontSize: "5px", marginTop: "3px", color: "#007BFF", fontWeight: "bold"  }}>
                   Note by Doctor: {nodeDatum.Note}
                   <br/>
                </div>
                {/* <br/> */}
                </>
              )
            }

{nodeDatum?.Current_status && (
                <> 
                <div style={{ fontSize: "5px", marginTop: "3px", color: "#008000", fontWeight: "bold" }}>
                   Note by Patient: {nodeDatum.Current_status}
                   <br/>
                </div>
                {/* <br/> */}
                </>
              )
            }

            
          </div>

          <div
            onClick={showDetails}
            style={{
              width: "30px",
              height: "30px",
              marginLeft: "10px",
              marginRight: "15px",
              backgroundColor: "lightgreen",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              transition: "background-color 0.3s",
              ":hover": {
                backgroundColor: "darkgreen",
              },
            }}
            // css={hoverableStyle}
          >
            <span
              style={{ fontSize: "16px", position: "relative", top: "-2.5px" }}
            >
              i
            </span>
          </div>

          {false && nodeDatum.children && nodeDatum.children.length > 0 && (
            <div
              onClick={toggleNode}
              style={{
                width: "30px",
                height: "30px",
                marginRight: "15px",
                marginLeft: "-5px",
                backgroundColor: "lightblue",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
};

// Main component wrapping the tree
export default function OrgChartTree({
  width = "800px",
  height = "500px",
  treeData = orgChart,
}) {
  const foreignObjectProps = { width: 270, height: 270, x: -110, y: -50 };

  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(2.5);
  const [text, setText] = useState(400);
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const treeWrapperRef = useRef(null);
  const {
    data_global,
    updateDataGlobal,
    node_displayed,
    set_node_displayed,
    refresh_key,
    set_rightPanelShowing, 
    rightPanelShowing,
  } = useContext(DataContext);

  const moveInitChart = () => {
    if (treeWrapperRef.current) {
      const dimensions = treeWrapperRef.current.getBoundingClientRect();
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      setZoomLevel(2);

      setTranslate({ x: centerX / 2, y: centerY / 2 });
      // console.log("moved...")
    }
  };

  useEffect(() => {
    moveInitChart();
  }, []);

  useEffect(() => {
    if (treeWrapperRef.current) {
      setTranslate({ x: 350, y: 150 });
      setText(text + 1e-9);
      setZoomLevel(2.8);
    }
  }, [refresh_key]);

  useEffect(() => {
    const handleGlobalWheel = (event) => {
      if (
        treeWrapperRef.current &&
        treeWrapperRef.current.contains(event.target)
      ) {
        // event.preventDefault();
        // event.stopPropagation();
        setZoomLevel((prevZoom) => {
          const newZoom = prevZoom + event.deltaY * -0.01;
          return Math.max(0.1, Math.min(newZoom, 10));
        });
        event.preventDefault();
      }
    };

    // Add global event listener for wheel events
    document.addEventListener("wheel", handleGlobalWheel, { passive: false });

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("wheel", handleGlobalWheel);
    };
  }, []);

  const handlePointerDown = (event) => {
    // Start the drag
    setDragging(true);
    setStartPosition({ x: event.clientX, y: event.clientY });
    // console.log("Pointer down at:", event.clientX, event.clientY);
  };

  const handlePointerMove = (event) => {
    if (dragging) {
      const dx = event.clientX - startPosition.x;
      const dy = event.clientY - startPosition.y;

      // Update the translation based on drag distance
      setTranslate((prevTranslate) => ({
        x: Math.min(prevTranslate.x + dx, 500), // Ensure x is always >= 0
        y: prevTranslate.y + dy, // No restrictions on y
      }));

      // Update start position for the next move event
      setStartPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handlePointerUp = () => {
    // End the drag
    setDragging(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <DateLine
        zoom={zoomLevel}
        // translate={{ x: (translate.x) - 100 , y: 0 }}
        translate={{ x: translate.x, y: 0 }}
        zoomLevelTrigger={zoomLevel}
      ></DateLine>
      <div
        id="treeWrapper"
        ref={treeWrapperRef}
        style={{
          // width: width,
          height: height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0px",
          margin: "0px",
          // marginTop: "200px"
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
        }}
      >
        <Tree
          data={treeData} // Use the imported orgChart JSON
          nodeSize={{ x: 270, y: 200 }} // Keep the node size for better spacing
          renderCustomNodeElement={(rd3tProps) =>
            renderRectSvgNode({
              ...rd3tProps,
              foreignObjectProps,
              set_node_fun: set_node_displayed,
              set_rightPanelShowing,
              rightPanelShowing,
            })
          } // Custom node rendering
          orientation="horizontal" // Set orientation to horizontal
          pathFunc="step" // Use diagonal path for smoother lines
          translate={{ x: translate.x, y: translate.y }} // Automatically center the tree
          zoom={zoomLevel}
          zoomable={false} // Disable zooming
          draggable={false}
          scaleExtent={{ min: 0.00001, max: 100 }} // Lock zoom level to 100%
        />
      </div>

      {/* <DateLine zoom={1} translate={{x:translate.x -200, y: 0}}></DateLine> */}
      {/* <DateLine zoom={2} translate={{x:translate.x -200, y: 0}}></DateLine> */}
    </div>
  );
}
