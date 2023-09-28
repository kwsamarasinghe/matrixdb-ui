import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    Pagination,
    Typography
} from "@mui/material";


function ResultComponent(props : any) {

    const [currentPage, setCurrentPage] = useState(1);

    return (
        <>
            <div className={"App-search"}>
                <List>
                    {
                        props.searchResults &&
                        props.searchResults.slice((currentPage - 1) * 10, currentPage * 10).map((result: any) => {
                            return(
                                <ListItem>
                                    <Card sx={{ width: 500 }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                                                <a href={process.env.REACT_APP_PUBLIC_URL + "biomolecule/" + result.id}>{result.id}</a>
                                            </Typography>
                                            {
                                                result.names && result.names.common_name && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.names.common_name}
                                                </Typography>
                                            }
                                            {
                                                result.names && result.names.other_name 
                                                && !Array.isArray(result.names.other_name)
                                                && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.names.other_name}
                                                </Typography>
                                            }
                                            {
                                                result.names && result.names.other_name 
                                                && Array.isArray(result.names.other_name)
                                                && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.names.other_name[0]}
                                                </Typography>
                                            }
                                            {
                                                result.description && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.description}
                                                </Typography>
                                            }
                                            {
                                                result.xrefs && Object.values(result.xrefs).map((xref : any) => {
                                                    return(<Typography variant="body2">
                                                        {xref}
                                                    </Typography>)
                                                }) 
                                            }
                                            
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            );
                        })
                    }
                </List>
                {
                    props.searchResults && props.searchResults.length > 0 && 
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        <Pagination
                        count={Math.ceil(props.searchResults.length / 10)}
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                        color="primary"
                        />
                    </Box>
                }
            </div>
        </>
    );
}

export default ResultComponent;
