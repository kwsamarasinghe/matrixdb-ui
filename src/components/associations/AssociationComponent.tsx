import {useParams} from "react-router";
import {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {
    AppBar,
    Box, Divider,
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
    pmid?: string,
    participants: [string],
    source: string,
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
                        pmid: associationData.pubmed,
                        participants: associationData.participants,
                        source: associationData.source
                    }
                    if(associationData.directlysupportedby) {
                        let directlysupported = [];
                        if(Array.isArray(associationData.directlysupportedby)) {
                            directlysupported = associationData.directlysupportedby;
                        } else {
                            directlysupported.push(associationData.directlysupportedby);
                        }
                        association.directlysupportedby = directlysupported;
                    }

                    if(associationData.spokeexpandedfrom) {
                        let spokeexpandedfrom = [];
                        if(Array.isArray(associationData.spokeexpandedfrom)) {
                            spokeexpandedfrom = associationData.spokeexpandedfrom;
                        } else {
                            spokeexpandedfrom.push(associationData.spokeexpandedfrom);
                        }
                        association.spokeexpandedfrom = spokeexpandedfrom;
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
                                <h4>Biomolecules</h4>
                                <Typography align="left"> {
                                    association.participants.map(b => {
                                            let link = "/biomolecule/" + b;
                                            return (
                                                <Grid item xs={6}>
                                                    <a href={link}>{b}</a>
                                                </Grid>)
                                        }
                                    )}
                                </Typography>

                                {
                                    association.directlysupportedby && <Typography align="left"><b>Supporting experiment(s):</b>
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
                                }
                                {
                                    association.spokeexpandedfrom &&
                                    <Typography align="left"><b>Spoke Expanded From:</b>
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
                                }
                                <Typography align="left" style={{paddingTop: '10px'}}>
                                    <h4>Source</h4>
                                    {association.source}
                                </Typography>
                                <Typography align="left">
                                    <h4>Publications</h4>
                                    <a href={"https://pubmed.ncbi.nlm.nih.gov/"+association.pmid} target="_blank">{association.pmid}</a>
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