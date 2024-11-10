import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DateLine() {
  const calendarRef = useRef(null);

  useEffect(() => {
    // Select only the current component's svg by targeting calendarRef
    const svg = d3.select(calendarRef.current);

    // Append axis group only if it doesn't already exist
    if (!svg.select(".axis-group").node()) {
      const margin = { top: 10, right: 20, bottom: 30, left: 20 };
      const width = 800 - margin.left - margin.right;
      const height = 50;

      // Create x-axis scale
      const xScale = d3.scaleLinear()
        .domain([1, 30]) // Dates from 1 to 30
        .range([0, width]);

      // Append the group for axis
      const g = svg.append("g")
        .attr("class", "axis-group") // Assign a class for unique identification
        .attr("transform", `translate(${margin.left},${height / 2})`);

      // Add x-axis to the group
      const xAxis = d3.axisBottom(xScale).ticks(30).tickFormat(d3.format("d"));
      g.call(xAxis);

      // Add zoom behavior to the SVG
      const zoom = d3.zoom()
        .scaleExtent([1, 10]) // Zoom scale limits
        .on("zoom", (event) => g.attr("transform", event.transform));

      svg.call(zoom);
    }
  }, []);

  return (
    <svg ref={calendarRef} width="100%" height="80" style={{ marginTop: '20px' }} />
  );
}
