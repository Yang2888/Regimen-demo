import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DateLine({ zoom = 1, translate = { x: 0, y: 0 } }) {
  const calendarRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(calendarRef.current);

    const margin = { top: 10, right: 20, bottom: 30, left: 20 };
    const width = 800 - margin.left - margin.right;
    const height = 50;

    // Initial x-axis scale
    const xScale = d3.scaleLinear()
      .domain([1, 30]) // Dates from 1 to 30
      .range([0, width]);

    // Create the axis group if it doesn't already exist
    if (!svg.select(".axis-group").node()) {
      const g = svg.append("g")
        .attr("class", "axis-group")
        .attr("transform", `translate(${margin.left}, ${height / 2})`);

      const xAxis = d3.axisBottom(xScale).ticks(30).tickFormat(d3.format("d"));
      g.call(xAxis);

      // Apply larger font size for tick labels and bolder axis line
      svg.selectAll(".tick text").style("font-size", "20px"); // Larger font size for tick labels
      svg.selectAll(".domain").style("stroke-width", "2px"); // Bolder axis line
    }

    // Update scale and transformation based on zoom and translate props
    const newXScale = xScale.copy().range([0, width * zoom]);
    const adjustedTicks = Math.max(1, Math.floor(30 / zoom));
    const xAxis = d3.axisBottom(newXScale).ticks(adjustedTicks).tickFormat(d3.format("d"));

    svg.select(".axis-group")
      .call(xAxis)
      .attr("transform", `translate(${translate.x + margin.left}, ${height / 2 + translate.y})`);

    // Ensure the font size and line thickness stay consistent after updating the axis
    svg.selectAll(".tick text").style("font-size", "20px"); // Keep font large
    svg.selectAll(".domain").style("stroke-width", "2px"); // Keep line bold

  }, [zoom, translate]); // Re-run effect whenever zoom or translate changes

  return (
    <svg ref={calendarRef} width="800" height="80" style={{ marginTop: '20px' }} />
  );
}
