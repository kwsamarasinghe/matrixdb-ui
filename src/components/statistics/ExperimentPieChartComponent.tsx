import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3-shape';

interface PieChartProps {
    data: { title: string; value: number }[];
    width: number;
    height: number;
}

const ExperimentPieChartComponent: React.FC<PieChartProps> = ({ data, width, height }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const radius = Math.min(width, height) / 2;

        // Define the pie chart layout
        const pie = d3.pie<{ title: string; value: number }>().value((d) => d.value);

        // Define the arc generator with explicit types
        const arc = d3.arc<PieArcDatum<{ title: string; value: number }>>().innerRadius(0).outerRadius(radius);

        // Create a group for the pie chart
        const pieGroup = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

        // Create the pie chart segments
        const arcs = pie(data);

        var mouseover = function () {
            Tooltip.style("opacity", 1);
        };

        var mousemove = function (event: MouseEvent, d: any) {
            Tooltip
                .html('<u>' + d.data.title + '</u>' + "<br>" + `Value: ${d.data.value}`)
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY) + "px");
        };

        var mouseleave = function () {
            Tooltip.style("opacity", 0);
        };

        // Create and append the path elements
        pieGroup
            .selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        var Tooltip = d3.select('body') // Append to body, not svgRef.current
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

    }, [data, width, height]);

    return (
        <div style={{
            paddingTop: '20px'
        }}>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default ExperimentPieChartComponent;
