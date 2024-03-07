import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatmapData {
    row: string;
    column: string;
    value: number;
    original?: number;
}

interface HeatmapProps {
    data: HeatmapData[];
    width: number;
    height: number;
}

const InteractionHeatMapComponent: React.FC<HeatmapProps> = ({ data, width, height }) => {
    const svgRef = useRef<HTMLDivElement>(null);
    const heatMapData = data;

    useEffect(() => {
        if(!heatMapData || heatMapData.length === 0) return;
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const margin = { top: 50, right: 50, bottom: 50, left: 50 };

        // convert data values to log scale
        let data = heatMapData.map((dataPoint: any) => {
            return{
                row: dataPoint.row,
                column: dataPoint.column,
                original: dataPoint.value,
                value: Math.log10(dataPoint.value)
            }
        });
        const rows = Array.from(new Set(data.map((d: any) => d.row)));
        const columns = Array.from(new Set(data.map((d: any) => d.column)));


        const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(data, (d) => d.value) || 1]);

        var Tooltip = d3.select(svgRef.current)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");
        var mouseover = function(d: any) {
            Tooltip
                .style("opacity", 1)
        }
        var mousemove = function(event: MouseEvent, d: any) {
            Tooltip
                .html(`Value: ${d.original}`)
                .style("left", (event.pageX + 20) + "px")
                .style("top", (event.pageY) + "px");
        }
        var mouseleave = function(d: any) {
            Tooltip
                .style("opacity", 0)
        }

        svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
                .attr('x', (d) => columns.indexOf(d.column) * 40)
                .attr('y', (d) => rows.indexOf(d.row) * 40)
                .attr('width', 40)
                .attr('height', 40)
                .style('fill', (d) => colorScale(d.value))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        var x = d3.scaleBand()
            .range([0, 160])
            .domain(columns)
            .padding(0.05);

        svg.append('g')
            .style('font-size', 11)
            .attr('transform', `translate(${margin.left}, 20)`)
            .call(d3.axisBottom(x).tickSize(0).tickSizeOuter(0))
            .select('.domain').remove();


        var y = d3.scaleBand()
            .range([0, 160])
            .domain(rows)
            .padding(0.05);

        svg.append('g')
            .style('font-size', 11)
            .attr('transform', `translate(${margin.left - 5}, ${margin.top})`)
            .call(d3.axisLeft(y).tickSize(0))
            .select('.domain').remove();

        return () => {
            svg.remove();
        };

    }, [heatMapData]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '10px'
        }}>
            <div ref={svgRef}></div>
        </div>
    )
};


export default InteractionHeatMapComponent;
