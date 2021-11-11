// IDEAS FOR SELECTING LINES
// - add some sort of larger margin that makes the selection easier
// IDEAS FOR SELECTING CIRCLES
// - store circles and lines in lists so they can be drawn in correct order later

// FOR NEW VISUALIZATION ADD BELOW CURRENT VISUALIZATION
// ADD DROP DOWN MENU BELOW THE LISTING FOR EACH OF THE EMPIRES

// LIST OF THINGS TO DO:
// Clean up the code
// Add comments to the code
// Change variable names to be more intuitive and easier to understand
// Draw connectors first then circles so the selection is in the right order
// If there is overlap between two connectors, then select both of them and change both their opacities. Display both info
// ^ consult prof about idea above
// Think about possibly scaling the size of the svg so it fits better sometimes with different data
// Fill in the holes for the current data so there's a birth and death date for all rulers
// Add death date in the graph and make it considered for the range
// Change color depending on which empire
// add variables for graph translations

const DATA_LOCATION = "./data/timelineData_1.json";
const hTranslation = 50;

let public_data = {}; // store all data in json in this dictionary
let case_graph_rectangles = {}; // store data on all rectangles in staircase graph

let margin = { top: 20, right: 80, bottom: 30, left: 70 },
  // make the width variable for the chart and the height variable according to the margins
  width = 2000 - margin.left - margin.right,
  height = 1700 - margin.top - margin.bottom,
  vMargin = margin.top + margin.bottom,
  hMargin = margin.right + margin.left;

let caseGraphHeight = 800;
let caseGraphWidth = width - 500;

// create the svg and append to svg variable to call again later and put it in body section of html
let svg = d3
  .select("body")
  .append("svg")
  // setting the width and height attributes of the svg using the marging vars defined above
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  // use .append("g") to append all svg elements to the DOM
  .append("g")
  // translate the svg by the margins
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let empire_list = [
  "mughal_empire",
  "sikh_gurus",
  "ahom_empire",
  "maratha_empire",
  "vijayanagar_empire",
];
let empire_dictionary = {
  mughal_empire: 0,
  sikh_gurus: 1,
  ahom_empire: 2,
  maratha_empire: 3,
  vijayanagar_empire: 4,
};

// console.log(d3.schemeCategory10);

let timelineX = d3.scaleLinear().range([0, caseGraphWidth]), // not scaled
  x2 = d3.scaleLinear().range([0, caseGraphWidth]), // scaled
  x3 = d3.scaleLinear().range([0, caseGraphWidth]), // staircase axis
  x4 = d3.scaleOrdinal(), // left axis
  colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(empire_list); // colors for empires

let timeAxis = d3.axisBottom(timelineX).tickFormat(function(d) {return d.toString();}), // not scaled
  scaledTimeAxis = d3.axisBottom(x2).tickFormat(function(d) {return d.toString();}), // scaled
  timeAxis3 = d3.axisBottom(x3).tickFormat(function(d) {return d.toString();}); // convert's date to string so there's no comma (1,600 --> 1600)
  // timeAxis4 = d3.axisLeft(x4).tickSize(0).tickFormat(""); // the formatting removes the labels

let tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

let context = svg.append("g")
  .attr("class", "context")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let brush = d3
  .brushX()
  .extent([
    [hTranslation, 300],
    [width + 80, 520],
  ])
  .on("brush", brushed);

let brush_label_1 = svg.append("text")
  .attr("class", "brush_label_1")
  .attr("text-anchor", "middle")
  .attr("y", (height - caseGraphHeight) / 2 - 130);
let brush_label_2 = svg.append("text")
  .attr("class", "brush_label_2")
  .attr("text-anchor", "middle")
  .attr("y", (height - caseGraphHeight) / 2 - 130);

empire_data = {};

empire_list.forEach((item) => {
  empire_data[item] = {};
});

