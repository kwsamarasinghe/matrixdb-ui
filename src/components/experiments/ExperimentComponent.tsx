import {useParams} from "react-router";
import {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {AppBar, Box, experimentalStyled, Grid, IconButton, InputBase, Paper, Toolbar, Typography, useTheme} from "@mui/material";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";


interface ParticipantToDisplay {
    id: string,
    biomolecule: string,
    detectionMethod: string,
    biologicalRole: string,
    experimentalRole: string
}

interface ExperimentToDisplay {
    id: string,
    intactId: string,
    imexId: string,
    pmid: string,
    source: string,
    spokeexpandedto?: Array<string>,
    directlysupports?: Array<string>,
    inferredto?: Array<string>,
    detectionMethod: string,
    type: string,
    comment: string,
    participants?: Array<ParticipantToDisplay>
}


function ExperimentComponent() {
    const { experimentId } = useParams();
    const [experiment, setExperiment] = useState<ExperimentToDisplay>();

    useEffect(() => {
        http.get("/experiments/" + experimentId)
            .then((experimentResponse) => {
                if(experimentResponse.data && experimentResponse.data.experiment) {
                    let experimentData = experimentResponse.data.experiment;
                    let experiment = {
                        id: experimentData.id,
                        pmid: experimentData.pmid,
                        source: experimentData.source,
                        spokeexpandedfrom: experimentData?.spokeexpandedfrom,
                        directlysupports: experimentData?.directlysupports,
                        inferredfrom: experimentData?.inferredfrom,
                        detectionMethod: experimentData.interaction_detection_method,
                        type: experimentData.interaction_type,
                        comment: experimentData.comment,
                        intactId: experimentData.xrefs.intact,
                        imexId: experimentData?.xrefs.imex,
                        participants: experimentData.participants && Object.keys(experimentData.participants).map(pk  => {
                            return {
                                id: experimentData.participants[pk].id || experimentData.participants[pk].biomolecule ,
                                detectionMethod: experimentData.participants[pk].identification_method,
                                biologicalRole: experimentData.participants[pk].biological_role,
                                experimentalRole: experimentData.participants[pk].experimental_role
                            }
                        })
                    }
                    experiment.participants.sort((a: any, b: any) => {
                        const aBait = a.experimentalRole.includes('bait');
                        const bBait = b.experimentalRole.includes('bait');

                        if (aBait && !bBait) return -1;
                        if (!aBait && bBait) return 1;
                        return 0;
                    });
                    setExperiment(experiment);
                }
            });
    }, []);

    const generateExperimentName = (experiment : ExperimentToDisplay) => {
        let participants = experiment.participants;
        if(participants?.length === 2 ) {
            let bait = participants.find((participant) => participant.experimentalRole === 'MI:0496');
            let prey = participants.find((participant) => participant.experimentalRole !== 'MI:0496');
            return (
                    <span>
                        <h6>{bait?.id} and { prey?.id }</h6>
                    </span>  
            )
        } else {
            let bait = participants?.find((participant) => participant.experimentalRole === 'MI:0496');
            if(bait && participants) {
                return (
                    <span>
                        <h6>{bait.id} and { participants.length - 1} others</h6>
                    </span>  
                )
            }
            
        }
    }

    const theme = useTheme();

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        width: '100%',
        borderRadius: 0,
        paddingBottom: '10px',
        paddingTop: '10px'
    };

    const getParticipantTypeId = (id: string) => {
        if(id) {
            if(id.includes('PFRAG')) return 'lightblue';
            if(id.includes('GAG')) return 'green';
            if(id.includes('MULT')) return 'orange';
            return 'blue';
        } else return 'white';
    }

    return (<>
            <Header pageDetails={{
                type: "experiment",
                id: experimentId
            }}/>
            {
                experiment &&
                <Box
                    display="flex"
                    justifyContent="center"
                    marginTop="4px"
                    style={{
                        height: "80vh",
                        overflowY: 'auto'
                    }}
                >
                <Box style={{ width: "60%" }}>
                    <Paper style={paperStyle}>

                        <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                            <div style={{ paddingLeft: '20px'}}>
                                <h3>Experiment: {experiment.id}</h3>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '5px' }}>
                            <div style={{ flex: 1 }}>
                                {
                                    (experiment?.intactId || experiment?.imexId) &&
                                    <div style={{paddingBottom: '5px'}}>
                                        <Typography align="left">
                                            <h4>External Reference</h4>
                                            {
                                                experiment.intactId &&
                                                <Typography align="left">
                                                    Intact <a href={'https://www.ebi.ac.uk/intact/details/interaction/'+experiment.intactId}>{experiment.intactId}</a>
                                                </Typography>
                                            }
                                            {
                                                experiment.imexId &&
                                                <Typography align="left">
                                                    IMEX <a href={''}>{experiment.imexId}</a>
                                                </Typography>
                                            }
                                        </Typography>
                                    </div>
                                }
                            </div>
                            {
                                experiment.detectionMethod && <div style={{ flex: 1 }}>
                                    <div style={{paddingBottom: '5px'}}>
                                        <Typography align="left">
                                            <h4>Detection Method</h4>
                                            <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.detectionMethod }>
                                                {experiment.detectionMethod}
                                            </a>
                                        </Typography>
                                    </div>
                                </div>
                            }
                            {
                                experiment.type && <div style={{ flex: 1 }}>
                                    <div style={{paddingBottom: '5px'}}>
                                        <Typography align="left">
                                            <h4>Interaction Type:</h4>
                                            <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.type }>
                                                {experiment.type}
                                            </a>
                                        </Typography>
                                    </div>
                                </div>
                            }
                            {
                                experiment.pmid && <div style={{ flex: 1 }}>
                                    <div style={{paddingBottom: '5px'}}>
                                        <Typography align="left">
                                            <h4>PMID</h4>
                                            <a href={"https://pubmed.ncbi.nlm.nih.gov/"+experiment.pmid} target="_blank">{experiment.pmid}</a>
                                        </Typography>
                                    </div>
                                </div>
                            }
                            {
                                experiment.pmid && <div style={{ flex: 1 }}>
                                    <div style={{paddingBottom: '5px'}}>
                                        <Typography align="left">
                                            <h4>Source</h4>
                                            <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.source }>
                                                {experiment.source}
                                            </a>
                                        </Typography>
                                    </div>
                                </div>
                            }
                            {
                                experiment.comment && <div style={{ flex: 1 }}>
                                    <div style={{paddingBottom: '5px'}}>
                                        <Typography align="left">
                                            <h4>General Comment</h4> {experiment.comment}</Typography>
                                    </div>
                                </div>
                            }
                            {
                                experiment.directlysupports && <div style={{ flex: 1 }}>
                                    <div style={{paddingBottom: '5px'}}>
                                        <Typography align="left"><b>Directly Supports</b> {experiment.directlysupports}</Typography>
                                    </div>
                                </div>
                            }
                        </div>
                    </Paper>

                    {experiment && experiment.participants && <Paper style={{
                        background: 'rgb(169,195,225)',
                        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
                        padding: '16px',
                        width: '100%',
                        borderRadius: 0,
                        paddingBottom: '10px',
                        paddingTop: '10px'}}>
                        <div style={{padding: '10px', textAlign: 'center' }}>
                            <Typography variant="h6">Participants ({experiment.participants.length})</Typography>
                        </div>
                        {
                            experiment && experiment.participants && experiment.participants.sort((p1,p2) => {return p1.id.localeCompare(p2.id)}).map(participant => {
                                return(
                                    <Paper style={{paddingBottom: '10px', paddingTop: '10px', borderColor: getParticipantTypeId(participant.id)}} variant="outlined">
                                        <div style={{padding: '10px', textAlign: 'center' }}>
                                            <Typography variant="body1"><b>{participant && participant.id}</b></Typography>
                                        </div>
                                        <Grid item xs={12}>
                                            <Typography align="left"><b>Participant Detection Method:</b> {participant.detectionMethod}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography align="left"><b>Biological Role:</b> {participant.biologicalRole}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography align="left"><b>Experiment Role:</b> {participant.experimentalRole}</Typography>
                                        </Grid>
                                    </Paper>
                                )
                            })
                        }
                    </Paper>}
                </Box>
            </Box>
            }
            <Footer/>
        </>
    );
}

export default ExperimentComponent;