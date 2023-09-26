import {
    Box,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import {CSSProperties, useEffect, useState} from "react";
import http from "../../commons/http-commons";
import {DataGrid, GridColDef} from "@mui/x-data-grid";


interface Keyword{
    id: string,
    category: string,
    definition: string,
    identifier: string,
}

function KeywordComponent(props: any) {

    const {biomolecule} = props;
    const [keywords, setKeywords] = useState([]);
    const [keywordDetails, setKeywordDetails] = useState<Array<Keyword>>([]);

    useEffect(() => {
        if(biomolecule.Keywrd) {
            setKeywords(biomolecule.Keywrd);
        }
    }, []);

    useEffect(() => {
        if(keywords && keywords.length > 0) {
            let ids = keywords.map(k => {return "id="+k}).join("&");
            http.get("/xrefs?" + ids)
                .then((xrefResponse) => {
                    let keywords = xrefResponse.data.map((xref : any)=> {
                        return{
                            id: xref["id"],
                            category: xref["category"],
                            definition: xref["definition"],
                            identifier: xref["identifier"]
                        }
                    });
                    setKeywordDetails(keywords);
                });
        }
    }, [keywords]);

    const columns: GridColDef[] = [
        {
            field: 'identifier',
            headerName: 'Term',
            width: 150,
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            renderCell: (params: any) =>  (
                <>
                    <a href={"https://www.uniprot.org/keywords/"+params.value} target="_blank">{params.value}</a>
                </>)
        },
        {
            field: 'definition',
            headerName: 'Definition',
            width: 700,
            renderCell: (params: any) =>  (
                <>
                    <Tooltip title={params.value} placement="top-start">
                        <span>{params.value}</span>
                    </Tooltip>
                </>)
        }

    ]

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
    };

    return(
        <>
            {keywords && keywords.length > 0 && <Paper style={paperStyle}>

                <Grid container spacing={3} style={{paddingTop: "30px"}}>
                    <div style={{float: 'left', paddingLeft: '40px'}}>
                        <h2>Keywords</h2>
                    </div>
                    <Grid item xs={12}>
                        <DataGrid
                            rows={keywordDetails}
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
                    </Grid>
                </Grid>
            </Paper>}
        </>
    );
}

export default KeywordComponent;