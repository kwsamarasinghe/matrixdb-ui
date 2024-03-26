import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import http from "../../commons/http-commons";
import {
    Box,
    Grid,
    Paper,
    TableCell, Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileDownload, faPerson} from "@fortawesome/free-solid-svg-icons";
import {CSVLink} from "react-csv";
import {DataGrid, GridColDef} from "@mui/x-data-grid";


function PublicationComponent() {
    const { publicationId } = useParams();
    const [publication, setPublication] = useState<any>();
    const [interactions, setInteractions] = useState<number>(0);
    const [evidences, setEvidences] = useState<number>(0);

    useEffect(() => {
        http.get("/publications/" + publicationId)
            .then((associationResponse) => {
                if(associationResponse.data && associationResponse.data) {
                    let publicationData = associationResponse.data;
                    setPublication(publicationData);

                    // Calculate interactions and supporting evidences
                    setInteractions(publicationData.interactions.length);
                    let evidences = new Set<string>();
                    publicationData.interactions.forEach((interaction: any) => {
                        if(interaction.experiments) {
                            if(interaction.experiments.direct) {
                                if(interaction.experiments.direct.binary) {
                                    interaction.experiments.direct.binary.forEach((evidence:string) => evidences.add(evidence));
                                }

                                if(interaction.experiments.direct.spoke_expanded_from) {
                                    interaction.experiments.direct.spoke_expanded_from.forEach((evidence:string) => evidences.add(evidence));
                                }
                            }
                        }
                    });
                    setEvidences(evidences.size);
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

    const labelCellStyle = {
        padding: '0px',
        borderBottom: 'none',
        width: '200px'
    };

    const cellStyles = {
        padding: '0px',
        paddingLeft: '10px',
        borderBottom: 'none'
    };

    const rows = publication && publication.interactions.map((interaction: any) => {
        let firstPartner = interaction.participants[0];
        let secondPartner = interaction.participants[1];

        let directlySupported = [];
        if(interaction.experiments.direct && interaction.experiments.direct.binary) {
            directlySupported = interaction.experiments.direct.binary;
        }

        let spokeExpandedFrom = [];
        if(interaction.experiments.direct && interaction.experiments.direct.spoke_expanded_from) {
            spokeExpandedFrom = interaction.experiments.direct.spoke_expanded_from;
        }

        return {
            id: firstPartner + '_' + secondPartner,
            firstPartner: firstPartner,
            secondPartner: secondPartner,
            directlySupportedBy: directlySupported,
            spokeExpandedFrom: spokeExpandedFrom,
            score: interaction.score
        }
    });

    const columns: GridColDef[] = [
        {
            field: 'firstPartner',
            headerName: 'First Partner',
            width: 200,
            renderCell: (params: any) =>  (
                <>
                    <a href={params.value}>{params.value}</a>
                </>)
        },
        {
            field: 'secondPartner',
            headerName: 'Second Partner',
            width: 200,
            renderCell: (params: any) =>  (
                <>
                    <a href={params.value}>{params.value}</a>
                </>)
        },
        {
            field: 'directlySupportedBy',
            headerName: 'Binary Evidence',
            width: 180,
            renderCell: (params: any) =>  (
                <>
                    {
                        params.value.length > 0 && <Tooltip title={
                            params.value.map((ex :any) => {
                                return(<li><a href={process.env.REACT_APP_PUBLIC_URL + "experiment/"+ ex}>{ex}</a></li>)
                            })
                        }>
                            <span className="table-cell-trucate">{params.value.length}</span>
                        </Tooltip>
                    }
                    {
                        params.value.length === 0 && <span className="table-cell-trucate">{params.value.length}</span>
                    }
                </>
            ),
            sortComparator: (v1, v2) =>  v2.length - v1.length
        },
        {
            field: 'spokeExpandedFrom',
            headerName: 'Spoke Expanded Evidence',
            width: 180,
            renderCell: (params: any) =>  (
                <>
                    {
                        params.value.length > 0 && <Tooltip title={
                            params.value.map((ex :any) => {
                                return(<li><a href={process.env.REACT_APP_PUBLIC_URL + "experiment/"+ ex}>{ex}</a></li>)
                            })
                        }>
                            <span className="table-cell-trucate">{params.value.length}</span>
                        </Tooltip>
                    }
                    {
                        params.value.length === 0 && <span className="table-cell-trucate">{params.value.length}</span>
                    }
                </>
            ),
            sortComparator: (v1, v2) =>  v2.length - v1.length
        },
        {
            field: 'score',
            headerName: 'MI Score',
            width: 80,
            renderCell: (params: any) =>  (
                <>
                    {params.value}
                </>
            ),
            sortComparator: (v1, v2) =>  parseInt(v2) - parseInt(v1)
        }
    ];


    return (
        <>
        <div>
            <Header pageDetails={{
                type: "publication",
                id: publicationId
            }}/>
            <div
                style={{
                    display: 'flex',
                    height: "80vh",
                    overflowY: 'auto',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}
            >
                <Box
                    style={{
                        width: "60%",
                        paddingTop: '20px'
                    }}
                >
                    {publication &&
                        <Paper style={paperStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                                <div style={{ paddingLeft: '20px'}}>
                                    <h3>Publication: {publication.title}</h3>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '10%',
                                paddingRight: '10%'
                            }}>
                                <Grid container spacing={0}>
                                    <Grid item lg={12}>
                                        <TableCell
                                            style={{...labelCellStyle, textAlign: 'right', paddingRight: '10px'}}><h4>Pubmed</h4></TableCell>
                                        <TableCell
                                            style={cellStyles}>
                                            <Typography variant={"body2"} align="left">
                                                <a href={`https://pubmed.ncbi.nlm.nih.gov/${publication.publication}`} target={'_blank'}>{publication.publication}</a>
                                            </Typography>
                                        </TableCell>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <TableCell style={{...labelCellStyle, textAlign: 'right', paddingRight: '10px'}}><h4>Journal</h4></TableCell>
                                        <TableCell style={cellStyles}>
                                            <Typography variant={"body2"} align="left">
                                                {publication.journal}
                                            </Typography>
                                        </TableCell>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <TableCell style={{...labelCellStyle, textAlign: 'right', paddingRight: '10px'}}><h4>Author (s)</h4></TableCell>
                                        <TableCell style={cellStyles}>
                                            <Typography variant={"body2"} align="left">
                                                {publication.authors.map((authorDetails: any) => authorDetails.name).join(', ')}
                                            </Typography>
                                        </TableCell>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <TableCell style={{...labelCellStyle, textAlign: 'right', paddingRight: '10px'}}><h4>Year</h4></TableCell>
                                        <TableCell style={cellStyles}>
                                            {publication.pubdate && <Typography variant={"body2"} align="left">
                                                {publication.pubdate}
                                            </Typography>}
                                        </TableCell>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>
                    }
                </Box>
                <Box style={{ width: "60%", paddingTop: '10px' }}>
                    {
                        publication && publication.interactions &&
                        <Paper style={paperStyle}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#e1ebfc',
                                paddingLeft: '20px',
                            }}>
                                <div style={{clear: 'left', textAlign: 'left'}}>
                                    <h4><span>Interactions : {interactions}</span></h4>
                                    <h4><span>Supporting Evidences : {evidences} </span></h4>
                                </div>
                            </div>
                            {
                                <>
                                    {
                                        interactions > 0 &&
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '1100px',
                                                margin: '0 auto',
                                                border: '1px solid #ccc',
                                            }}>
                                                <DataGrid
                                                    rows={rows}
                                                    columns={columns}
                                                    initialState={{
                                                        pagination: {
                                                            paginationModel: {
                                                                pageSize: 5,
                                                            },
                                                        },
                                                    }}
                                                    pageSizeOptions={[5]}
                                                    disableRowSelectionOnClick
                                                />
                                            </div>
                                        </div>
                                    }
                                </>
                            }
                        </Paper>
                    }
                </Box>
                {
                    !publication &&
                    <Box sx={{ display: 'flex', bgcolor: 'black' , justifyContent: 'center'}}>
                        <Box component="main" justifyContent="center" style={{paddingTop: "70px", width: "50%"}}>
                            <Paper elevation={2}>
                              <Typography variant="subtitle1" component="span">
                                <h6>No publication found for id {publicationId}</h6>
                              </Typography>
                            </Paper>
                        </Box>
                    </Box>
                }
            </div>
            <Footer/>
        </div>
        </>
    );
}

export default PublicationComponent;