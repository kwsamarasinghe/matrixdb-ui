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
    imaxId: string,
    pmid: string,
    biomolecule: Array<string>,
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
                        biomolecule: experimentData.biomolecule,
                        source: experimentData.source,
                        spokeexpandedfrom: experimentData?.spokeexpandedfrom,
                        directlysupports: experimentData?.directlysupports,
                        inferredfrom: experimentData?.inferredfrom,
                        detectionMethod: experimentData.interaction_detection_method,
                        type: experimentData.interaction_type,
                        comment: experimentData.comment,
                        intactId: experimentData?.intact_xref,
                        imaxId: experimentData?.imex_id_experiment,
                        participants: experimentData.Participants && Object.keys(experimentData.Participants).map(pk  => {
                            return {
                                id: experimentData.Participants[pk].id,
                                biomolecule: experimentData.Participants[pk].biomolecule,
                                detectionMethod: experimentData.Participants[pk].participant_detection_method,
                                biologicalRole: experimentData.Participants[pk].biorole,
                                experimentalRole: experimentData.Participants[pk].exprole
                            }
                        })
                    }
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
        borderRadius: 0
    };

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
                        height: "80vh"
                    }}
                >
                <Box style={{ width: "60%" }}>
                    <Paper style={paperStyle}>

                            <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                                <div style={{ paddingLeft: '20px'}}>
                                    <h2>{generateExperimentName(experiment)}</h2>
                                </div>
                            </div>


                            <Typography align="left"><b>Identifier:</b> {experiment.id}</Typography>

                            {experiment.intactId &&
                                <Typography align="left"><b>Intact Identifier:</b>
                                    <a href={"http://www.ebi.ac.uk/intact/interaction/EBI-15184828/" + experiment.intactId}>
                                        {experiment.intactId}
                                    </a>
                                </Typography>
                            }
                            {experiment.imaxId &&
                                <Typography align="left"><b>IMAX Identifier:</b>
                                    <a href={"https://www.ebi.ac.uk/intact/imex/main.xhtml?query="+experiment.imaxId+"&Search=1#"}>
                                        {experiment.imaxId}
                                    </a>
                                </Typography>
                            }
                            {experiment.comment &&
                                <Typography align="left"><b>General Comment:</b> {experiment.comment}</Typography>
                            }

                                <Typography align="left">
                                    <b>Detection Method:</b>
                                    <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.detectionMethod }>
                                        {experiment.detectionMethod}
                                    </a>
                                </Typography>


                                <Typography align="left"><b>Interaction Type:</b>
                                    <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.type }>
                                        {experiment.type}
                                    </a>
                                </Typography>


                                <Typography align="left"><b>PMID:</b>
                                    <a href={"https://pubmed.ncbi.nlm.nih.gov/"+experiment.pmid} target="_blank">{experiment.pmid}</a>
                                </Typography>


                                <Typography align="left"><b>Source:</b>
                                    <a target="_blank"  href={"http://purl.obolibrary.org/obo/" +experiment.source }>
                                        {experiment.source}
                                    </a>
                                </Typography>
                            {experiment.directlysupports &&
                                <Typography align="left"><b>Directly Supports:</b> {experiment.directlysupports}</Typography>
                            }
                    </Paper>

                    {experiment && experiment.participants && <Paper style={paperStyle}>
                        <Typography variant="h5">Participants</Typography>
                        {
                            experiment && experiment.participants && experiment.participants.sort((p1,p2) => {return p1.biomolecule.localeCompare(p2.biomolecule)}).map(participant => {
                                return(
                                    <Paper variant="outlined">
                                        <Typography variant="h6">{participant && participant.biomolecule}</Typography>
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