function getTimelineData() {
  return d3.json(DATA_LOCATION).then((data) => {
    public_data = data;
  });
}

function drawTimeline(data) {
  let empires_list = Object.keys(data);
  public_data = data;
  timelineX.domain([1200, 1850]);
  x2.domain([1200, 1850]);
  let counter = 1;
  let distance_1 = 30;
  let scaleDistance_1 = 30;
  empires_list.forEach((item) => {
    let rulers_list = Object.keys(data[item]);
    empire_data[item] = data[item];
    let name = "default";
    switch (item) {
      case "mughal_empire":
        name = "Mughal Empire";
        break;
      case "sikh_gurus":
        name = "Sikh Gurus";
        break;
      case "ahom_empire":
        name = "Ahom Empire";
        break;
      case "maratha_empire":
        name = "Maratha Empire";
        break;
      case "vijayanagar_empire":
        name = "Vijayanagar Empire";
    }

    svg.append("text")
      .attr("x", 0)
      .attr("y", distance_1 * counter + 310)
      .attr("text-anchor", "begin")
      .text(name);

    rulers_list.forEach(function (ruler) {
      let ruler_1 = data[item][ruler];
      let distance = distance_1 * counter + 300;
      let scaleDistance = scaleDistance_1 * counter;

      var lines = svg
        .append("line")
        .attr("x1", timelineX(ruler_1.begin) + hTranslation)
        .attr("y1", distance)
        .attr("x2", timelineX(ruler_1.end) + hTranslation)
        .attr("y2", distance)
        .style("stroke-width", "1")
        .style("stroke", colorScale(item));

      var begin = svg
        .append("circle")
        .attr("cx", timelineX(ruler_1.begin) + hTranslation)
        .attr("cy", distance)
        .attr("r", 3.5)
        .style("fill", colorScale(item));

      var end = svg
        .append("circle")
        .attr("cx", timelineX(ruler_1.end) + hTranslation)
        .attr("cy", distance)
        .attr("r", 3.5)
        .style("fill", colorScale(item));

      var scaleLines = svg
        .append("line")
        .attr("class", "connectors")
        .attr("begin", ruler_1.begin)
        .attr("end", ruler_1.end)
        .attr("x1", x2(ruler_1.begin) + hTranslation)
        .attr("y1", scaleDistance)
        .attr("x2", x2(ruler_1.end) + hTranslation)
        .attr("y2", scaleDistance)
        .style("stroke-width", "3")
        .style("stroke", colorScale(item))
        .on("mouseover", function (d) {
          scaleLines.style("opacity", 0.4);
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.style("border-color", colorScale(item));
          tooltip
            .html("<p>" + name + "</p>")
            .style("left", d3.event.pageX + 20 + "px")
            .style("top", d3.event.pageY + "px");
        })
        .on("mouseout", function (d) {
          scaleLines.style("opacity", 1);
          tooltip.transition().duration(500).style("opacity", 0);
        });

      var scaleBegin = svg
        .append("circle")
        .attr("class", "begin")
        .attr("begin", ruler_1.begin)
        .attr("cx", x2(ruler_1.begin) + hTranslation)
        .attr("cy", scaleDistance)
        .attr("r", 5)
        .style("fill", colorScale(item))
        .on("mouseover", function (d) {
          scaleBegin.style("opacity", 0.4);
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.style("border-color", colorScale(item));
          tooltip
            .html("<p>" + name + "<p>")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function (d) {
          scaleBegin.style("opacity", 1);
          tooltip.transition().duration(500).style("opacity", 0);
        });

      var scaleEnd = svg
        .append("circle")
        .attr("class", "end")
        .attr("end", ruler_1.end)
        .attr("cx", x2(ruler_1.end) + hTranslation)
        .attr("cy", scaleDistance)
        .attr("r", 5)
        .style("fill", colorScale(item))
        .on("mouseover", function (d) {
          scaleEnd.style("opacity", 0.4);
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip
            .html("<p>" + name + "<p>")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function (d) {
          scaleEnd.style("opacity", 1);
          tooltip.transition().duration(500).style("opacity", 0);
        });
    });
    counter += 1;
  });

  var scaledAxis = svg
    .append("g")
    .attr("class", "time-axis2")
    .attr("transform", "translate(" + hTranslation + ", 210)")
    .call(scaledTimeAxis);
  var axis = svg
    .append("g")
    .attr("class", "time-axis")
    .attr("transform", "translate(" + hTranslation + ", 520)")
    .call(timeAxis);
  var brusher = svg
    .append("g")
    .call(brush)
    .call(brush.move, [x2(1500) + hTranslation, x2(1600) + hTranslation]);


  d3.selectAll("g.time-axis2 g.tick")
    .style("font-size", "16px");
  d3.selectAll("g.time-axis g.tick")
    .style("font-size", "16px");
}

d3.select(".dropdown").on("change", function (d) {
  clearGraph();
  let empire = d3.select(this).property("value");
  drawCaseGraph(empire, public_data);
});

function clearGraph() {
  // d3.select(".time-axis-3").remove();
  d3.select(".time-axis-4").remove();
  d3.selectAll(".ruler_name").remove();
  d3.selectAll(".ruler_rectangle").remove();
  d3.select(".case-graph-title").remove();
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

function drawCaseGraph(empire, data) {

  case_graph_rectangles[empire] = [];
  // console.log("type: ", typeof(case_graph_rectangles[empire]));
  let name = "default";
  switch (empire) {
    case "mughal_empire":
      name = "Mughal Empire";
      break;
    case "sikh_gurus":
      name = "Sikh Gurus";
      break;
    case "ahom_empire":
      name = "Ahom Empire";
      break;
    case "maratha_empire":
      name = "Maratha Empire";
      break;
    case "vijayanagar_empire":
      name = "Vijayanagar Empire";
  }
  let empire_data = data[empire];
  let rulers = Object.keys(empire_data);
  let num = rulers.length;
  // console.log(num);
  let div = caseGraphHeight / num;
  // console.log(div);
  let range = Array(num + 1)
    .fill()
    .map((_, idx) => idx * div + caseGraphHeight + 50);
  // console.log(range);
  x4.domain(rulers);
  x4.range(range);

  let orig_domain = timelineUtils.findRange(data[empire]);
  domain = timelineUtils.roundRange(orig_domain);
  // console.log("domain: ", domain)
  x3.domain(domain);

  // timelineUtils.roundRange(domain);

  rulers.forEach(function (d) {
    let ruler = empire_data[d];
    // console.log("x:", x3(ruler.birth));
    // console.log("y:", x4(d));
    let x_start_1 = x3(ruler.birth);
    let x_end_1 = x3(ruler.begin);
    let x_end_2 = x3(ruler.end);
    let x_end_3 = x3(ruler.death);
    // console.log("ruler:", d);
    // console.log("x_end_2:", x_end_2);
    // console.log("x_end_3:", x_end_3);
    let y = x4(d);

    let rect_1 = svg.append("rect")
      .attr("class", "ruler_rectangle")
      .attr("x", x_start_1 + hTranslation)
      .attr("y", y)
      .attr("width", x_end_1 - x_start_1)
      .attr("height", div)
      .attr("fill", "gray")
      .attr("opacity", 0.75)
      .on("mouseover", function () {
        // console.log(d3.event.pageX);
        // console.log(d3.event.pageY);
        rect_1.style("opacity", 0.4);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.style("border-color", "blue");
        tooltip
          .html(timelineUtils.getToolTipHTMLString(d, ruler))
          .style("left", d3.event.pageX + 20 + "px")
          .style("top", d3.event.pageY + "px");
      })
      .on("mouseout", function () {
        rect_1.style("opacity", 0.75);
        tooltip.transition().duration(500).style("opacity", 0);
      });
    let rect_2 = svg.append("rect")
      .attr("class", "ruler_rectangle")
      .attr("x", x_end_1 + hTranslation)
      .attr("y", y)
      .attr("width", x_end_2 - x_end_1)
      .attr("height", div)
      .attr("fill", d3.schemeCategory10[empire_dictionary[empire]])
      .attr("opacity", 0.75)
      .on("mouseover", function () {
        // console.log(d3.event.pageX);
        // console.log(d3.event.pageY);
        rect_2.style("opacity", 0.4);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.style("border-color", "blue");
        tooltip
          .html(timelineUtils.getToolTipHTMLString(d, ruler))
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })
      .on("mouseout", function () {
        rect_2.style("opacity", 0.75);
        tooltip.transition().duration(500).style("opacity", 0);
      });
    let rect_3 = svg.append("rect")
      .attr("class", "ruler_rectangle")
      .attr("x", x_end_2 + hTranslation)
      .attr("y", y)
      .attr("width", x_end_3 - x_end_2)
      .attr("height", div)
      .attr("fill", "red")
      .attr("opacity", 0.75)
      .on("mouseover", function () {
        rect_3.style("opacity", 0.4);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.style("border-color", "blue");
        tooltip
          .html(timelineUtils.getToolTipHTMLString(d, ruler))
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
      })
      .on("mouseout", function () {
        rect_3.style("opacity", 0.75);
        tooltip.transition().duration(500).style("opacity", 0);
      });
    svg.append("text")
      .style("font-size", "18px")
      .attr("class", "ruler_name")
      .attr("x", x_start_1 + hTranslation)
      .attr("y", y + div / 2)
      .attr("text-anchor", "end")
      .text(d);
    let text_width = getTextWidth(d, "times");
    case_graph_rectangles[empire].push({
      "width" : x_end_3 - x_start_1,
      "height" : div,
      "x" : x_start_1 + hTranslation - 2 * text_width,
      "y" : y
    });
  });

  // add axes for graph
  // var axis_1 = svg.append("g")
  //   .attr("class", "time-axis-3")
  //   .attr("transform", "translate(" + hTranslation + ", 0)")
    // .call(timeAxis4);
  var axis_2 = svg.append("g")
    .style("font-size", "18px")
    .style("font-family", "times")
    .attr("class", "time-axis-4")
    .attr("transform", "translate(" + hTranslation + ", " + (height) + ")")
    .call(timeAxis3);
  
  // add title
  svg.append("text")
      .attr("x", caseGraphWidth / 2)
      .attr("y", caseGraphHeight)
      .attr("class", "case-graph-title")
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text(" " + name + " (" + orig_domain[0] + "-" + orig_domain[1] + ")");
  adjustVerticalTickLengths(d3.select(".dropdown").property("value"));
}

function drawLegend() {
  
  let legend = svg.append("g")
    .selectAll("rect")
    .data(empire_list)
    .enter()
    .append("rect")
    .attr("x", 1725)
    .attr("y", (d, i) => {return 125 + i * 30})
    .attr("width", 25)
    .attr("height", 25)
    .attr("fill", (d) => {return colorScale(d)});

  svg.append("g")
    .selectAll("text")
    .data(empire_list)
    .enter()
    .append("text")
    .attr("x", 1755)
    .attr("y", (d, i) => {return 140 + i * 30})
    .text((d) => {
      switch (d) {
        case "mughal_empire":
          return "Mughal Empire";
        case "sikh_gurus":
          return "Sikh Gurus";
        case "ahom_empire":
          return "Ahom Empire";
        case "maratha_empire":
          return "Maratha Empire";
        case "vijayanagar_empire":
          return "Vijayanagar Empire";
      }
      return "default";
    });

    svg.append("rect")
      .attr("x", 1725)
      .attr("y", 155 + 30 * empire_list.length)
      .attr("width", 25)
      .attr("height", 25)
      .attr("fill", "grey");
    svg.append("rect")
      .attr("x", 1725)
      .attr("y", 185 + 30 * empire_list.length)
      .attr("width", 25)
      .attr("height", 25)
      .attr("fill", "red");
    svg.append("text")
      .attr("x", 1755)
      .attr("y", 170 + 30 * empire_list.length)
      .text("Date of Birth to Beginning of Reign")
    svg.append("text")
      .attr("x", 1755)
      .attr("y", 200 + 30 * empire_list.length)
      .text("End of Reign to Death")
    
}

function getRectangleHeight(x_coor, rectangle_info, graph_height) {
    let height = -graph_height + 50;
    let rect_height = 0;
    let height_counter = 0;
    rectangle_info.forEach((d) => {
      rect_height = d.height;
      height_counter += 1;
      if (x_coor >= d.x) {
        height += height_counter * d.height;
        height_counter = 0;
      }
      // console.log("x_coor: ", x_coor, " d.x: ", d.x, " height: ", height);
    });
    return height;
  }

function adjustVerticalTickLengths(empire) {
  // console.log(case_graph_rectangles);
  svg.selectAll("g.time-axis-4 g.tick line")
    .attr("y2", (d) => {
      // console.log("datum: ", d);
      // console.log("x-coor?:", x3(d) + hTranslation);
      let height = getRectangleHeight(x3(d) + hTranslation, case_graph_rectangles[empire], caseGraphHeight + 50);
      // console.log("height: ", height);
      return height;
    });
}

function updateNodes() {
  svg.selectAll("circle.begin").attr("cx", function () {
    return timelineX(d3.select(this).attr("begin")) + hTranslation;
  });

  svg.selectAll(".connectors")
    .attr("x1", function () {
      return timelineX(d3.select(this).attr("begin")) + hTranslation;
    })
    .attr("x2", function () {
      return timelineX(d3.select(this).attr("end")) + hTranslation;
    });

  svg.selectAll("circle.end").attr("cx", function () {
    return timelineX(d3.select(this).attr("end")) + hTranslation;
  });

  svg.selectAll(".labels").attr("x", function () {
    return (
      timelineX(d3.select(this).attr("begin") - d3.select(this).attr("duration") / 2) + hTranslation
    );
  });
}

d3.select(".dropdown")
  .selectAll("myOptions")
  .data(empire_list)
  .enter()
  .append("option")
  .attr("value", function (d) {
    return d;
  })
  .text(function (item) {
    switch (item) {
      case "mughal_empire":
        return "Mughal Empire";
      case "sikh_gurus":
        return "Sikh Gurus";
      case "ahom_empire":
        return "Ahom Empire";
      case "maratha_empire":
        return "Maratha Empire";
      case "vijayanagar_empire":
        return "Vijayanagar Empire";
    }
    return "default";
  });

function brushed(d) {

  let brush_begin = d3.event.selection[0] - hTranslation;
  let brush_end = d3.event.selection[1] - hTranslation;

  let axis_brush_begin = x2.invert(brush_begin);
  let axis_brush_end = x2.invert(brush_end);

  d3.select(".brush_label_1")
    .attr("x", brush_begin + hTranslation)
    .text(Math.round(axis_brush_begin));

  d3.select(".brush_label_2")
    .attr("x", brush_end + hTranslation)
    .text(Math.round(axis_brush_end));

  timelineX.domain([axis_brush_begin, axis_brush_end]);
  svg.select(".time-axis2").call(timeAxis);

//   updateDates();
  updateNodes();
}

async function main() {

  svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", caseGraphWidth)
    .attr("height", height)
    .attr("transform", "translate(" + hTranslation + "," + margin.top + ")");


  await getTimelineData();
  drawTimeline(public_data);
  drawCaseGraph("mughal_empire", public_data);
  drawLegend();
}

main();