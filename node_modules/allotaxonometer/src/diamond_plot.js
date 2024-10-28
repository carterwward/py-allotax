
import { max, shuffle, range } from "d3-array";
import { scaleLog, scaleLinear, scaleBand, scaleSequentialLog } from "d3-scale";
import { select } from "d3-selection";
import { interpolateInferno } from "d3-scale-chromatic";
import { axisBottom, axisRight } from "d3-axis";

import { rin } from "./utils_helpers.js";

const visHeight = 612
const visWidth = 612

export default function DiamondChart(dat, passed_svg) {

    const margin = ({ top: 200, left: 0, right: 140, bottom: 140 })
    const ncells = max(dat, d => d.x1)

    const max_xy   = max(dat, d => d.x1)           // max_x == max_y
    const max_rank = max(dat, (d) => d.rank_L[1]); // max_rankL == max_rankL
    const max_val  = max(dat, d => d.value)

    const xy         = scaleBand().domain(dat.map(d=>d.y1)).range([0, visWidth])
    const xyDomain   = [1, 10**Math.ceil(Math.max(Math.log10(max_rank)))];
    const xyScale    = scaleLog().domain(xyDomain).range([1, visWidth])
    const xyScaleLin = scaleLinear().domain([1,ncells]).range([1, visWidth])

    const color_scale = scaleSequentialLog().domain([max_val, 1]).interpolator(interpolateInferno)

    // const svg = select("#diamondplot").append("svg")

    const g = passed_svg  //.append('g')
      .attr('transform', `translate(${ visWidth / 2.5}, -25) rotate(135) scale(1,-1)`)
      .attr('height', visHeight + margin.top + margin.bottom)
      .attr('width', visWidth)
      .attr("viewBox", [-20, -20, visWidth + margin.top, visHeight]);

    // Rotate the canvas

    // Xaxis - see below for the functions
    g.append('g')
      .call(xAxis, xyScale)
      .call(xAxisLab, "Rank r", visWidth, 40) // there must be an easier way to breaklines!?!
      .call(xAxisLab, "for", visWidth, 60)
      .call(xAxisLab, `Girls 1885`, visWidth, 80)
      .call(xAxisLab, "more →", visWidth-200, 40, .4)
      .call(xAxisLab, "frequent", visWidth-200, 60, .4)
      .call(xAxisLab, "← less", visWidth+200, 40, .4)
      .call(xAxisLab, "frequent", visWidth+200, 60, .4)
      .call(xGrid, xyScaleLin, ncells);

    // Yaxis - see below for the functions
    g.append('g')
      .call(yAxis, xyScale)
      .call(yAxisLab, "Rank r", 0, 40)
      .call(yAxisLab, "for", 0, 60)
      .call(yAxisLab, `Girls 1890`, 0, 80)
      .call(yAxisLab, "less →", 200, 40, .4)
      .call(yAxisLab, "frequent", 200, 60, .4)
      .call(yAxisLab, "← more", -200, 40, .4)
      .call(yAxisLab, "frequent", -200, 60, .4)
      .call(yGrid, xyScaleLin, ncells);

    // Background polygons
    const grey_triangle = [
      {"x":max_xy, "y":max_xy}, {"x":0, "y":0}, {"x":max_xy, "y":0}
    ].map(d => [xy(d.x), xy(d.y)].join(',')).join(" ")

    const blue_triangle = [
      {"x":max_xy, "y":max_xy}, {"x":0, "y":0}, {"x":0, "y":max_xy}
    ].map(d => [xy(d.x), xy(d.y)].join(',')).join(" ")

    draw_polygon(g, blue_triangle, "#89CFF0")
    draw_polygon(g, grey_triangle, "grey")

    // Heatmap
    const cells = g
        .selectAll('rect').data(dat).enter()
        .append('rect')
        .attr('x', (d) => xy(d.x1))
        .attr('y', (d) => xy(d.y1))
        .attr('width', xy.bandwidth())
        .attr('height', xy.bandwidth())
        .attr('fill', (d) => color_scale(d.value))
        .attr('fill-opacity', (d) => d.value === 0 ? 0 : color_scale(d.value))
        .attr('stroke', 'black')
        .attr('stroke-width', (d) => d.value === 0 ? 0 : 0.3)

    const mytypes = chosen_types(dat, ncells)

    g.selectAll('text')
      .data(dat)
      .enter()
      .append('text')
      .filter(d => rin(mytypes, d.types.split(",")).some((x) => x === true))
      .text(d => d.types.split(",")[0])
        .attr("x", (d) => xy(d.x1))
        .attr("y", (d) => Number.isInteger(d.coord_on_diag) ? xy(d.y1) : xy(d.y1)-1) // avoid text occlusion
        .attr("dy", 20)
        .attr("font-size", 14)
        .attr("font-family", "sans-serif")
        .attr("transform", d => `scale(1,-1) rotate(-90) rotate(-45, ${xy(d.x1)}, ${xy(d.y1)}) translate(${d.which_sys === "right" ? xy(Math.sqrt(d.cos_dist))*1.5 : -xy(Math.sqrt(d.cos_dist))*1.5}, 0)`) // little humph
        .attr("text-anchor", d => d.x1 - d.y1 <= 0 ? "start" : "end")

    // Draw the middle line
    g.append('line')
     .style("stroke", "black")
     .style("stroke-width", 1)
     .attr("x1", 0)
     .attr("y1", 0)
     .attr("x2", visWidth-7)
     .attr("y2", visHeight-7)

    // Add the tooltip
    // const tooltip = select("body")
    //   .append("div")
    //   .style("position", "absolute")
    //   .style("visibility", "hidden")
    //   .style("opacity", 0.9)
    //   .style("background", "white");

    // cells.call(Tooltips, tooltip) // not working with labels

    return g.node()
}


