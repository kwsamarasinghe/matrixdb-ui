import React, {useRef} from 'react';
import {Box, Container, Paper, Tab, Tabs} from "@mui/material";
import {useEffect, useState} from "react";
import Anatomogram from "@ebi-gene-expression-group/anatomogram";

import * as d3 from 'd3';
import http from "../../commons/http-commons";

interface BarChartData {
    label: string;
    value: number;
}

interface BarChartProps {
    data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Define the dimensions of the SVG container
        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        // Create the SVG container
        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Find the maximum value in the data for scaling the Y-axis
        const max = Math.max(...data.map((d) => d.value));

        // Define scales for X and Y axes
        const xScale = d3.scaleBand()
            .domain(data.map((d) => d.label))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, max])
            .nice()
            .range([height, 0]);

        // Create X-axis
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        // Create Y-axis
        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

        // Create bars
        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d: any) => xScale(d.label) || 0)
            .attr('y', (d: any) => yScale(d.value))
            .attr('width', xScale.bandwidth() > 100 ? 40 : xScale.bandwidth())
            .attr('height', (d: any) => height - yScale(d.value))
            .attr('fill', 'steelblue');
    }, [data]);

    return (
        <svg ref={svgRef}></svg>
    );
};


function ExpressionComponent(props: any) {

    const {biomoleculeId} = props;
    const [protein, setProtein] = useState<string>("");
    const [gene, setGene] = useState<string>("");
    const [geneExpressionData, setGeneExpressionData] = useState<any>(null);
    const [proteomicsExpressionData, setProteomicsExpressionData] = useState<any>(null);

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        height: '500px',
        width: '100%',
        borderRadius: 0
    };

    useEffect(() => {
        http.get("/biomolecules/proteins/expressions/" + biomoleculeId)
            .then((expressionDataResponse) => {
                let geneExpressionData = new Array<any>;
                const {geneExpression, proteomicsExpression, protein, gene} = expressionDataResponse.data;
                geneExpression.forEach((e:any)=> {
                    geneExpressionData.push({
                        tissueUberonName: e.tissueUberonName,
                        tpm: e.tpm
                    });
                });
                geneExpressionData = geneExpressionData.sort((a : any,b : any) => {
                    if(a.tissueUberonName > b.tissueUberonName) return 1
                    else return -1;
                });
                setGeneExpressionData(geneExpressionData);

                let proteomicsExpressionData = new Array<any>;
                proteomicsExpression.forEach((e:any)=> {
                    let tissueId = e.tissueUberonName;
                    proteomicsExpressionData.push({
                        "label": tissueId,
                        "value": Math.log(e.score) * 20
                    });
                });

                proteomicsExpressionData.sort((a,b) => a.label - b.label);
                setProteomicsExpressionData(proteomicsExpressionData);

                setProtein(protein);
                setGene(gene);
            });
    }, []);

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && <Box p={3}>{children}</Box>}
            </div>
        );
    };

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <>
            <>

                    {
                        geneExpressionData && Array.from(geneExpressionData.keys()).length > 0 &&
                        <div>
                            <Paper style={paperStyle}>
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                                        <span style={{paddingLeft: '10px'}}>
                                            <h3>Expression & Proteomics</h3>
                                        </span>
                                    </div>

                                    <Tabs value={tabValue} onChange={handleTabChange} centered>
                                        <Tab label="Gene Expression" />
                                        <Tab label="Proteomcis Expression" />
                                    </Tabs>
                                    <TabPanel value={tabValue} index={0}>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ width: '200px', paddingTop: '20px'}}>
                                                <Anatomogram species={'homo_sapiens'} atlasUrl={'/'} showIds={geneExpressionData.map((expression: any) => expression.tissueUberonName)} />
                                            </div>

                                            <div style={{ flex: 1 , paddingTop: '150px', paddingLeft: '150px'}}>
                                                <>
                                                    {
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {geneExpressionData.map((expression: any) => {
                                                                const key = expression.tissueUberonName;
                                                                const value = expression.tpm;
                                                                return (
                                                                    <div key={key} style={{ marginRight: '8px', position: 'relative' }}>
                                                                        <div
                                                                            style={{
                                                                                width: '20px',
                                                                                height: '40px', // Specify height to make them square
                                                                                backgroundColor: `rgb(0, 0, ${Math.floor(255 - (value * 2.55))})`,
                                                                            }}
                                                                        ></div>
                                                                        <span
                                                                            style={{
                                                                                fontSize: '8px',
                                                                                position: 'absolute',
                                                                                top: '-20px', // Adjust to your preferred distance above the rectangles
                                                                                left: '9px',
                                                                                transform: 'rotate(-45deg)',
                                                                                transformOrigin: 'left bottom',
                                                                                width: '100px'
                                                                            }}
                                                                        >{key}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    }
                                                </>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <BarChart data={proteomicsExpressionData}/>
                                        </div>
                                    </TabPanel>

                                </>
                            </Paper>
                        </div>
                    }
            </>
        </>
    );
}

export default ExpressionComponent;