import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useContext } from "react";
import { DataContext } from "./dataProcess/dataContext";

export default function DateLine({ zoom = 1, translate = { x: 0, y: 0 } }) {
  const calendarRef = useRef(null);

  const {
    data_global,
    updateDataGlobal,
    node_displayed,
    set_node_displayed,
    refresh_key,
  } = useContext(DataContext);

  function getJsonDepth(obj) {
    if (typeof obj !== "object" || obj === null) {
      return 0;
    }

    let maxDepth = 0;
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (
          key === "children" &&
          Array.isArray(obj[key]) &&
          obj[key].length > 0
        ) {
          // If "children" is a non-empty array, calculate depth for each child
          obj[key].forEach((child) => {
            const childDepth = getJsonDepth(child);
            if (childDepth > maxDepth) {
              maxDepth = childDepth;
            }
          });
        } else if (key !== "children") {
          // If the key is not "children", calculate depth as usual
          const depth = getJsonDepth(obj[key]);
          if (depth > maxDepth) {
            maxDepth = depth;
          }
        }
      }
    }

    return maxDepth + 1;
  }
  useEffect(() => {
    const svg = d3.select(calendarRef.current);
    let dates = 3; // Number of dates to display
    // const regimen_depth = getJsonDepth(data_global) - 1
    const regimen_depth = data_global["metadata"]["blocks"].length - 1;

    const cycle_length_unit = data_global["metadata"]["cycle_length_unit"];
    const cycle_length_ub = data_global["metadata"]["cycle_length_ub"];

    dates = regimen_depth;

    const margin = { top: 10, right: 20, bottom: 30, left: 20 };
    const width = 270 * (dates + 1) - margin.left - margin.right;
    const height = 300;

    // console.log(regimen_depth)

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
        .tickValues(d3.range(0, dates + 1, 1 / cycle_length_ub))
        .tickFormat((d) => {
          const wholePart = Math.floor(d); // Integer part of the tick
          const fractionPart = Math.round(
            (d - wholePart) * (cycle_length_ub + 2)
          ); // Fraction part, scaled to 0-7
          return fractionPart === 0
            ? `C${wholePart}`
            : `${Math.round(d * cycle_length_ub)}`;
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
      .tickValues(d3.range(0, dates + 1, 1 / cycle_length_ub))
      .tickFormat((d) => {
        const wholePart = Math.floor(d); // Integer part of the tick
        const fractionPart = Math.round(
          (d - wholePart) * (cycle_length_ub + 2)
        ); // Fraction part, scaled to 0-7
        return fractionPart === 0
          ? `C${wholePart}`
          : `${(Math.round(d * cycle_length_ub) % cycle_length_ub) + 1}`;
      });

    svg
      .select(".axis-group")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${translate.x + margin.left}, ${height / 2 + translate.y})`
      );

    // Helper function to add hover and click effects to blocks
    const addBlockInteractivity = (selection, color, drug) => {
      selection
        .on("mouseover", function () {
          d3.select(this).attr("fill", d3.color(color).darker(2)); // Darken color on hover
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", color); // Reset color on mouse out
        })
        .on("click", function () {
          // console.log("asdfasf")
          // alert(`Clicked on a ${color} block!`);
          // console.log(drug)
          set_node_displayed({ Title: drug.component });
        });
    };

    const drug_types = data_global["metadata"]["drug_len"];
    const drugNames = data_global.drugs.map((drug) => drug.component);

    function generateDrugGroups(data, svg, xScale, dates) {
      // Remove any existing blocks to avoid duplication
      svg.select(".axis-group").selectAll(".drug-block").remove();

      const colorScheme = d3.schemeTableau10;
      const colorScale = d3.scaleOrdinal(colorScheme);

      const colorMap = {};
      const shapeMap = {};

      // Define the minimum and maximum number of sides for the polygons
      const minSides = 3;
      const maxSides = Math.min(10, minSides + data.drugs.length - 1); // Limit max sides to avoid overly complex shapes

      // Dynamically calculate the number of sides for each drug
      data.drugs.forEach((drug, index) => {
        colorMap[index] = colorScale(index % colorScheme.length);
        // Calculate number of sides by evenly distributing within [minSides, maxSides]
        shapeMap[index] = minSides + (index % (maxSides - minSides + 1));
      });

      const getPolygonPoints = (cx, cy, radius, sides) => {
        const angleStep = (2 * Math.PI) / sides;
        return Array.from({ length: sides }, (_, i) => {
          const angle = i * angleStep - Math.PI / 2; // Start pointing upwards
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          return `${x},${y}`;
        }).join(" ");
      };

      // Iterate over each day within the specified date range
      d3.range(0, dates + 1, 1 / cycle_length_ub).forEach((date) => {
        // Track the vertical position offset for each drug block on the same date
        let yOffset = -15;

        // Iterate over each drug in the data
        data.drugs.forEach((drug, index) => {
          // Check if the drug is scheduled for the current date
          const isScheduledForDate = drug.days.some(
            (day) =>
              day.number ===
              (Math.round(date * cycle_length_ub) % cycle_length_ub) + 1
          );

          // If scheduled, create a block for this drug on this date
          const tickPosition = xScale(date);

          // Get the unique color and shape for each drug
          const drugColor = isScheduledForDate
            ? colorMap[index]
            : "transparent";
          const shapeSides = shapeMap[index];

          // Append a colored block to the .axis-group for each scheduled date
          const drugBlock = svg
            .select(".axis-group")
            .append("polygon")
            .attr("class", "drug-block")
            .attr(
              "points",
              getPolygonPoints(tickPosition, yOffset + 10, 10, shapeSides)
            )
            .attr("fill", drugColor);

          if (isScheduledForDate) {
            addBlockInteractivity(drugBlock, drugColor, drug);
          }

          //sketching fuzzy drug implementation

          // if (drug.fuzzy && isScheduledForDate) {
          //   const shadowOffsets = [-10, 10]; // Small offsets for shadow positions
          //   shadowOffsets.forEach((offsetX) => {
          //     if (offsetX !== 0) {
          //       svg
          //         .select(".axis-group")
          //         .append("polygon")
          //         .attr("class", "drug-block shadow")
          //         .attr(
          //           "points",
          //           getPolygonPoints(
          //             tickPosition + offsetX,
          //             yOffset + 10,
          //             10,
          //             shapeSides
          //           )
          //         )
          //         .attr("fill", drugColor)
          //         .attr("opacity", 0.3); // Lower opacity for shadow effect
          //     }
          //   });
          // }

          // Increment yOffset to avoid overlapping blocks on the same date
          yOffset -= 25;
        });
      });
    }

    // Ensure axis-group exists in the SVG
    svg.append("g").attr("class", "axis-group");

    generateDrugGroups(data_global, svg, newXScale, dates);

    // Ensure the font size and line thickness stay consistent after updating the axis
    svg.selectAll(".tick text").style("font-size", "20px"); // Keep font large
    svg.selectAll(".tick text").style("opacity", zoom < 1.5 ? 0 : 1);
    svg.selectAll(".domain").style("stroke-width", "2px"); // Keep line bold
  }, [zoom, translate]); // Re-run effect whenever zoom or translate changes
  const handleChildPointerDown = (event) => {
    event.stopPropagation(); // Prevents it from affecting the parent's pointerdown
  };
  return (
    <div onPointerDown={handleChildPointerDown}>
      <svg
        ref={calendarRef}
        width="800"
        height="300"
        style={{ marginTop: "20px", userSelect: "none" }}
      />
    </div>
  );
}
