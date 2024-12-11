import React, { useEffect, useRef, useState, useContext } from "react";
import * as d3 from "d3";
import { DataContext } from "./dataProcess/dataContext";

export default function DateLine({
  zoom = 1,
  translate = { x: 0, y: 0 },
  zoomLevelTrigger,
}) {
  const calendarRef = useRef(null);
  const [startDate, setStartDate] = useState(getToday());
  const [parsedStartDate, setParsedStartDate] = useState(new Date(startDate));

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

  const drugGroups = {
    vincristine: ["vincristine"],
    cyclophosphamide: ["cyclophosphamide", "procytox"],
    dactinomycin: ["dactinomycin"],
    daunorubicin: ["daunorubicin"],
    docetaxel: ["docetaxel", "caxotere"],
    doxorubicin: ["doxorubicin"],
    eribulin: ["eribulin", "halaven"],
    etoposide: ["etoposide", "vepesid"],
    idarubicin: ["idarubicin"],
    ifosfamide: ["ifosfamide", "ifex"],
    irinotecan: ["irinotecan", "onivyde"],
    paclitaxel: ["paclitaxel", "abraxane"],
    topotecan: ["topotecan", "hycamtin"],
  };

  const colorMap = {
    vincristine: "#FF5733", // Warm red-orange
    cyclophosphamide: "#FFA500", // Bright orange
    dactinomycin: "#FFD700", // Vibrant gold
    daunorubicin: "#FF4500", // Deep orange-red
    docetaxel: "#FFB6C1", // Soft pink
    doxorubicin: "#FF6347", // Tomato red
    eribulin: "#FFD12A", // Yellow-gold
    etoposide: "#FF9E80", // Light peach
    idarubicin: "#FF6F61", // Bright salmon
    ifosfamide: "#FFA07A", // Light salmon
    irinotecan: "#FF4E50", // Crimson
    paclitaxel: "#FF7F50", // Coral
    topotecan: "#FF3E96", // Hot pink
  };

  // Assign colors dynamically to each drug in the groups
  const drugColorMap = {};
  for (const [group, drugs] of Object.entries(drugGroups)) {
    const color = colorMap[group];
    drugs.forEach((drug) => {
      drugColorMap[drug] = color;
    });
  }

  const shapeMap = {
    IV: "droplet",
    SC: "arrow",
    PO: "ellipse",
    IT: "cross-circle",
  };

  const generateCoolColorPalette = (size) => {
    const startColor = [0, 0, 139]; // Deep Blue (RGB)
    const endColor = [0, 255, 180]; // Aqua Blue-Green (RGB)

    const palette = [];

    for (let i = 0; i < size; i++) {
      const ratio = i / (size - 1); // Interpolation ratio
      const r = Math.round(
        startColor[0] + ratio * (endColor[0] - startColor[0])
      );
      const g = Math.round(
        startColor[1] + ratio * (endColor[1] - startColor[1])
      );
      const b = Math.round(
        startColor[2] + ratio * (endColor[2] - startColor[2])
      );
      palette.push(`rgb(${r}, ${g}, ${b})`);
    }

    return palette;
  };

  const warmDrugs = new Set(
    Object.keys(drugColorMap).filter((drug) => colorMap[drug])
  );
  const unmappedDrugsCount = Object.keys(drugColorMap).length - warmDrugs.size;

  // Generate cool colors dynamically
  const coolColorPalette = generateCoolColorPalette(unmappedDrugsCount || 10);

  const getDrugColor = (drug) => {
    if (drugColorMap[drug]) {
      return drugColorMap[drug];
    } else {
      // Choose from the dynamically generated cool color palette
      const nextColor =
        coolColorPalette[
          Object.keys(drugColorMap).length % coolColorPalette.length
        ];
      drugColorMap[drug] = nextColor;
      return nextColor;
    }
  };

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
      .attr("transform", `translate(20, 20) scale(0.8)`); // Position legend at the top-left

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
    shapeMap.forEach((entry) => {
      let color = "#A9A9A9";

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
    // let drugYOffset = yOffset + 20;
    let drugYOffset = 0 + 20;
    let drugXOffset = 200;

    // Add legend title for drugs
    legendGroup
      .append("text")
      .attr("x", drugXOffset)
      .attr("y", drugYOffset - 10)
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Drugs: top to bottom");

    // Iterate through the reversed drugs array to create drug legend items
    const drugsReversed = [...data_global.drugs].reverse();

    // Update yOffset for the drug section (after the route section)
    drugYOffset = shapeMap.length * (legendItemSize + legendSpacing) + 20; // Adjusted to start after route section
    drugYOffset = 20; // Adjusted to start after route section

    drugsReversed.forEach((drug, index) => {
      // calculate color from drug
      const color = getDrugColor(drug.component.toLowerCase());

      // Update yOffset for each drug item
      const yOffsetForDrug =
        drugYOffset + index * (legendItemSize + legendSpacing);

      let xOffsetForDrug = drugXOffset;

      if (drug.shape === "droplet") {
        // Add teardrop shape
        legendGroup
          .append("path")
          .attr(
            "d",
            `M${10 + xOffsetForDrug},${
              yOffsetForDrug + legendItemSize / 2 - 10
            } 
             Q${0 + xOffsetForDrug},${yOffsetForDrug + legendItemSize / 2} 
             ${10 + xOffsetForDrug},${yOffsetForDrug + legendItemSize / 2 + 10} 
             Q${20 + xOffsetForDrug},${yOffsetForDrug + legendItemSize / 2} 
             ${10 + xOffsetForDrug},${
              yOffsetForDrug + legendItemSize / 2 - 10
            } Z`
          )
          .attr("fill", color)
          .attr("class", "legend-drug");
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
          .attr("fill", color)
          .attr("class", "legend-drug");
      } else if (drug.shape === "ellipse") {
        // Add ellipse shape
        legendGroup
          .append("ellipse")
          .attr("cx", drugXOffset + 10)
          .attr("cy", yOffsetForDrug + legendItemSize / 2)
          .attr("rx", 10)
          .attr("ry", 5)
          .attr("fill", color)
          .attr("class", "legend-drug");
      } else if (drug.shape === "cross-circle") {
        // Add circle with a cross
        legendGroup
          .append("circle")
          .attr("cx", drugXOffset + 10)
          .attr("cy", yOffsetForDrug + legendItemSize / 2)
          .attr("r", 10)
          .attr("fill", color)
          .attr("class", "legend-drug");

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
          .attr("stroke-width", 2)
          .attr("class", "legend-drug");
      }

      // Add text label for the drug name and route
      legendGroup
        .append("text")
        .attr("x", legendTextOffset + drugXOffset)
        .attr("y", yOffsetForDrug + legendItemSize / 2 + 5) // Vertically center text
        .style("font-size", "14px")
        .text(`${drug.component} (${drug.route})`)
        .attr("class", "legend-drug");
    });
  }, [data_global, zoom]); // Re-run effect whenever data_global changes

  useEffect(() => {
    let rightMove = 111 * zoom;

    // these would go in the data jsons, which I've removed for now since it's causing some errors
    if (data_global["Regimen_Start_Date"]) {
      setParsedStartDate(new Date(data_global["Regimen_Start_Date"]));
    } else {
    }
    // setParsedStartDate(Date(data_global["Regimen_Start_Date"]))
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

      g.call(xAxis);

      // Apply larger font size for tick labels and bolder axis line
      svg.selectAll(".tick text").style("font-size", "20px"); // Larger font size for tick labels
      svg.selectAll(".domain").style("stroke-width", "2px"); // Bolder axis line
    }

    const today = formatDate(new Date()); // Current date

    // const currentDatePosition = xScale(daysSinceStart / cycle_length_ub);

    let lastCycleDisplayed = 0;

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
        tickDate.setDate(parsedStartDate.getDate() + cumulativeDays + 1);

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
        `translate(${translate.x + margin.left}, ${
          height / 2 + translate.y + 200
        })`
      )
      .selectAll(".tick text") // Select all tick labels
      .each(function (d) {
        const textElement = d3.select(this);

        // Split the text content into cycle label and date label
        const [cycleLabel, dateLabel] = textElement.text().split("\n");

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
          // Get the current date
          const currentDate = new Date(today);
          const day = String(currentDate.getDate() + 1).padStart(2, "0");
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          textElement
            .append("tspan")
            .attr("x", 0) // Align horizontally at the tick
            .attr("dy", "1.5em") // Move the date label downward (adjusted)
            .style(
              "fill",
              // Check if the date is the current date
              //TODO: add a function to check for weekend and holidays together
              dateLabel === `${month}/${day}`
                ? "red" // Set to red if it is the current date
                : isWeekend(new Date(dateLabel)) || officeClosures[dateLabel]
                ? "violet" // Set to violet for weekends or closures
                : "black" // Default to black
            )
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
      data.drugs.forEach((drug, index) => {
        drug.shape = shapeMap[drug.route]; // Map the shape based on the drug route
      });
      // Remove existing blocks and afterimages
      svg
        .select(".axis-group")
        .selectAll(".drug-block, .drug-afterimage")
        .remove();

      // Iterate over each drug
      data.drugs.forEach((drug, drugIndex) => {
        let yOffset = -15 - drugIndex * 25; // Adjust vertical positioning

        let checked = false;

        // Iterate over each date in the cycle
        d3.range(0, dates + 1, 1 / cycle_length_ub).forEach((date) => {
          let currentDate = new Date(parsedStartDate);
          currentDate.setDate(
            currentDate.getDate() + 1 + date * cycle_length_ub
          );

          const isScheduledForDate = drug.days.some(
            (day) =>
              day.number ===
              (Math.round(date * cycle_length_ub) % cycle_length_ub) + 1
          );

          const tickPosition = xScale(date);
          const drugColor = getDrugColor(drug.component.toLowerCase());
          //TODO: change back once drug shadows are appearing
          // const drugColor = "rgba(1, 1, 1, 0.01)";

          // If drug is scheduled on this date, draw the main block
          if (isScheduledForDate) {
            drawDrugBlock(
              svg,
              drug,
              tickPosition,
              yOffset,
              drugColor,
              true,
              isScheduledForDate
            );
          }

          // Always try to draw afterimages, with more lenient conditions
          // const afterimageColor = `rgba(${hexToRgb(drugColor)}, 0.3)`;
          // const nextDate = date + 1 / cycle_length_ub;
          // const prevDate = date - 1 / cycle_length_ub;
          // // Check if adjacent dates have this drug scheduled
          // const isNextDateScheduled = drug.days.some(
          //   (day) =>
          //     day.number ===
          //     (Math.round(nextDate * cycle_length_ub) % cycle_length_ub) + 1
          // );
          // const isPrevDateScheduled = drug.days.some(
          //   (day) =>
          //     day.number ===
          //     (Math.round(prevDate * cycle_length_ub) % cycle_length_ub) + 1
          // );

          if (
            isScheduledForDate &&
            (isWeekend(currentDate) ||
              officeClosures.hasOwnProperty(currentDate))
          ) {
            console.log(currentDate);
            // Only generate afterimages under specific conditions
            let offsetDays = 1;
            let foundValidDate = false;
            let targetDate;

            while (!foundValidDate && offsetDays < 7) {
              // Limit search to prevent infinite loop
              const nextDate = new Date(currentDate); // Create a copy of the current date
              nextDate.setDate(nextDate.getDate() + offsetDays);

              const nextDateValue = nextDate.getTime() / (24 * 60 * 60 * 1000); // Convert to days
              const normalizedNextDate =
                Math.round(nextDateValue * cycle_length_ub) / cycle_length_ub;

              const prevDate = new Date(currentDate);
              prevDate.setDate(prevDate.getDate() - offsetDays);

              const prevDateValue = prevDate.getTime() / (24 * 60 * 60 * 1000); // Convert to days
              const normalizedPrevDate =
                Math.round(prevDateValue * cycle_length_ub) / cycle_length_ub;

              const isNextDateConflicting = data.drugs.some((d) =>
                d.days.some(
                  (day) =>
                    day.number ===
                    (Math.round(normalizedNextDate * cycle_length_ub) %
                      cycle_length_ub) +
                      1
                )
              );

              const isPrevDateConflicting = data.drugs.some((d) =>
                d.days.some(
                  (day) =>
                    day.number ===
                    (Math.round(normalizedPrevDate * cycle_length_ub) %
                      cycle_length_ub) +
                      1
                )
              );

              // Check forward for a valid date
              const isNextDateValid =
                !isWeekend(nextDate) &&
                !officeClosures.hasOwnProperty(nextDate) &&
                !isNextDateConflicting;
              // Check backward for a valid date
              const isPrevDateValid =
                !isWeekend(prevDate) &&
                !officeClosures.hasOwnProperty(prevDate) &&
                !isPrevDateConflicting;

              if (isNextDateValid) {
                foundValidDate = true;
                targetDate = nextDate;
              } else if (isPrevDateValid) {
                foundValidDate = true;
                targetDate = prevDate;
              } else {
                offsetDays++; // Increase search range
              }
            }

            // If a valid date is found, draw the afterimage
            if (foundValidDate) {
              // const afterimageColor = `rgba(${hexToRgb(drugColor)}, 0.3)`;
              const afterimageColor = "rgba(0, 0, 0, 1)";

              //TODO: adjust tickposition for aferimage
              // const adjustedTickPosition = xScale(date + offsetDays);
              const adjustedTickPosition = xScale(date);

              // Use drawDrugBlock instead of drawAfterimageShape
              drawDrugBlock(
                svg, // SVG element
                drug, // Drug object
                adjustedTickPosition, // X position on the timeline
                yOffset, // Y offset for placement
                afterimageColor, // Transparent color for afterimage
                false, // Indicates this is an afterimage, not a main block
                isScheduledForDate
              );
            }
          }
        });
      });
    }

    function drawDrugBlock(
      svg,
      drug,
      tickPosition,
      yOffset,
      color,
      isMainBlock,
      isScheduledForDate
    ) {
      // if (!isMainBlock) {
      //   console.log(
      //     svg,
      //     drug,
      //     tickPosition,
      //     yOffset,
      //     color,
      //     isMainBlock,
      //     isScheduledForDate
      //   );
      // }
      let drugBlock;
      switch (drug.shape) {
        case "droplet":
          drugBlock = svg
            .select(".axis-group")
            .append("path")
            .attr("class", isMainBlock ? "drug-block" : "drug-afterimage")
            .attr(
              "d",
              `M${tickPosition},${yOffset} 
                         Q${tickPosition - 10},${yOffset + 10} 
                         ${tickPosition},${yOffset + 10 + 10} 
                         Q${tickPosition + 10},${yOffset + 10} 
                         ${tickPosition},${yOffset} Z`
            )
            .attr("fill", color);
          break;
        case "arrow":
          drugBlock = svg
            .select(".axis-group")
            .append("polygon")
            .attr("class", isMainBlock ? "drug-block" : "drug-afterimage")
            .attr(
              "points",
              `${tickPosition - 10},${yOffset + 10} 
                         ${tickPosition},${yOffset} 
                         ${tickPosition + 10},${yOffset + 10} 
                         ${tickPosition},${yOffset + 20}`
            )
            .attr("fill", color);
          break;
        case "ellipse":
          drugBlock = svg
            .select(".axis-group")
            .append("ellipse")
            .attr("class", isMainBlock ? "drug-block" : "drug-afterimage")
            .attr("cx", tickPosition)
            .attr("cy", yOffset + 10)
            .attr("rx", 10)
            .attr("ry", 5)
            .attr("fill", color);
          break;
        case "cross-circle":
          drugBlock = svg
            .select(".axis-group")
            .append("circle")
            .attr("class", isMainBlock ? "drug-block" : "drug-afterimage")
            .attr("cx", tickPosition)
            .attr("cy", yOffset + 10)
            .attr("r", 10)
            .attr("fill", color);

          // Add the cross inside the circle
          const crossColor = isScheduledForDate ? "black" : "transparent";
          svg
            .select(".axis-group")
            .append("path")
            .attr("class", isMainBlock ? "drug-block" : "drug-afterimage")
            .attr(
              "d",
              `M${tickPosition - 5},${yOffset + 10}
                         H${tickPosition + 5}
                         M${tickPosition},${yOffset + 5}
                         V${yOffset + 15}`
            )
            .attr("stroke", crossColor)
            .attr("stroke-width", 2);
          break;
        default:
          break;
      }

      // Add interactivity to the block
      addBlockInteractivity(drugBlock, color, drug);

      return drugBlock;
    }

    // function generateDrugGroups(data, svg, xScale, dates) {
    //   // Remove any existing blocks to avoid duplication
    //   svg.select(".axis-group").selectAll(".drug-block").remove();

    //   const colorScheme = d3.schemeTableau10;
    //   const colorScale = d3.scaleOrdinal(colorScheme);

    //   //TODO: get a map of chemo/non-chemo drugs and add corresponding colors

    //   // Define the minimum and maximum number of sides for the polygons
    //   // const minSides = 3;
    //   // const maxSides = Math.min(10, minSides + data.drugs.length - 1); // Limit max sides to avoid overly complex shapes

    //   // Dynamically calculate the number of sides for each drug
    //   //TODO: informed method of assigning drug colors/shapes (shape doesn't have to equal #sides)
    //   data.drugs.forEach((drug, index) => {
    //     drug.shape = shapeMap[drug.route]; // Map the shape based on the drug route
    //   });

    //   // const getPolygonPoints = (cx, cy, radius, sides) => {
    //   //   const angleStep = (2 * Math.PI) / sides;
    //   //   return Array.from({ length: sides }, (_, i) => {
    //   //     const angle = i * angleStep - Math.PI / 2; // Start pointing upwards
    //   //     const x = cx + radius * Math.cos(angle);
    //   //     const y = cy + radius * Math.sin(angle);
    //   //     return `${x},${y}`;
    //   //   }).join(" ");
    //   // };

    //   // Iterate over each day within the specified date range
    //   d3.range(0, dates + 1, 1 / cycle_length_ub).forEach((date) => {
    //     // Get the current date object from the scaled date value
    //     //TODO: make sur ethis
    //     const currentDate = new Date(date);
    //     currentDate.setDate(currentDate.getDate() + Math.floor(date));

    //     // Check if the date is a weekend or holiday
    //     const formattedDate = `${String(currentDate.getMonth() + 1).padStart(
    //       2,
    //       "0"
    //     )}/${String(currentDate.getDate()).padStart(2, "0")}`;
    //     const isHoliday = officeClosures.hasOwnProperty(formattedDate);
    //     const isOnWeekend = isWeekend(currentDate);

    //     // Track the vertical position offset for each drug block on the same date
    //     let yOffset = -15;

    //     // Iterate over each drug in the data
    //     data.drugs.forEach((drug, index) => {
    //       // Check if the drug is scheduled for the current date
    //       const isScheduledForDate = drug.days.some(
    //         (day) =>
    //           day.number ===
    //           (Math.round(date * cycle_length_ub) % cycle_length_ub) + 1
    //       );

    //       // If scheduled, create a block for this drug on this date
    //       const tickPosition = xScale(date);
    //       let drugBlock;

    //       // Get the unique color and shape for each drug
    //       const drugColor = isScheduledForDate
    //         ? getDrugColor(drug.component.toLowerCase())
    //         : "transparent";

    //       if (drug.shape === "droplet") {
    //         // Create a teardrop shape
    //         drugBlock = svg
    //           .select(".axis-group")
    //           .append("path")
    //           .attr("class", "drug-block")
    //           .attr(
    //             "d",
    //             `M${tickPosition},${yOffset + 10 - 10}
    //                Q${tickPosition - 10},${yOffset + 10}
    //                ${tickPosition},${yOffset + 10 + 10}
    //                Q${tickPosition + 10},${yOffset + 10}
    //                ${tickPosition},${yOffset + 10 - 10} Z`
    //           )
    //           .attr("fill", drugColor);
    //       } else if (drug.shape === "arrow") {
    //         // Create an arrow shape
    //         drugBlock = svg
    //           .select(".axis-group")
    //           .append("polygon")
    //           .attr("class", "drug-block")
    //           .attr(
    //             "points",
    //             `${tickPosition - 10},${yOffset + 10}
    //                ${tickPosition},${yOffset}
    //                ${tickPosition + 10},${yOffset + 10}
    //                ${tickPosition},${yOffset + 20}`
    //           )
    //           .attr("fill", drugColor);
    //       } else if (drug.shape === "ellipse") {
    //         // Create an ellipse
    //         drugBlock = svg
    //           .select(".axis-group")
    //           .append("ellipse")
    //           .attr("class", "drug-block")
    //           .attr("cx", tickPosition)
    //           .attr("cy", yOffset + 10)
    //           .attr("rx", 10)
    //           .attr("ry", 5)
    //           .attr("fill", drugColor);
    //       } else if (drug.shape === "cross-circle") {
    //         // Create a circle with a cross inside
    //         drugBlock = svg
    //           .select(".axis-group")
    //           .append("circle")
    //           .attr("class", "drug-block")
    //           .attr("cx", tickPosition)
    //           .attr("cy", yOffset + 10)
    //           .attr("r", 10)
    //           .attr("fill", drugColor);

    //         // Add the cross inside the circle
    //         const crossColor = isScheduledForDate ? "black" : "transparent";
    //         svg
    //           .select(".axis-group")
    //           .append("path")
    //           .attr("class", "drug-block")
    //           .attr(
    //             "d",
    //             `M${tickPosition - 5},${yOffset + 10}
    //                H${tickPosition + 5}
    //                M${tickPosition},${yOffset + 5}
    //                V${yOffset + 15}`
    //           )
    //           .attr("stroke", crossColor)
    //           .attr("stroke-width", 2);
    //       }

    //       // Append a colored block to the .axis-group for each scheduled date

    //       if (isScheduledForDate) {
    //         addBlockInteractivity(drugBlock, drugColor, drug);
    //       }

    //       // Leave space for weekends/holidays if no drug is scheduled
    //       if (isOnWeekend || isHoliday) {
    //         let offsetDays = 1; // Start checking from the nearest adjacent date
    //         let foundValidDate = false;

    //         while (!foundValidDate) {
    //           const nextDate = new Date(currentDate); // Create a copy of the currentDate
    //           nextDate.setDate(currentDate.getDate() + offsetDays); // Move forward by offsetDays

    //           const prevDate = new Date(currentDate); // Create another copy of the currentDate
    //           prevDate.setDate(currentDate.getDate() - offsetDays); // Move backward by offsetDays

    //           // Check forward for the closest valid date
    //           const isNextDateValid =
    //             !isWeekend(nextDate) &&
    //             !officeClosures.hasOwnProperty(nextDate) &&
    //             !data.drugs.some((d) =>
    //               d.days.some(
    //                 (day) =>
    //                   day.number ===
    //                   (Math.round(nextDate.getTime() / cycle_length_ub) %
    //                     cycle_length_ub) +
    //                     1
    //               )
    //             );

    //           // Check backward for the closest valid date
    //           const isPrevDateValid =
    //             !isWeekend(prevDate) &&
    //             !officeClosures.hasOwnProperty(prevDate) &&
    //             !data.drugs.some((d) =>
    //               d.days.some(
    //                 (day) =>
    //                   day.number ===
    //                   (Math.round(prevDate.getTime() / cycle_length_ub) %
    //                     cycle_length_ub) +
    //                     1
    //               )
    //             );

    //           if (isNextDateValid) {
    //             foundValidDate = true;
    //             drawAfterimageShape(drug, nextDate, yOffset);
    //           } else if (isPrevDateValid) {
    //             foundValidDate = true;
    //             drawAfterimageShape(drug, prevDate, yOffset);
    //           } else {
    //             offsetDays++; // Increase search range
    //           }
    //         }
    //       }

    //       // Function to draw afterimages with transparency
    //       function drawAfterimageShape(drug, targetDate, yOffset) {
    //         const tickPosition = xScale(targetDate.getTime());
    //         const afterimageColor = `rgba(${hexToRgb(drugColor)}, 0.3)`; // Always apply transparency for fuzziness
    //         if (drug.shape === "droplet") {
    //           svg
    //             .select(".axis-group")
    //             .append("path")
    //             .attr("class", "drug-afterimage")
    //             .attr(
    //               "d",
    //               `M${tickPosition},${yOffset + 10 - 10}
    //        Q${tickPosition - 10},${yOffset + 10}
    //        ${tickPosition},${yOffset + 10 + 10}
    //        Q${tickPosition + 10},${yOffset + 10}
    //        ${tickPosition},${yOffset + 10 - 10} Z`
    //             )
    //             .attr("fill", afterimageColor);
    //         } else if (drug.shape === "arrow") {
    //           svg
    //             .select(".axis-group")
    //             .append("polygon")
    //             .attr("class", "drug-afterimage")
    //             .attr(
    //               "points",
    //               `${tickPosition - 10},${yOffset + 10}
    //        ${tickPosition},${yOffset}
    //        ${tickPosition + 10},${yOffset + 10}
    //        ${tickPosition},${yOffset + 20}`
    //             )
    //             .attr("fill", afterimageColor);
    //         } else if (drug.shape === "ellipse") {
    //           svg
    //             .select(".axis-group")
    //             .append("ellipse")
    //             .attr("class", "drug-afterimage")
    //             .attr("cx", tickPosition)
    //             .attr("cy", yOffset + 10)
    //             .attr("rx", 10)
    //             .attr("ry", 5)
    //             .attr("fill", afterimageColor);
    //         } else if (drug.shape === "cross-circle") {
    //           svg
    //             .select(".axis-group")
    //             .append("circle")
    //             .attr("class", "drug-afterimage")
    //             .attr("cx", tickPosition)
    //             .attr("cy", yOffset + 10)
    //             .attr("r", 10)
    //             .attr("fill", afterimageColor);

    //           svg
    //             .select(".axis-group")
    //             .append("path")
    //             .attr("class", "drug-afterimage-cross")
    //             .attr(
    //               "d",
    //               `M${tickPosition - 5},${yOffset + 10}
    //        H${tickPosition + 5}
    //        M${tickPosition},${yOffset + 5}
    //        V${yOffset + 15}`
    //             )
    //             .attr("stroke", "rgba(0, 0, 0, 0.3)")
    //             .attr("stroke-width", 2);
    //         }
    //       }

    // // Helper function to convert hex color to RGB
    function hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
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

    //       // Increment yOffset to avoid overlapping blocks on the same date
    //       yOffset -= 25;
    //     });
    //   });
    // }

    // Ensure axis-group exists in the SVG
    svg.append("g").attr("class", "axis-group");

    generateDrugGroups(data_global, svg, newXScale, dates);

    // svg
    //   .select(".axis-group")
    //   .selectAll(".drug-afterimage")
    //   .attr("transform", () => {
    //     // Get the SVG's total width and calculate the center
    //     const svgWidth = +svg.attr("width");
    //     const centerX = svgWidth / 2;

    //     // Return a translation to move the afterimage to the center
    //     return `translate(${centerX}, 0)`;
    //   });

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
        height="440"
        style={{ marginTop: "20px", userSelect: "none", display: "flex" }}
      />
    </div>
  );
}