const draw_polygon = (g, tri_coords, bg_color) => g
    .append("polygon")
     .attr("fill",bg_color)
     .attr("fill-opacity", 0.2)
     .attr("stroke", "black")
     .attr("stroke-width", 1)
     .attr("points", tri_coords)

//!TODO: Find a way to combine x and y axis
const xAxis = (g, scale) => g
    .attr("transform", `translate(0, ${visHeight})`)
    .call(axisBottom(scale))
    .call((g) => g.select(".domain").remove()) // remove baseline
    .selectAll('text')
    .attr('dy', 10)
    .attr('dx', 13)
    .attr('transform', 'scale(-1,1) rotate(45)')
    .attr('font-size', 10);

const yAxis = (g, scale) => g
    .call(axisRight(scale))
    .call((g) => g.select(".domain").remove())
    .attr("transform", `translate(${visHeight+5}, 0) scale(-1, 1)`)
    .selectAll('text')
    .attr('dx', -28)
    .attr('dy', 15)
    .attr('transform', 'rotate(45)')
    .attr('font-size', 10);

const xAxisLab = (g, text, dx, dy, alpha) => g
    .append("text")
    .attr("x", visWidth / 2)
    .attr("fill", "black")
    .attr("font-size", 14)
    .attr("opacity", alpha)
    .attr("text-anchor", 'middle')
    .text(text)
    .attr('transform', `rotate(183) scale(1,-1) translate(-${dx}, ${dy})`);

const yAxisLab = (g, text, dx, dy, alpha) => g
    .append("text")
    .attr("x", visWidth / 2)
    .attr("fill", "black")
    .attr("font-size", 14)
    .attr("opacity", alpha)
    .attr("text-anchor", 'middle')
    .text(text)
    .attr('transform', `rotate(93) translate(${dx},${dy})`);

const xGrid = (g, scale, ncells) => g
    .append('g')
    //                   + => ylines to the right , lower xlines
    //                   - => ylines to the left, higher xlines
    .attr("transform", `translate(-10, -10)`)
    .call(axisBottom(scale).ticks(ncells/2).tickFormat("")) // rm tick values
    .call((g) => g.select(".domain").remove())
    .call((g) => g
        .selectAll(".tick line")
        .attr("stroke", "#d3d3d3")
          .style("stroke-dasharray", ("3, 3"))
        .attr("y1", -visHeight+10) // y1 == - ? longer ylines on the top : shorter ylines on the top
        .attr("y2", 0) // y2 == - ? shorter ylines on the bottom :  longer ylines on the bottom
    );

// When working on the grid, easier to rotate back to original square shape
const yGrid = (g, scale, ncells) => g
    .append("g")
    //                      + => xlines to the left , lower ylines
    //                      - => xlines to the right, higher ylines
    .attr("transform", `translate(${ visHeight+20 }, -10) scale(-1, 1)`)
    .call(axisRight(scale).ticks(ncells/2).tickFormat(""))
    .call((g) => g.select(".domain").remove())
    .call((g) => g
        .selectAll(".tick line")
        .attr("stroke", "#d3d3d3")
        .style("stroke-dasharray", ("3, 3"))
        .attr("x1", 15)      // x1 == - ? longer xlines on the left :  shorter xlines on the left
        .attr("x2", visWidth) // x2 == - ?  shorter xlines on the right :  longer xlines on the right
    );

const Tooltips = (g, tooltip) => g
  .on("mouseover", (event, d) => {
    select(event.target)
      .style("stroke-width", "2px");
    tooltip.style("visibility", "visible");
    tooltip.html(d.value !== 0 ? `Top types: ${d.types.split(",").length < 50 ?
        shuffle(d.types.split(",")) :
        [shuffle(d.types.split(",").slice(0,50))].concat([" ..."])}` : null);

  })
  .on("mousemove", (event, d) => {
    tooltip
      .style("top", event.clientY - 10 + "px")
      .style("left", event.clientX + 10 + "px");
  })
  .on("mouseout", (event, d) => {
    select(event.target)
      .style("stroke-width",  (d) => d.value === 0 ? 0 : 0.3);
    tooltip.style("visibility", "hidden");
  })

function chosen_types(dat, ncells) {
  const cumbin = range(0, ncells, 1.5)
  const relevant_types = []

  for (let sys of ["right", "left"]) {
    for (let i=1; i < cumbin.length; i++) {
      const filtered_dat = dat.filter(d => d.value > 0 && d.which_sys == sys)
                              .filter(d => d.coord_on_diag >= cumbin[i-1] &&
                                           d.coord_on_diag < cumbin[i])
      if (filtered_dat.length > 0) {
        const cos_dists = filtered_dat.map(d => d.cos_dist)
        const max_dist = cos_dists.reduce((a, b) => { return Math.max(a, b) })
        const max_dist_idx = cos_dists.indexOf(max_dist)
        const name = shuffle(filtered_dat[max_dist_idx]['types'].split(","))[0]
        relevant_types.push(name)
      }
  }
  }
  return relevant_types
}

