import {useParams} from "react-router";
import {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {AppBar, Box, Grid, IconButton, InputBase, Paper, Toolbar, Typography, useTheme} from "@mui/material";

interface AssociationToDisplay {
    id: string,
    pmid: string,
    biomolecule: [string],
    source: string,
    spokeexpandedfrom?: string,
    directlysupportedby?: string,
    inferredfrom?: string
}


function AssociationComponent() {
    const { associationId } = useParams();
    const [association, setAssociation] = useState<AssociationToDisplay>();

    useEffect(() => {
        http.get("/associations/" + associationId)
            .then((associationResponse) => {
                if(associationResponse.data && associationResponse.data.association) {
                    let associationData = associationResponse.data.association;
                    let association = {
                        id: associationData.id,
                        pmid: associationData.pmid,
                        biomolecule: associationData.biomolecule,
                        source: associationData.source,
                        spokeexpandedfrom: associationData?.spokeexpandedfrom,
                        directlrysupportedby: associationData?.directlrysupportedby,
                        inferredfrom: associationData?.inferredfrom
                    }
                    setAssociation(association);
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
                    {association && <Paper variant="outlined">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5">{association.id}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>Biomolecule:</b> {
                                    association.biomolecule.map(b => {
                                            let link = "/biomolecule/" + b;
                                            return (<a href={link}>{b}</a>)
                                        }
                                    )}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>ID:</b> {association.id}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>PMID:</b> <a href={"https://pubmed.ncbi.nlm.nih.gov/"+association.pmid} target="_blank">{association.pmid}</a></Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>Source:</b> {association.source}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align="left"><b>Spoke Expanded From:</b> {association.spokeexpandedfrom}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>}
                </Box>
            </Box>
        </>
    );
}

export default AssociationComponent;