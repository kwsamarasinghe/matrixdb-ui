import React, {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {List, ListItemText, Tooltip} from "@mui/material";
import http from "../../commons/http-commons";


function MainContentComponent() {
    const [statistics, setStatistics] = useState<any>({});

    useEffect(() => {
        http.get("/statistics/")
            .then((statisticsResponse) => {
                setStatistics(statisticsResponse.data);
            });
    }, []);

    const cardStyle = {
        height: '250px', // Ensures each card takes full height
        display: 'flex',
        flexDirection: 'column',
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
                margin: '0 auto', // Center horizontally
                background: 'rgba(230, 230, 230, 1)',
                width: '70%',
                marginBottom: '10px'
            }}>

                <Typography  variant={'h6'} style={{fontWeight: 'bold', marginBottom: '5px' }}>
                    Statistics
                </Typography>
                <div style={{ display: 'flex', width: '90%' }}>
                    {statistics.biomolecules &&
                        <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                            <Typography component="div" style={{ color: 'darkblue', textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                            Biomolecules {statistics.biomolecules.all }
                        </Typography>
                            <CardContent>
                            <List>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>Proteins:</strong> {statistics.biomolecules.protein.all}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>PFRAG:</strong> {statistics.biomolecules.pfrag}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>GAG:</strong> {statistics.biomolecules.gag}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>MULT:</strong> {statistics.biomolecules.multimer}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>Small Molecules:</strong> {statistics.biomolecules.smallmol}
                                        </Typography>
                                    }
                                />

                            </List>
                        </CardContent>
                        </Card>
                    }
                    {statistics.interactions && <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                        <Typography component="div" style={{ color: 'darkblue' , textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                            Interactions ({statistics.interactions.all})
                        </Typography>
                        <CardContent>
                            <List>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>Protein - Protein:</strong> {statistics.interactions.protein_protein.all}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>Protein - PFRAG:</strong> {statistics.interactions.protein_pfrag}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>Protein - GAG:</strong> {statistics.interactions.protein_gag}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>Protein - MULT:</strong> {statistics.interactions.protein_multimer}
                                        </Typography>
                                    }
                                />

                            </List>
                        </CardContent>
                    </Card>}
                    <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                        <Typography component="div" style={{ color: 'darkblue', textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                            Experiments (70000)
                        </Typography>
                        <CardContent>
                            <List>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>Directly supported:</strong> {100}
                                        </Typography>
                                    }
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="body2">
                                            <strong>Spoke expanded:</strong> {100}
                                        </Typography>
                                    }
                                />
                            </List>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '20px',
                margin: '0 auto',
                width: '70%',
                marginBottom: '20px',
                background: 'rgba(230, 230, 230, 1)'
            }}>

                <Typography  variant={'h6'} style={{fontWeight: 'bold', marginBottom: '5px' }}>
                    Tools & Resources
                </Typography>
                <div style={{ display: 'flex', width: '90%' }}>
                    <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                        <Typography component="div" style={{ color: 'darkblue', textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                            Tools
                        </Typography>
                        <CardContent>
                            <List>
                                <ListItemText
                                    primary={
                                        <React.Fragment>
                                            <strong><a href={"/networks"} >Network Explorer </a></strong>
                                        </React.Fragment>
                                    }/>
                                <ListItemText
                                    primary={
                                        <React.Fragment>
                                            <strong>GAG Builder</strong>
                                        </React.Fragment>
                                    }/>


                            </List>
                        </CardContent>
                    </Card>
                    <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                        <Typography component="div" style={{ color: 'darkblue' , textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
                            Publications
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
                    </Card>
                    <Card style={{ flex: '1', margin: '10px', ...cardStyle }}>
                        <Typography component="div" style={{ color: 'darkblue', textAlign: 'center', marginLeft: '10px', marginTop: '15px', marginBottom: '10px', fontWeight: 'bold' }}>
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
