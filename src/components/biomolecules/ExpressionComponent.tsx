import React, {useEffect, useRef} from 'react';
import {
    Box, Button,
    InputLabel,
    Paper,
    Tab,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tabs
} from "@mui/material";
import {useState} from "react";
import Anatomogram from "@ebi-gene-expression-group/anatomogram";

import * as d3 from 'd3';
import http from "../../commons/http-commons";

interface BarChartData {
    group: string,
    subgroup: {
        [key: string]:  number
    },
    subgroupDetails: string[]
}

interface BarChartProps {
    data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Define the dimensions of the SVG container
        const width = 400;
        const height = 320;
        const margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: 60
        };

        // Create the SVG container
        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Find the maximum value in the data for scaling the Y-axis
        const max = Math.max(...data.map((d) => {
            let key = Object.keys(d.subgroup)[0];
            return d.subgroup[key];
        }));
        let subgroups = data.map((d: any) => Object.keys(d.subgroup)[0]);

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        let groups = data.map((d: any) => d.group);

        // Add X axis
        let x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding(0.2)
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0));

        // Add Y axis
        let y = d3.scaleLinear()
            .domain([0, max])
            .range([ height, 0 ]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // Another scale for subgroup position?
        let xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding(0.05)

        // color palette = one color per subgroup
        let color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c','#377eb8','#4daf4a'])

        // Show the bars
        svg.selectAll()
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function(d) {
                return "translate(" + x(d.group) + ",0)";
            })
            .selectAll("rect")
            .data(function(d) {
                return subgroups.map(function(key) {
                    return {
                        key: key,
                        value: d.subgroup[key],
                    };
                });
            })
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return xSubgroup(d.key) as number; // Use xSubgroup to position the bars within each group
            })
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function(d) {
                return height - y(d.value);
            })
            .attr("fill", function(d) {
                return color(d.key) as string;
            });

    }, [data]);

    return (
        <svg ref={svgRef}></svg>
    );
};

