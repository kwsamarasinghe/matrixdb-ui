import React, {useEffect, useRef} from "react";
import * as d3 from 'd3';

interface DataPoint {
    name: string;
    value: number;
}

interface ProteinProteinInteractionComponentProps {
    data: DataPoint[];
}

const ProteinProteinInteractionComponent: React.FC<ProteinProteinInteractionComponentProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const margin = { top: 20, right: 30, bottom: 100, left: 100 };
        const width = 400 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const y = d3.scaleBand<string>()
            .domain(data.map(d => d.name))
            .range([0, height])
            .padding(0.1);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) || 0])
            .nice()
            .range([0, width]);

        svg.append("g")
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("y", d => y(d.name)!)
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("width", d => x(d.value) - 30)
            .attr("fill", "steelblue");

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));


        // Add labels for the bars
        svg.selectAll("text.bar")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar")
            .attr("text-anchor", "start")
            .attr("x", d => x(d.value) - 25)
            .attr("y", d => y(d.name)! + y.bandwidth() / 2)
            .text(d => Math.round((d.value / data.map((d: any) => d.value).reduce((a,b) => a + b, 0))*100) + '%')
            .style("font-size", "10px")
            .style("font-family", "Arial");

        // Add labels for bars
        svg.selectAll("text.bar-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("text-anchor", "start")
            .attr("x", d => x(0) - 70)
            .attr("y", d => y(d.name)! + y.bandwidth() / 2)
            .text(d => d.name)
            .style("font-size", "10px")
            .style("font-family", "Arial");
        svg.selectAll("path,line").remove();
        svg.selectAll("g.tick").remove();

    }, [data]);

    return (
        <svg ref={svgRef}></svg>
    );
}

export default ProteinProteinInteractionComponent;