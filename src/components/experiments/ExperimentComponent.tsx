import {useParams} from "react-router";
import {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {AppBar, Box, experimentalStyled, Grid, IconButton, InputBase, Paper, Toolbar, Typography, useTheme} from "@mui/material";


interface ParticipantToDisplay {
    id: string,
    biomolecule: string,
    detectionMethod: string,
    biologicalRole: string,
    experimentalRole: string
}

interface ExperimentToDisplay {
    id: string,
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
                        type: experimentData.type,
                        comment: experimentData.comment,
                        participants: Object.keys(experimentData.Participants).map(pk  => {
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

    const theme = useTheme();
    return (<>
            <Box sx={{ display: 'flex', bgcolor: 'white' , alignItems: 'center'}}>
                <AppBar style={{zIndex: theme.zIndex.drawer + 1}} position="fixed">
                    <Toolbar className={'App-search-header'}>
                        <div>
                            <a href="/">
                                <img src={logo} style={{width: '50px', height: '50px'}} className={"App-logo"}/>
                            </a>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto'}}>
                            <Paper sx={{p: '2px 20px', display: 'flex', alignItems: 'center', flex: 1}}>
                                <InputBase
                                    placeholder="Search MatrixDB e.g GAG_1"
                                    inputProps={{'aria-label': 'e.g Heparin'}}
                                    sx={{ml: 1, flex: 1}}
                                />
                                <IconButton type="button" sx={{p: '10px'}} aria-label="search">
                                    <SearchIcon/>
                                </IconButton>
                            </Paper>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{ display: 'flex', bgcolor: 'white' , justifyContent: 'center'}}>
                <Box component="main" justifyContent="center" style={{paddingTop: "70px", width: "50%"}}>
                    {experiment && <Paper variant="outlined">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5">{experiment.id}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>Biomolecule:</b> {
                                    experiment.biomolecule.map(b => {
                                            let link = "/biomolecule/" + b;
                                            return (<a href={link}>{b}</a>)
                                        }
                                    )}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>General Comment:</b> {experiment.comment}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>Detection Method:</b> {experiment.detectionMethod}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>Interaction Type:</b> {experiment.type}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>PMID:</b> <a href={"https://pubmed.ncbi.nlm.nih.gov/"+experiment.pmid} target="_blank">{experiment.pmid}</a></Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>Source:</b> {experiment.source}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>Directly Supports:</b> {experiment.directlysupports}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>}

                    <Paper variant="outlined">
                        <Typography variant="h5">Participants</Typography>
                        {
                            experiment && experiment.participants && experiment.participants.map(participant => {
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
                    </Paper>
                </Box>
            </Box>
        </>
    );
}

export default ExperimentComponent;