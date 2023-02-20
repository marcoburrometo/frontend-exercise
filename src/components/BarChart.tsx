import { useRef, useEffect } from "react";
import * as d3 from "d3";

type DataPoint = {
  x: string;
  y: number;
};

type Data = {
  label: string;
  values: DataPoint[];
};

type Props = {
  data: Data[];
  /** array of colors of each bar group */
  colors?: string[];
};

const BarChart = ({ data, colors }: Props) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

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
  }, [data]);

  return <svg ref={chartRef} width="960" height="500"></svg>;
};

export default BarChart;
