import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {List, ListItemText, Tooltip} from "@mui/material";
import http from "../../commons/http-commons";
import {faCircleNodes, faScrewdriverWrench} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import BiomoleculeCircularDisplayComponent from "../statistics/BiomoleculeCircularDisplayCompotnent";
import ExperimentPieChartComponent from "../statistics/ExperimentPieChartComponent";
import InteractionHeatMapComponent from "../statistics/InteractionHeatMapComponent";


function MainContentComponent() {
    const [statistics, setStatistics] = useState<any>({});
    const [biomoleculeStatistics, setBiomoleculeStatistics] = useState<any>([]);
    const [interactionStatistics, setInteractionStatistics] = useState<any[]>([]);

    useEffect(() => {
        http.get("/statistics/")
            .then((statisticsResponse) => {
                setStatistics(statisticsResponse.data);
                let biomoleculeData = statisticsResponse.data.biomolecules;
                let biomoleculeStatistics = [
                    {
                        type: 'Protein',
                        value: biomoleculeData.protein.all
                    },
                    {
                        type: 'GAG',
                        value: biomoleculeData.gag
                    },
                    {
                        type: 'Multimer',
                        value: biomoleculeData.multimer
                    },
                    {
                        type: 'PFRAG',
                        value: biomoleculeData.pfrag
                    },
                    {
                        type: 'SmallMolecules',
                        value: biomoleculeData.smallmol
                    }
                ];
                setBiomoleculeStatistics(biomoleculeStatistics);

                let interactionData = statisticsResponse.data.interactions;
                let interactionStatistics = [
                    { row: 'Protein', column: 'Protein', value: interactionData.protein_protein.all},
                    { row: 'Protein', column: 'GAG', value: interactionData.protein_gag || 0},
                    { row: 'Protein', column: 'PFRAG', value: interactionData.protein_pfrag || 0},
                    { row: 'Protein', column: 'Multimer', value: interactionData?.protein_multimer || 0},
                    { row: 'GAG', column: 'Protein', value: interactionData.protein_gag || 0},
                    { row: 'GAG', column: 'GAG', value: interactionData?.gag_gag || 0},
                    { row: 'GAG', column: 'PFRAG', value: interactionData.gag_pfrag || 0 },
                    { row: 'GAG', column: 'Multimer', value: interactionData.gag_multimer || 0},
                    { row: 'PFRAG', column: 'Protein', value: interactionData.protein_pfrag || 0 },
                    { row: 'PFRAG', column: 'GAG', value: interactionData.gag_pfrag || 0 },
                    { row: 'PFRAG', column: 'PFRAG', value: interactionData.pfrag_pfrag || 0},
                    { row: 'PFRAG', column: 'Multimer', value: interactionData.multimer_pfrag || 0 },
                    { row: 'Multimer', column: 'Protein', value: interactionData.protein_multimer ||  0},
                    { row: 'Multimer', column: 'GAG', value: interactionData.gag_multimer || 0},
                    { row: 'Multimer', column: 'PFRAG', value: interactionData.multimer_pfrag || 0 },
                    { row: 'Multimer', column: 'Multimer', value: interactionData.multimer_multimer || 0 },
                ];
                setInteractionStatistics(interactionStatistics);
            });
    }, []);

    const cardStyle = {
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        background: '#e7ebef',
        borderRadius: 0
    } as React.CSSProperties;

    interface TruncatedListItemTextProps {
        text: string;
        url: string;
    }
    const TruncatedListItemText: React.FC<TruncatedListItemTextProps> = ({ text, url }) => {
        const truncatedText = text.length > 50 ? `${text.substring(0, 50)}...` : text;

        return (
            <Tooltip title={text.length > 50 ? text : ''} arrow>
                <Typography variant="body2" noWrap>
                    {text.length > 50 ? (
                        <a href={url} target="_blank">
                            {truncatedText}
                        </a>
                    ) : (
                        truncatedText
                    )}
                </Typography>
            </Tooltip>
        );
    };

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '20px',
                margin: '0 auto',
                background: 'rgb(237, 239, 245)',
                width: '70%'
            }}>

                <Typography
                    variant={'body1'}
                    style={{
                        fontWeight: 'bold',
                        marginBottom: '5px'
                    }}>
                    MatrixDB Content
                </Typography>
                <div style={{ display: 'flex', width: '90%' }}>
                    {statistics.biomolecules &&
                        <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                            <Typography component="div" style={{ color: 'darkblue', textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                            Biomolecules {statistics.biomolecules.all }
                            </Typography>
                            <BiomoleculeCircularDisplayComponent biomoleculeStatistics={biomoleculeStatistics}/>
                        </Card>
                    }
                    {interactionStatistics && interactionStatistics.length > 0 && <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                        <Typography component="div" style={{ color: 'darkblue' , textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                            Interactions ({statistics.interactions.all})
                        </Typography>
                        <div style={{
                            paddingLeft: '30px'
                        }}>
                            <InteractionHeatMapComponent
                                data={interactionStatistics}
                                width={240}
                                height={240}
                            />
                        </div>
                    </Card>}
                    {statistics.experiments && <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                        <Typography component="div" style={{ color: 'darkblue', textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                            Experiments ({statistics.experiments.all})
                        </Typography>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <ExperimentPieChartComponent data={
                                [
                                    {
                                        title: '2-participants',
                                        value: statistics.experiments.binary
                                    },
                                    {
                                        title: 'n-participants',
                                        value: statistics.experiments.n_ary
                                    },
                                    {
                                        title: '1-participant',
                                        value: statistics.experiments.unary
                                    }
                                ]} width={200} height={200}/>
                        </div>
                    </Card>}
                </div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '0 auto',
                width: '70%',
                marginBottom: '20px',
                background: 'rgb(237, 239, 245)'
            }}>

                <Typography
                    variant={'body1'}
                    style={{
                        fontWeight: 'bold',
                        marginBottom: '5px',
                        marginTop: '5px'
                    }}>
                    Tools & Resources
                </Typography>
                <div style={{
                    display: 'flex',
                    width: '90%',
                    justifyContent: 'center'
                }}>
                    <Card style={{ margin: '10px', ...cardStyle }}>
                        <Typography
                            component="div"
                            style={{
                                color: 'darkblue',
                                textAlign: 'center',
                                marginLeft: '10px',
                                marginTop: '10px',
                                marginBottom: '5px',
                                fontWeight: 'bold'
                            }}>
                            Tools
                        </Typography>
                        <CardContent>
                            <List>
                                <ListItemText style={{
                                    backgroundColor: 'white',
                                    margin: '8px 0',
                                    padding: '12px',
                                }}
                                    primary={
                                        <React.Fragment>
                                            <FontAwesomeIcon
                                                icon={faCircleNodes}
                                                color={'darkblue'}
                                                style={{
                                                    paddingRight: '5px'
                                                }}
                                            />
                                            <strong><a href={"/networks"} >Network Explorer </a></strong>
                                        </React.Fragment>
                                    }/>
                                <ListItemText style={{
                                    backgroundColor: 'white',
                                    margin: '8px 0',
                                    padding: '12px',
                                }}
                                    primary={
                                        <React.Fragment>
                                            <FontAwesomeIcon
                                                icon={faScrewdriverWrench}
                                                color={'darkblue'}
                                                style={{
                                                    paddingRight: '5px'
                                                }}
                                            />
                                            <strong>GAG Builder</strong>
                                        </React.Fragment>
                                    }/>
                            </List>
                        </CardContent>
                    </Card>
                    {/*<Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                        <Typography component="div" style={{ color: 'darkblue' , textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                            How to Cite
                        </Typography>
                        <CardContent>
                            <List>
                                <ListItemText style={{marginBottom: '5px'}}>
                                    <TruncatedListItemText
                                        text="MatrixDB: integration of new data with a focus on glycosaminoglycan interactions."
                                        url="https://pubmed.ncbi.nlm.nih.gov/30371822/"
                                    />
                                </ListItemText>
                                <ListItemText>
                                    <TruncatedListItemText
                                        text="MatrixDB, the extracellular matrix interaction database: updated content, a new navigator and expanded functionalities."
                                        url="http://www.ncbi.nlm.nih.gov/pubmed/25378329"
                                    />
                                </ListItemText>
                                <ListItemText>
                                    <TruncatedListItemText
                                        text="MatrixDB, the extracellular matrix interaction database."
                                        url="http://www.ncbi.nlm.nih.gov/pubmed/20852260"
                                    />
                                </ListItemText>
                                <ListItemText>
                                    <TruncatedListItemText
                                        text="MatrixDB, a database focused on extracellular protein-protein and protein-carbohydrate interactions."
                                        url="http://www.ncbi.nlm.nih.gov/pubmed/19147664"
                                    />
                                </ListItemText>

                            </List>
                        </CardContent>
                    </Card>*/}
                    <Card style={{ margin: '10px', ...cardStyle }}>
                        <Typography
                            component="div"
                            style={{
                                color: 'darkblue',
                                textAlign: 'center',
                                marginLeft: '10px',
                                marginTop: '10px',
                                marginBottom: '5px',
                                fontWeight: 'bold'
                            }}>
                            Interaction Networks
                        </Typography>
                        <CardContent>
                            <List>
                                <ListItemText
                                    primary={
                                        <React.Fragment>
                                            <strong>Network of ...</strong>
                                        </React.Fragment>
                                    }/>
                                <ListItemText
                                    primary={
                                        <React.Fragment>
                                            <strong>Network of ...</strong>
                                        </React.Fragment>
                                    }/>
                            </List>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default MainContentComponent;
