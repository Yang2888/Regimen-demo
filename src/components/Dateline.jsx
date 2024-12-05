import React, { useEffect, useRef, useState, useContext } from "react";
import * as d3 from "d3";
import { DataContext } from "./dataProcess/dataContext";

export default function DateLine({ zoom = 1, translate = { x: 0, y: 0 } }) {
  const calendarRef = useRef(null);
  const [startDate, setStartDate] = useState(getToday());
  const [parsedStartDate, setParsedStartDate] = useState(new Date(startDate));

  const {
    data_global,
    updateDataGlobal,
    node_displayed,
    set_node_displayed,
    refresh_key,
    set_rightPanelShowing,
  } = useContext(DataContext);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getToday() {
    const today = new Date();
    today.setDate(today.getDate() - 0);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const svg = d3.select(calendarRef.current);

    const fullName = {
      IV: "Intravenous",
      SC: "Subcutaneous",
      PO: "Oral",
      IT: "Intrathecal",
    };

    // Remove any existing legend to avoid duplication
    svg.select(".legend-group").remove();

    //TODO: calculate scale based on number of routes and drugs

    // Create the legend group
    const legendGroup = svg
      .append("g")
      .attr("class", "legend-group")
      .attr("transform", `translate(20, 20) scale(0.6)`); // Position legend at the top-left

    // Define the size and spacing of legend items
    const legendItemSize = 20;
    const legendSpacing = 10;
    const legendTextOffset = 30;

    // Define the shape and route mapping for routes
    const shapeMap = [
      { route: "IV", shape: "droplet" },
      { route: "SC", shape: "arrow" },
      { route: "PO", shape: "ellipse" },
      { route: "IT", shape: "cross-circle" },
    ];

    // Define yOffset for route legend items
    let yOffset = 0;

    // Iterate through the shapeMap to create route legend items
    shapeMap.forEach((entry, index) => {
      const colorScheme = d3.schemeTableau10;
      const colorScale = d3.scaleOrdinal(colorScheme);
      const color = colorScale(index % colorScheme.length);

      if (entry.shape === "droplet") {
        // Add teardrop shape
        legendGroup
          .append("path")
          .attr(
            "d",
            `M10,${yOffset + legendItemSize / 2 - 10} 
              Q0,${yOffset + legendItemSize / 2} 
              10,${yOffset + legendItemSize / 2 + 10} 
              Q20,${yOffset + legendItemSize / 2} 
              10,${yOffset + legendItemSize / 2 - 10} Z`
          )
          .attr("fill", color);
      } else if (entry.shape === "arrow") {
        // Add arrow shape
        legendGroup
          .append("polygon")
          .attr(
            "points",
            `5,${yOffset + legendItemSize / 2} 
             10,${yOffset + legendItemSize / 2 - 10} 
             15,${yOffset + legendItemSize / 2} 
             10,${yOffset + legendItemSize / 2 + 10}`
          )
          .attr("fill", color);
      } else if (entry.shape === "ellipse") {
        // Add ellipse shape
        legendGroup
          .append("ellipse")
          .attr("cx", 10)
          .attr("cy", yOffset + legendItemSize / 2)
          .attr("rx", 10)
          .attr("ry", 5)
          .attr("fill", color);
      } else if (entry.shape === "cross-circle") {
        // Add circle with a cross
        legendGroup
          .append("circle")
          .attr("cx", 10)
          .attr("cy", yOffset + legendItemSize / 2)
          .attr("r", 10)
          .attr("fill", color);

        legendGroup
          .append("path")
          .attr(
            "d",
            `M5,${yOffset + legendItemSize / 2} 
             H15 
             M10,${yOffset + legendItemSize / 2 - 5} 
             V${yOffset + legendItemSize / 2 + 5}`
          )
          .attr("stroke", "black")
          .attr("stroke-width", 2);
      }

      // Add text label for route next to each shape
      legendGroup
        .append("text")
        .attr("x", legendTextOffset)
        .attr("y", yOffset + legendItemSize / 2 + 5) // Vertically center text
        .style("font-size", "14px")
        .text(fullName[entry.route]);

      // Update yOffset for next route item
      yOffset += legendItemSize + legendSpacing;
    });

    // Define yOffset for drug legend items (offset to be placed below route legend)
    let drugYOffset = yOffset + 20;

    // Add legend title for drugs
    legendGroup
      .append("text")
      .attr("x", 0)
      .attr("y", drugYOffset - 10)
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Drugs: top to bottom");

    // Iterate through the reversed drugs array to create drug legend items
    const drugsReversed = [...data_global.drugs].reverse();

    // Update yOffset for the drug section (after the route section)
    drugYOffset = shapeMap.length * (legendItemSize + legendSpacing) + 20; // Adjusted to start after route section

    drugsReversed.forEach((drug, index) => {
      const colorScheme = d3.schemeTableau10;
      const colorScale = d3.scaleOrdinal(colorScheme);
      const color = colorScale(index % colorScheme.length);

      console.log(drug.component);
      console.log(drug.shape);

      // Update yOffset for each drug item
      const yOffsetForDrug =
        drugYOffset + index * (legendItemSize + legendSpacing);

      if (drug.shape === "droplet") {
        // Add teardrop shape
        legendGroup
          .append("path")
          .attr(
            "d",
            `M10,${yOffsetForDrug + legendItemSize / 2 - 10} 
            Q0,${yOffsetForDrug + legendItemSize / 2} 
            10,${yOffsetForDrug + legendItemSize / 2 + 10} 
            Q20,${yOffsetForDrug + legendItemSize / 2} 
            10,${yOffsetForDrug + legendItemSize / 2 - 10} Z`
          )
          .attr("fill", color);
      } else if (drug.shape === "arrow") {
        // Add arrow shape
        legendGroup
          .append("polygon")
          .attr(
            "points",
            `5,${yOffsetForDrug + legendItemSize / 2} 
         10,${yOffsetForDrug + legendItemSize / 2 - 10} 
         15,${yOffsetForDrug + legendItemSize / 2} 
         10,${yOffsetForDrug + legendItemSize / 2 + 10}`
          )
          .attr("fill", color);
      } else if (drug.shape === "ellipse") {
        // Add ellipse shape
        legendGroup
          .append("ellipse")
          .attr("cx", 10)
          .attr("cy", yOffsetForDrug + legendItemSize / 2)
          .attr("rx", 10)
          .attr("ry", 5)
          .attr("fill", color);
      } else if (drug.shape === "cross-circle") {
        // Add circle with a cross
        legendGroup
          .append("circle")
          .attr("cx", 10)
          .attr("cy", yOffsetForDrug + legendItemSize / 2)
          .attr("r", 10)
          .attr("fill", color);

        legendGroup
          .append("path")
          .attr(
            "d",
            `M5,${yOffsetForDrug + legendItemSize / 2} 
         H15 
         M10,${yOffsetForDrug + legendItemSize / 2 - 5} 
         V${yOffsetForDrug + legendItemSize / 2 + 5}`
          )
          .attr("stroke", "black")
          .attr("stroke-width", 2);
      }

      // Add text label for the drug name and route
      legendGroup
        .append("text")
        .attr("x", legendTextOffset)
        .attr("y", yOffsetForDrug + legendItemSize / 2 + 5) // Vertically center text
        .style("font-size", "14px")
        .text(`${drug.component} (${drug.route})`);
    });
  }, []);

  useEffect(() => {
    let rightMove = 111 * zoom;

    if (data_global["Regimen_Start_Date"]) {
      setParsedStartDate(new Date(data_global["Regimen_Start_Date"]));
    } else {
    }
    // setParsedStartDate(Date(data_global["Regimen_Start_Date"]))
    // console.log(data_global)
    // setStartDate(data_global["Regimen_Start_Date"])
    const svg = d3.select(calendarRef.current);

    let dates = 3; // Number of dates to display
    // const regimen_depth = getJsonDepth(data_global) - 1
    const regimen_depth = data_global["metadata"]["blocks"].length - 1;

    const cycle_length_unit = data_global["metadata"]["cycle_length_unit"];
    const cycle_length_ub = data_global["metadata"]["cycle_length_ub"];

    dates = regimen_depth;

    const margin = { top: 10, right: 20, bottom: 30, left: 20 };
    const width = 270 * (dates + 1);
    const height = 300;

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
        .tickValues(
          d3.range(0, (dates + 1) * cycle_length_ub, 1 / cycle_length_ub)
        )
        .tickFormat((d) => {
          const wholePart = Math.floor(d); // Integer part of the tick
          const fractionPart = Math.round(
            (d - wholePart) * (cycle_length_ub + 2)
          ); // Fraction part, scaled to 0-7
          return fractionPart === 0
            ? `C${wholePart}`
            : `${Math.round(d * cycle_length_ub)}`;
        });

      // console.log(xAxis);

      g.call(xAxis);

      // Apply larger font size for tick labels and bolder axis line
      svg.selectAll(".tick text").style("font-size", "20px"); // Larger font size for tick labels
      svg.selectAll(".domain").style("stroke-width", "2px"); // Bolder axis line
    }

    //TODO: start date specified by data
    const today = formatDate(new Date()); // Current date

    //TODO: make circle disappear when zoomed out
    const handleStartDateChange = (newDate) => {
      setStartDate(newDate); // Update React state
      setParsedStartDate(new Date(newDate + 1)); // Update parsed date
    };
    const daysSinceStart = Math.floor(
      (new Date(today) - new Date(parsedStartDate)) / (1000 * 60 * 60 * 24)
    );

    // console.log(daysSinceStart)
    // console.log(cycle_length_ub)
    // const currentDatePosition = xScale(daysSinceStart / cycle_length_ub);

    // Remove any existing circle before adding a new one
    svg.select(".current-date-circle").remove();

    //TODO: make it so 2.5here is mapped to by a constant corresponding to date height
    // svg
    //   .append("circle")
    //   .attr("class", "current-date-circle")
    //   .attr("cx", (currentDatePosition ) * zoom)
    //   .attr("cy", height / 2 + parseFloat(2.5) * 16) // corresponds to 2.5em
    //   .attr("r", 40) // Circle radius
    //   .attr("stroke", "red")
    //   .attr("fill", "none")
    //   .attr("stroke-width", 2)
    //   .attr("stroke-dasharray", "5, 3") // Dashed line to mimic hand-drawn style
    //   .attr("transform", `translate(${translate.x }, ${translate.y})`);

    let lastCycleDisplayed = 0;

    //TODO: Birthday input
    // Dictionary of closure days
    const officeClosures = {
      "01/01": "New Year's Day",
      "01/15": "MLK Day",
      "2/14": "Valentine's Day",
      "02/19": "Presidents' Day",
      "05/28": "Memorial Day",
      "07/04": "Independence Day",
      "09/03": "Labor Day",
      "10/08": "Columbus Day",
      "11/05": "Election Day",
      "11/11": "Veterans Day",
      "11/22": "Thanksgiving Day",
      "12/25": "Christmas Day",
    };

    function isWeekend(date) {
      const day = date.getDay();
      return day === 0 || day === 6; // Returns true if it's Sunday (0) or Saturday (6)
    }

    // Update scale and transformation based on zoom and translate props
    const newXScale = xScale
      .copy()
      .range([0 - rightMove, width * zoom - rightMove]);

    // Create a custom array of tick values, ensuring all days are covered with fractional steps
    const tickValues = [];
    for (let i = 0; i <= (dates + 1) * cycle_length_ub; i++) {
      tickValues.push(i / cycle_length_ub); // This will generate fractional steps
    }

    const xAxis = d3
      .axisBottom(newXScale)
      .tickValues(tickValues) // Use the custom tickValues
      .tickFormat((d) => {
        // Calculate the cumulative day count from the start date
        const cumulativeDays = Math.floor(d * cycle_length_ub);

        // Determine the cycle number
        const cycleNumber = Math.floor(cumulativeDays / cycle_length_ub) + 1;
        const maxCycleNumber = Math.floor(dates + 1) + 1;

        //make date an input element if it is the start date

        // Check if the tick is at a cycle boundary
        const isCycleBoundary = cumulativeDays % cycle_length_ub === 0;

        // Compute the date for the current tick
        const tickDate = new Date(parsedStartDate);
        tickDate.setDate(parsedStartDate.getDate() + cumulativeDays + 2);

        // Format the date as "mm/dd"
        const day = String(tickDate.getDate()).padStart(2, "0");
        const month = String(tickDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
        const formattedDate = `${month}/${day}`;

        // calculate date within current cycle
        const cycleDay = (cumulativeDays % cycle_length_ub) + 1;

        // At cycle boundaries, display both the cycle label and the date
        if (cycleNumber === maxCycleNumber) {
          return `${"Fin"}\n${formattedDate}`;
        } else if (
          (isCycleBoundary && cycleNumber > lastCycleDisplayed) ||
          lastCycleDisplayed === 0
        ) {
          lastCycleDisplayed = cycleNumber;
          return `C${cycleNumber}D${cycleDay}\n${formattedDate}`; // Separate cycle label and date with newline
        } else {
          return `D${cycleDay}\n${formattedDate}`;
        }
      });

    svg
      .select(".axis-group")
      .call(xAxis)
      .attr(
        "transform",
        `translate(${translate.x + margin.left}, ${height / 2 + translate.y})`
      )
      .selectAll(".tick text") // Select all tick labels
      .each(function (d) {
        const textElement = d3.select(this);

        // Split the text content into cycle label and date label
        const [cycleLabel, dateLabel] = textElement.text().split("\n");

        // console.log(dateLabel)

        // Clear existing text and append tspans for better separation
        textElement.text(null);

        // Add cycle label, if exists
        if (cycleLabel) {
          textElement
            .append("tspan")
            .attr("x", 0) // Align horizontally at the tick
            .attr("dy", "1.2em") // Move the cycle label upward
            .text(cycleLabel);
        }

        // Add date label, if exists
        if (dateLabel) {
          textElement
            .append("tspan")
            .attr("x", 0) // Align horizontally at the tick
            .attr("dy", "1.5em") // Move the date label downward (adjusted)
            .style(
              "fill",
              isWeekend(new Date(dateLabel)) || officeClosures[dateLabel]
                ? "violet"
                : "black"
            ) // Highlight weekends
            .text(dateLabel);
        }

        // Check if the date matches a closure date and add the closure reason
        if (dateLabel && officeClosures[dateLabel]) {
          textElement
            .append("tspan")
            .attr("x", 0) // Align horizontally at the tick
            .attr("dy", "2.5em") // Move the closure reason further down
            .style("font-style", "italic") // Style the reason (optional)
            .text(officeClosures[dateLabel]); // Add the closure reason from the dictionary
        }
      });

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
          set_node_displayed({
            Title: drug.component,
            Content: `Route: ${drug.route} \n Dose: ${drug.doseMaxNum} ${drug.doseUnit} `,
          });
          set_rightPanelShowing("Display");
        });
    };

    const drug_types = data_global["metadata"]["drug_len"];
    const drugNames = data_global.drugs.map((drug) => drug.component);

    function generateDrugGroups(data, svg, xScale, dates) {
      // Remove any existing blocks to avoid duplication
      svg.select(".axis-group").selectAll(".drug-block").remove();

      const colorScheme = d3.schemeTableau10;
      const colorScale = d3.scaleOrdinal(colorScheme);

      //TODO: get a map of chemo/non-chemo drugs and add corresponding colors
      const drugChemo = {};
      const colorMap = {};
      const shapeMap = {
        IV: "droplet",
        SC: "arrow",
        PO: "ellipse",
        IT: "cross-circle",
      };

      // Define the minimum and maximum number of sides for the polygons
      // const minSides = 3;
      // const maxSides = Math.min(10, minSides + data.drugs.length - 1); // Limit max sides to avoid overly complex shapes

      // Dynamically calculate the number of sides for each drug
      //TODO: informed method of assigning drug colors/shapes (shape doesn't have to equal #sides)
      data.drugs.forEach((drug, index) => {
        colorMap[index] = colorScale(index % colorScheme.length);
        drug.shape = shapeMap[drug.route]; // Map the shape based on the drug route
      });

      // const getPolygonPoints = (cx, cy, radius, sides) => {
      //   const angleStep = (2 * Math.PI) / sides;
      //   return Array.from({ length: sides }, (_, i) => {
      //     const angle = i * angleStep - Math.PI / 2; // Start pointing upwards
      //     const x = cx + radius * Math.cos(angle);
      //     const y = cy + radius * Math.sin(angle);
      //     return `${x},${y}`;
      //   }).join(" ");
      // };

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
          let drugBlock;

          // Get the unique color and shape for each drug
          const drugColor = isScheduledForDate
            ? colorMap[index]
            : "transparent";
          if (drug.shape === "droplet") {
            // Create a teardrop shape
            drugBlock = svg
              .select(".axis-group")
              .append("path")
              .attr("class", "drug-block")
              .attr(
                "d",
                `M${tickPosition},${yOffset + 10 - 10} 
                   Q${tickPosition - 10},${yOffset + 10} 
                   ${tickPosition},${yOffset + 10 + 10} 
                   Q${tickPosition + 10},${yOffset + 10} 
                   ${tickPosition},${yOffset + 10 - 10} Z`
              )
              .attr("fill", drugColor);
          } else if (drug.shape === "arrow") {
            // Create an arrow shape
            drugBlock = svg
              .select(".axis-group")
              .append("polygon")
              .attr("class", "drug-block")
              .attr(
                "points",
                `${tickPosition - 10},${yOffset + 10} 
                   ${tickPosition},${yOffset} 
                   ${tickPosition + 10},${yOffset + 10} 
                   ${tickPosition},${yOffset + 20}`
              )
              .attr("fill", drugColor);
          } else if (drug.shape === "ellipse") {
            // Create an ellipse
            drugBlock = svg
              .select(".axis-group")
              .append("ellipse")
              .attr("class", "drug-block")
              .attr("cx", tickPosition)
              .attr("cy", yOffset + 10)
              .attr("rx", 10)
              .attr("ry", 5)
              .attr("fill", drugColor);
          } else if (drug.shape === "cross-circle") {
            // Create a circle with a cross inside
            drugBlock = svg
              .select(".axis-group")
              .append("circle")
              .attr("class", "drug-block")
              .attr("cx", tickPosition)
              .attr("cy", yOffset + 10)
              .attr("r", 10)
              .attr("fill", drugColor);

            // Add the cross inside the circle
            svg
              .select(".axis-group")
              .append("path")
              .attr("class", "drug-block")
              .attr(
                "d",
                `M${tickPosition - 5},${yOffset + 10} 
                   H${tickPosition + 5} 
                   M${tickPosition},${yOffset + 5} 
                   V${yOffset + 15}`
              )
              .attr("stroke", "black")
              .attr("stroke-width", 2)
              .attr("fill", "none");
          }

          // Append a colored block to the .axis-group for each scheduled date

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
    svg.selectAll(".tick text").style("font-size", "14px"); // Keep font large
    svg.selectAll(".tick text").style("opacity", zoom < 2.5 ? 0 : 1);
    svg.selectAll(".domain").style("stroke-width", "2px"); // Keep line bold
  }, [zoom, translate, data_global]); // Re-run effect whenever zoom or translate changes
  const handleChildPointerDown = (event) => {
    event.stopPropagation(); // Prevents it from affecting the parent's pointerdown
  };
  return (
    <div onPointerDown={handleChildPointerDown}>
      <svg
        ref={calendarRef}
        width="900"
        height="220"
        style={{ marginTop: "20px", userSelect: "none", display: "flex" }}
      />
    </div>
  );
}
