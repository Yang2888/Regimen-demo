// Timeline.js
import React, { useContext } from "react";
import { DataContext } from "./dataProcess/dataContext";

const Timeline = () => {
  const { data_global } = useContext(DataContext); // Access data_global from context

  // Check if data_global has children (phases)
  if (!data_global || !data_global.children) {
    return <div>No timeline data available</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "10px",
        borderTop: "1px solid #ddd",
        textAlign: "center",
      }}
    >
      <h3>Timeline</h3>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {data_global.children.map((phase) => (
          <div key={phase.uid} style={{ flex: 1, textAlign: "left" }}>
            {/* Display phase title */}
            <strong>{phase.Title}</strong>
            <div>
              {/* Display cycle information for each phase */}
              {phase.cycles && phase.cycles.length > 0 ? (
                phase.cycles.map((cycle, cycleIndex) => (
                  <div key={cycleIndex} style={{ padding: "5px 0" }}>
                    <span>
                      Cycle {cycle.cycle_number}: {cycle.cycle_length}
                    </span>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {cycle.drugs.map((drug, drugIndex) => (
                        <li key={drugIndex} style={{ fontSize: "small" }}>
                          {drug.name} - {drug.dosage}, {drug.frequency}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No cycles available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