function ExpressionComponent(props: any) {

    const {biomoleculeId} = props;
    const [protein, setProtein] = useState<string>("");
    const [gene, setGene] = useState<string>("");
    const [geneExpressionData, setGeneExpressionData] = useState<any>([]);
    const [proteomicsExpressionData, setProteomicsExpressionData] = useState<BarChartData[]>([]);
    const [expressionTypes, setExpressionTypes] = useState<string[]>([]);
    const [selectedProtemicsSampleIndex, setSelectedProteomicsSampleIndex] = useState<number | null>(null);

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        height: '550px',
        width: '100%',
        borderRadius: 0
    };

    useEffect(() => {
        if(biomoleculeId) {
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

                    // Prepare bar chart data
                    let barchartData : any[] = [];
                    Object.keys(proteomicsExpression).forEach((tissueId: string) => {
                        proteomicsExpression[tissueId].expressionValues.forEach((expression: any) => {
                            let data: BarChartData = {
                                group: tissueId,
                                subgroup: {
                                    [expression.name]: expression.score,
                                },
                                subgroupDetails: expression.sample,
                            };
                            barchartData.push(data);
                        });
                    });
                    setProteomicsExpressionData(barchartData);

                    setProtein(protein);
                    setGene(gene);

                    let expressionTypes : string[] = [];
                    if(geneExpressionData && geneExpressionData.length > 0) {
                        expressionTypes.push('geneExpression');
                    }

                    if(proteomicsExpression && Object.keys(proteomicsExpression).length > 0 ) {
                        expressionTypes.push('proteomicsExpression');
                    }
                    setExpressionTypes(expressionTypes);
                });
        }

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

    const onSampleSelect = (index: number) => {
        setSelectedProteomicsSampleIndex(index);
    };

    function GeneExpressionComponent(){
        return(
            <div style={{ display: 'flex' }}>
                <div style={{ width: '200px', paddingTop: '20px'}}>
                    <Anatomogram
                        species={'homo_sapiens'}
                        atlasUrl={'/'}
                        showIds={geneExpressionData.map((expression: any) => expression.tissueUberonName)} />
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
                                                    height: '40px',
                                                    backgroundColor: `rgb(0, 0, ${Math.floor(255 - (value * 2.55))})`,
                                                }}
                                            ></div>
                                            <span
                                                style={{
                                                    fontSize: '8px',
                                                    position: 'absolute',
                                                    top: '-20px',
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
        )
    }

    function ProteomicsExpressionComponent() {
        return(
            <>
                <div style={{
                    display: 'flex',
                }}>
                    <div style={{
                        flex: 0.5,
                        marginRight: '20px',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <h4>Samples</h4>
                        </div>
                        <div  style={{
                            overflowY: 'auto',
                            maxHeight: '320px'
                        }}>
                            <TableContainer component={Paper}>
                                <TableBody>
                                    {
                                        proteomicsExpressionData.map((proteomicsData: any) => {
                                            return(
                                                <>
                                                    <TableRow>
                                                        <TableCell style={{
                                                            backgroundColor: proteomicsData.index === selectedProtemicsSampleIndex ? 'lightgray' : 'white'
                                                        }}>
                                                            <Button
                                                                style={{
                                                                    textTransform: 'none',
                                                                }}
                                                                onClick={() => onSampleSelect(proteomicsData.index)}
                                                            >
                                                                {Object.keys(proteomicsData.subgroup)[0]}
                                                            </Button>
                                                            <div style={{
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                            }}>
                                                                {
                                                                    Object.keys(proteomicsData.subgroupDetails).map((sampleKey: string) => {
                                                                        const width = `${proteomicsData.subgroupDetails[sampleKey] * 10}px`;
                                                                        if(proteomicsData.subgroupDetails[sampleKey] !== "") {
                                                                            return (
                                                                                <InputLabel style={{
                                                                                    border: '1px solid orange',
                                                                                    padding: '5px',
                                                                                    textAlign: 'center',
                                                                                    color: 'orange',
                                                                                    fontWeight: 'bold',
                                                                                    borderRadius: '4px',
                                                                                    fontSize: '12px',
                                                                                    width: width,
                                                                                    margin: '5px',
                                                                                }}>
                                                                                    {proteomicsData.subgroupDetails[sampleKey]}
                                                                                </InputLabel>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            )
                                        })
                                    }
                                </TableBody>
                            </TableContainer>
                        </div>
                    </div>
                    {
                        proteomicsExpressionData && <div style={{
                            flex: 1,
                            paddingLeft: '30px'
                        }}>
                            <BarChart data={proteomicsExpressionData} />
                        </div>
                    }
                </div>
            </>
        )
    }

    return (
        <>
            <>
                    {
                        (geneExpressionData && Array.from(geneExpressionData.keys()).length > 0 ||
                            proteomicsExpressionData && proteomicsExpressionData.length > 0) &&
                        <div>
                            <Paper style={paperStyle}>
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                                        <span style={{paddingLeft: '10px'}}>
                                            <h3>Expression & Proteomics</h3>
                                        </span>
                                    </div>

                                    <Tabs value={tabValue} onChange={handleTabChange} centered>
                                        {
                                            geneExpressionData.length > 0 &&
                                            <Tab label="Gene Expression"/>
                                        }
                                        {
                                            proteomicsExpressionData && proteomicsExpressionData.length > 0 &&
                                            <Tab label="Proteomics Expression" />
                                        }
                                    </Tabs>
                                    {
                                        expressionTypes.map((type: string, index: number) => {
                                            return(
                                                <>
                                                    {
                                                        type === 'geneExpression' && geneExpressionData.length > 0 &&
                                                        <TabPanel value={tabValue} index={index}>
                                                            <GeneExpressionComponent/>
                                                        </TabPanel>
                                                    }
                                                    {
                                                        type === 'proteomicsExpression' && proteomicsExpressionData &&
                                                        proteomicsExpressionData.length > 0 &&
                                                        <TabPanel value={tabValue} index={index}>
                                                            <ProteomicsExpressionComponent/>
                                                        </TabPanel>
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </>
                            </Paper>
                        </div>
                    }
            </>
        </>
    );
}

export default ExpressionComponent;