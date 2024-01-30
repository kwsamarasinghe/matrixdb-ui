import {useParams} from "react-router";
import {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {
    AppBar,
    Box, Chip, Divider,
    Grid,
    IconButton,
    InputBase,
    List,
    ListItem, ListItemButton,
    Paper,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPerson} from "@fortawesome/free-solid-svg-icons";

interface AssociationToDisplay {
    id: string,
    pmid?: [string],
    participants: [string],
    source: string,
    score: string,
    spokeexpandedfrom?: [string],
    directlysupportedby?: [string],
    inferredfrom?: [string]
}


function AssociationComponent() {
    const { associationId } = useParams();
    const [association, setAssociation] = useState<AssociationToDisplay>();

    useEffect(() => {
        http.get("/associations/" + associationId)
            .then((associationResponse) => {
                if(associationResponse.data && associationResponse.data.association) {
                    let associationData = associationResponse.data.association;

                    let association : AssociationToDisplay = {
                        id: associationData.id,
                        pmid: associationData.pmids,
                        participants: associationData.participants,
                        source: associationData.source,
                        score: associationData.score?.replace('intact-miscore:','')
                    }
                    if(associationData.experiments && associationData.experiments.direct && associationData.experiments.direct.binary &&
                        associationData.experiments.direct.binary.length > 0) {
                        association.directlysupportedby = associationData.experiments.direct.binary;
                    }

                    if(associationData.experiments && associationData.experiments.direct && associationData.experiments.direct.spoke_expanded_from &&
                        associationData.experiments.direct.spoke_expanded_from.length > 0) {
                        association.spokeexpandedfrom = associationData.experiments.direct.spoke_expanded_from;
                    }

                    if(associationData.inferredfrom) {
                        let inferredfrom = [];
                        if(Array.isArray(associationData.inferredfrom)) {
                            inferredfrom = associationData.inferredfrom;
                        } else {
                            inferredfrom.push(associationData.inferredfrom);
                        }
                        association.inferredfrom = inferredfrom;
                    }

                    setAssociation(association);
                }
            });
    },[]);

    const theme = useTheme();

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        width: '100%',
        borderRadius: 0
    };

    const mapScoreToColor = (score: number) => {
        const green = 128;
        const alpha = score;
        const color = `rgba(0, ${green}, 0, ${alpha})`;
        return color;
    };

    return (
        <>
        <div>
            <Header pageDetails={{
                type: "association",
                id: associationId
            }}/>
            <Box
                display="flex"
                justifyContent="center"
                marginTop="4px"
                style={{
                    height: "80vh"
                }}
            >
                <Box style={{ width: "60%" }}>
                    {association &&
                        <Paper style={paperStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                                <div style={{ paddingLeft: '20px'}}>
                                    <h2>{associationId}</h2>
                                </div>
                            </div>
                            <div style={{textAlign: 'left' , width: '200px', paddingLeft: '20px'}}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '4px' }}>
                                    {/* First Column: h4 */}
                                    <div style={{ flex: 1 }}>
                                        <h4>Biomolecules</h4>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        {association.participants.map((b, index) => {
                                            let link = "/biomolecule/" + b;
                                            return (
                                                <div key={index}>
                                                    <a href={link}>{b}</a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '5px' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4>Experiment(s)</h4>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        {
                                            association.directlysupportedby &&
                                            <div style={{paddingBottom: '5px'}}>
                                                <Typography align="left">Directly Supported By
                                                    {
                                                        association.directlysupportedby.map(b => {
                                                            let link = "/experiment/" + b;
                                                            return (
                                                                <Grid item xs={6}>
                                                                    <a href={link}>{b}</a>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Typography>
                                            </div>
                                        }
                                        {
                                            association.spokeexpandedfrom &&
                                            <div>
                                                <Typography align="left">Spoke Expanded From
                                                    {
                                                        association.spokeexpandedfrom.map(b => {
                                                            let link = "/experiment/" + b;
                                                            return (
                                                                <Grid item xs={6}>
                                                                    <a href={link}>{b}</a>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Typography>
                                            </div>
                                        }
                                    </div>
                                    {association.score && <div style={{ flex: 1 }}>
                                        <Typography align="left">
                                            <h4>Score</h4>
                                            <Chip label={`MIScore: ${association.score}`} style={{ backgroundColor: mapScoreToColor(parseFloat(association.score)) }} />
                                        </Typography>
                                    </div>}
                                </div>
                                <Typography align="left" style={{paddingTop: '10px'}}>
                                    <h4>Source</h4>
                                    {association.source}
                                </Typography>
                                <Typography align="left">
                                    <h4>Publications</h4>
                                    {association.pmid && association.pmid.map((pmid: string, index: number) => (
                                        <div key={index}>
                                            <a href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`} target="_blank" rel="noopener noreferrer">
                                                {pmid}
                                            </a>
                                        </div>
                                    ))}
                                </Typography>
                            </div>
                        </Paper>
                    }
                </Box>
            </Box>
            {
                !association &&
                <Box sx={{ display: 'flex', bgcolor: 'black' , justifyContent: 'center'}}>
                    <Box component="main" justifyContent="center" style={{paddingTop: "70px", width: "50%"}}>
                        <Paper elevation={2}>
                          <Typography variant="subtitle1" component="span">
                            <h5>No data currently availble on association {associationId}</h5>
                            <h6>Will be integrated soon</h6>
                          </Typography>
                        </Paper>
                    </Box>
                </Box>
            }
            <Footer/>
        </div>
        </>
    );
}

export default AssociationComponent;