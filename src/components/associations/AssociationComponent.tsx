import {useParams} from "react-router";
import {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {AppBar, Box, Grid, IconButton, InputBase, Paper, Toolbar, Typography, useTheme} from "@mui/material";

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
    });

    const theme = useTheme();
    return (<>
            <Box sx={{ display: 'flex', bgcolor: 'white' , alignItems: 'center'}}>
                <AppBar style={{zIndex: theme.zIndex.drawer + 1}} position="fixed">
                    <Toolbar className={'App-search-header'}>
                        <div>
                            <a href="/">
                                <img src={logo} alt={""} style={{width: '50px', height: '50px'}} className={"App-logo"}/>
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
            {
                association &&
                    <>
                        <Grid container direction="column" justifyContent="center" alignItems="center" paddingTop={'70px'}>
                            <Grid item width='50%'>
                                {association &&
                                <Paper variant="outlined" style={{background: '#cbdef2'}}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h6">
                                                Interaction
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography align="left"><b>Biomolecules:</b> {
                                                association.participants.map(b => {
                                                        let link = "/biomolecule/" + b;
                                                        return (
                                                            <Grid item xs={6}>
                                                                <a href={link}>{b}</a>
                                                            </Grid>)
                                                    }
                                                )}</Typography>
                                        </Grid>
                                        {association.directlysupportedby && <Grid item xs={12}>
                                            <Typography align="left"><b>Supporting experiment(s):</b>
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
                                        </Grid>}
                                        {association.spokeexpandedfrom && <Grid item xs={12}>
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
                                        </Grid>}
                                        {association.pmid && <Grid item xs={12}>
                                            <Typography align="left"><b>PMID:</b> <a href={"https://pubmed.ncbi.nlm.nih.gov/"+association.pmid} target="_blank">{association.pmid}</a></Typography>
                                        </Grid>}
                                        {association.source && <Grid item xs={12}>
                                            <Typography align="left"><b>Source:</b> {association.source}</Typography>
                                        </Grid>}
                                    </Grid>
                                 </Paper>
                                }
                            </Grid>
                                {association.inferredfrom &&
                                <Grid item width='50%'>
                                    <Paper variant="outlined" style={{background: '#dff1e4'}}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography align="left"><b>Inferred from:</b> {
                                                    association.inferredfrom.map(b => {
                                                            let link = "/association/" + b;
                                                            return (
                                                                <Grid item xs={6}>
                                                                    <a href={link}>{b}</a>
                                                                </Grid>)
                                                        }
                                                    )}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                }
                        </Grid>
                    </>

            }
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
        </>
    );
}

export default AssociationComponent;