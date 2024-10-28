import { range, rollup, InternSet } from "d3-array";
import { scaleLinear, scaleBand } from "d3-scale";
import { select } from "d3-selection";
import { axisTop, axisLeft } from "d3-axis";

export default function WordShiftChart(data, {
    title, // given d in data, returns the title text
    topN = 40,
    marginTop = 30, // top margin, in pixels
    marginRight = 40, // right margin, in pixels
    marginBottom = 10, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 300, // outer width of chart, in pixels
    height = 740, // the outer height of the chart, in pixels
    xRange = [marginLeft, width - marginRight], // [left, right]
    xLabel = "← System 1 · Divergence contribution · System 2 →", // a label for the x-axis
    yPadding = 0.2, // amount of y-range to reserve to separate bars
    yDomain, // an array of (ordinal) y-values
    yRange, // [top, bottom]
    colors = ["lightgrey", "lightblue"]
  } = {}, passed_svg) {

    // Compute values.
    const X = data['dat'].slice(0, topN).map(d => d.metric);
    const Y = data['dat'].slice(0, topN).map(d => d.type);

    // Compute default domains, and unique the y-domain.
    if (yDomain === undefined) yDomain = Y;
    yDomain = new InternSet(yDomain);

    // Omit any data not present in the y-domain.
    // Lookup the x-value for a given y-value.
    const I = range(X.length).filter(i => yDomain.has(Y[i]));
    const YX = rollup(I, ([i]) => X[i], i => Y[i]);

    // Compute the default height.
    if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
    if (yRange === undefined) yRange = [marginTop, height - marginBottom];

    // Construct scales, axes, and formats.
    const xScale = scaleLinear([-data['max_shift']*1.5, data['max_shift']*1.5], xRange);
    const yScale = scaleBand(yDomain, yRange).padding(yPadding);
    const xAxis = axisTop(xScale).ticks(width / 80, "%");
    const yAxis = axisLeft(yScale).tickSize(0).tickPadding(6);
    const format = xScale.tickFormat(100, "%");

    // Compute titles.
    title = i => `${Y[i]}\n${format(X[i])}`;

    // const svg = select("#wordshift")
    //     .append("svg")

    const g = passed_svg  //.append('g')
        .attr("transform", `translate(${marginLeft}, ${marginTop})`)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    g.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", height - marginTop - marginBottom)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text") // actual title
            .attr("x", xScale(0))
            .attr("y", -22)
            .attr("fill", "currentColor")
            .attr("text-anchor", "center")
            .text(xLabel));

    const bar = g.append("g")
      .selectAll("rect")
      .data(I)
      .join("rect")
        .attr("fill", i => colors[X[i] > 0 ? colors.length - 1 : 0])
        .attr("x", i => Math.min(xScale(0), xScale(X[i])))
        .attr("y", i => yScale(Y[i]))
        .attr("width", i => Math.abs(xScale(X[i]) - xScale(0)))
        .attr("height", yScale.bandwidth());

    if (title) bar.append("title")
        .text(title);

    // name labels on the opposite side of the bar
    g.append("g")
        .attr("transform", `translate(${xScale(0)},0)`)
        .call(yAxis)
        .call(g => g.selectAll(".tick text")
          .filter(y => YX.get(y) > 0 ? -YX.get(y) : YX.get(y))
            .attr("text-anchor", y => YX.get(y) > 0 ? "end" : "start" )
            .attr("x",  y => YX.get(y) > 0 ? -6 : 6 ));

    return g.node();
  }