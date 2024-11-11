import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function DateLine({ zoom = 1, translate = { x: 0, y: 0 } }) {
  const calendarRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(calendarRef.current);
    const dates = 3; // Number of dates to display
    const margin = { top: 10, right: 20, bottom: 30, left: 20 };
    const width = 800 - margin.left - margin.right;
    const height = 100;

    // Initial x-axis scale
    const xScale = d3
      .scaleLinear()
      .domain([0, dates + 1])
      .range([0, width]);

    // Create the axis group if it doesn't already exist
    if (!svg.select(".axis-group").node()) {
      const g = svg
        .append("g")
        .attr("class", "axis-group")
        .attr("transform", `translate(${margin.left}, ${height / 2})`);

      const xAxis = d3
        .axisBottom(xScale)
        .tickValues(d3.range(0, dates + 1, 1 / 7)) 
        .tickFormat((d) => {
          const wholePart = Math.floor(d); // Integer part of the tick
          const fractionPart = Math.round((d - wholePart) * 8); // Fraction part, scaled to 0-7
          return fractionPart === 0 ? `${wholePart}` : `${wholePart} - ${fractionPart}`;
        });

      g.call(xAxis);

      // Apply larger font size for tick labels and bolder axis line
      svg.selectAll(".tick text").style("font-size", "20px"); // Larger font size for tick labels
      svg.selectAll(".domain").style("stroke-width", "2px"); // Bolder axis line
    }

    // Update scale and transformation based on zoom and translate props
    const newXScale = xScale.copy().range([0, width * zoom]);
    const xAxis = d3
      .axisBottom(newXScale)
      .tickValues(d3.range(0, dates + 1, 1 / 7)) 
      .tickFormat((d) => {
        const wholePart = Math.floor(d); // Integer part of the tick
        const fractionPart = Math.round((d - wholePart) * 8); // Fraction part, scaled to 0-7
        return fractionPart === 0 ? `${wholePart}` : `${wholePart} - ${fractionPart}`;
      });

    svg
      .select(".axis-group")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${translate.x + margin.left}, ${height / 2 + translate.y})`
      );

    // Helper function to add hover and click effects to blocks
    const addBlockInteractivity = (selection, color) => {
      selection
        .on("mouseover", function () {
          d3.select(this).attr("fill", d3.color(color).darker(1)); // Darken color on hover
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", color); // Reset color on mouse out
        })
        .on("click", function () {
          alert(`Clicked on a ${color} block!`);
        });
    };

    // Add red block behind the "1" tick
    const tickOnePosition = newXScale(1); // Position of tick "1"
    svg.select(".axis-group").selectAll(".red-block").remove(); // Remove any existing red block to avoid duplication
    const redBlock = svg
      .select(".axis-group")
      .append("rect")
      .attr("class", "red-block")
      .attr("x", tickOnePosition - 10) // Adjust position to center the block
      .attr("y", -15) // Position above the tick line
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "red")
      .attr("rx", 3); // Optional: rounded corners for styling
    addBlockInteractivity(redBlock, "red");

    // Add green blocks for dates where date % 3 === 2
    svg.select(".axis-group").selectAll(".green-block").remove(); // Remove any existing green blocks to avoid duplication
    d3.range(0, dates + 1, 1).forEach((date) => {
      if (date % 3 === 2) {
        const tickPosition = newXScale(date);
        const greenBlock = svg
          .select(".axis-group")
          .append("rect")
          .attr("class", "green-block")
          .attr("x", tickPosition - 10) // Center the green block
          .attr("y", -15)
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "green")
          .attr("rx", 3); // Optional: rounded corners for styling
        addBlockInteractivity(greenBlock, "green");
      }
    });

    // Add blue and yellow blocks for dates where date % 3 === 0
    svg.select(".axis-group").selectAll(".blue-block, .yellow-block").remove(); // Remove any existing blocks to avoid duplication
    d3.range(0, dates + 1, 1).forEach((date) => {
      if (date % 3 === 0) {
        const tickPosition = newXScale(date);

        // Blue block with higher height
        const blueBlock = svg
          .select(".axis-group")
          .append("rect")
          .attr("class", "blue-block")
          .attr("x", tickPosition - 10) // Center the blue block
          .attr("y", -25) // Positioned higher
          .attr("width", 20)
          .attr("height", 30) // Taller blue block
          .attr("fill", "blue")
          .attr("rx", 3); // Optional: rounded corners for styling
        addBlockInteractivity(blueBlock, "blue");

        // Yellow block above blue block with normal height
        const yellowBlock = svg
          .select(".axis-group")
          .append("rect")
          .attr("class", "yellow-block")
          .attr("x", tickPosition - 10) // Center the yellow block
          .attr("y", -45) // Positioned above the blue block
          .attr("width", 20)
          .attr("height", 20) // Normal height for yellow block
          .attr("fill", "yellow")
          .attr("rx", 3); // Optional: rounded corners for styling
        addBlockInteractivity(yellowBlock, "yellow");
      }
    });

    // Ensure the font size and line thickness stay consistent after updating the axis
    svg.selectAll(".tick text").style("font-size", "20px"); // Keep font large
    svg.selectAll(".domain").style("stroke-width", "2px"); // Keep line bold
  }, [zoom, translate]); // Re-run effect whenever zoom or translate changes

  return (
    <svg
      ref={calendarRef}
      width="800"
      height="100"
      style={{ marginTop: "20px" }}
    />
  );
}
