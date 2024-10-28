import { range, rollup, extent, InternSet } from "d3-array";
import { scaleLinear, scaleBand } from "d3-scale";
import { select } from "d3-selection";
import { axisTop, axisLeft } from "d3-axis";

export default function BalanceChart(data, {
    marginTop = 30, // top margin, in pixels
    marginRight = 40, // right margin, in pixels
    marginBottom = 10, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 300, // outer width of chart, in pixels
    height, // the outer height of the chart, in pixels
    xDomain = [-1, 1], // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yPadding = 0.5, // amount of y-range to reserve to separate bars
    colors = ["lightgrey", "lightblue"]
  } = {}, passed_svg) {
    // Compute values.
    const X = data.map(d => d.frequency);
    const Y = data.map(d => d.y_coord);

    // Compute default domains, and unique the y-domain.
    if (xDomain === undefined) xDomain = extent(X);
    const yDomain = new InternSet(Y);

    // Omit any data not present in the y-domain.
    // Lookup the x-value for a given y-value.
    const I = range(X.length).filter(i => yDomain.has(Y[i]));
    const YX = rollup(I, ([i]) => X[i], i => Y[i]);

    // Compute the default height.
    if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
    const yRange = [marginTop, height - marginBottom];

    // Construct scales, axes, and formats.
    const xScale = scaleLinear(xDomain, xRange);
    const yScale = scaleBand(yDomain, yRange).padding(yPadding);
    const xAxis = axisTop(xScale).ticks(width / 80, "%");
    const yAxis = axisLeft(yScale).tickSize(0).tickPadding(6);
    const format = xScale.tickFormat(100, "%");

    // Compute titles.
    const title = i => `${Y[i]}\n${format(X[i])}`;

    // const svg = select("#balance").append("svg")

    const g = passed_svg  //.append('g')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    g.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(xAxis.tickFormat("").ticks(""))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", height - marginTop - marginBottom)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", xScale(0))
            .attr("y", -10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "center")
            .text(""));

    const bar = g.append("g")
      .selectAll("rect")
      .data(I)
      .join("rect")
        .attr("fill", i => colors[X[i] > 0 ? colors.length - 1 : 0])
        .attr("x", i => Math.min(xScale(0), xScale(X[i])))
        .attr("y", i => yScale(Y[i]))
        .attr("width", i => Math.abs(xScale(X[i]) - xScale(0)))
        .attr("height", yScale.bandwidth())
      .append("title")
        .text(title);

    // Percentage at the bar charts extremities
    g.append("g")
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("opacity", 0.5)
        .attr("fill", "black")
      .selectAll("text")
      .data(I)
      .join("text")
        .attr("text-anchor", i => X[i] < 0 ? "end" : "start")
        .attr("x", i => xScale(X[i]) + Math.sign(X[i] - 0) * 4)
        .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(i => format(Math.abs(X[i])));

    // Bar chart labels
    g.append("g")
        .attr("transform", `translate(${xScale(0)},-12)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick text")
          .filter(y => YX.get(y))
              .attr("opacity", 0.5)
            .attr("text-anchor", "middle"));

    return g.node();
  }