import { useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";

type DataPoint = {
  x: string;
  y: number;
  counter?: number;
};

type Data = {
  label: string;
  values: DataPoint[];
};

type Props = {
  data: Data[];
  /** array of colors of each bar group */
  colors?: string[];
  width?: number;
  height?: number;
};

const BarChart = ({ data, colors, width, height }: Props) => {
  const chartRef = useRef<SVGSVGElement>(null);

  const initChart = useCallback(() => {
    const svg = d3.select(chartRef.current);
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width")! - margin.left - margin.right;
    const height = +svg.attr("height")! - margin.top - margin.bottom;
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
    const x1 = d3.scaleBand().padding(0.05);
    const y = d3.scaleLinear().rangeRound([height, 0]);
    const z = d3.scaleOrdinal().range(
      colors ||
        // As many colors as there are data points
        d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
    );

    x0.domain(data.map((d) => d.label));
    x1.domain(data[0].values.map((d) => d.x)).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, (d) => d3.max(d.values, (d) => d.y))!]).nice();

    g.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.label)},0)`)
      .selectAll("rect")
      // Also pass the index of the group to the data
      .data((d, i) => d.values.map((e) => ({ ...e, idx: i })))
      .join("rect")
      .attr("x", (d) => x1(d.x)!)
      .attr("y", height)
      .attr("width", x1.bandwidth())
      //   .attr("height", (d) => height - y(d.y))
      .attr("height", 0)
      .attr("fill", (d) => z(d.x)! as string)
      //  Animate the height from bottom up with a delay
      .transition()
      // add a delay to stagger the animation for each bar from left to right for all groups
      .delay((d, i) => d.idx * data[d.idx].values.length * 20 + i * 20)
      .duration(300) // set the duration of the animation
      .attr("y", (d) => y(d.y)) // animate the y attribute
      .attr("height", (d) => height - y(d.y)); // animate the height attribute

    // Append counter if there is one
    g.append("g")
      .selectAll("g")
      .attr("class", "counters")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.label)},0)`)
      .selectAll("foreignObject")
      .data((d, i) => d.values.map((e) => ({ ...e, idx: i })))
      .join("foreignObject")
      // If there is no counter skip
      .filter((d) => !!d.counter)
      .attr("x", (d) => x1(d.x)!)
      .attr("y", height)
      .attr("width", 50)
      .attr("height", 50)
      .attr("text-anchor", "middle")
      .attr("font-size", "0.8rem")
      .html(
        (d) =>
          // Tailwind icon for comments
          `<div class="flex items-center justify-center w-6 h-6 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
            <span class="ml-1">${d.counter}</span>
        </div>`
      )

      .transition()
      // add a delay to stagger the animation for each bar from left to right for all groups
      .delay((d, i) => d.idx * data[d.idx].values.length * 20 + i * 20)
      .duration(300) // set the duration of the animation
      .attr("y", (d) => y(d.y) - 25); // animate the y attribute

    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()!)! + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Value");
  }, [data, colors, width, height]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }
    // TODO: Make barchart responsive, instead of cleaning it every time
    chartRef.current.innerHTML = "";
    initChart();
  }, [data, height, width]);

  console.log(width);

  return <svg ref={chartRef} width={width} height={height}></svg>;
};

BarChart.defaultProps = {
  width: 960,
  height: 500,
};

export default BarChart;
