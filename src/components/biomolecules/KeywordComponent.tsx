import {
    Box,
    Grid,
    Paper, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tabs, Tooltip,
    Typography
} from "@mui/material";
import React, {CSSProperties, useEffect, useState} from "react";
import http from "../../commons/http-commons";
import {DataGrid, GridColDef} from "@mui/x-data-grid";


interface Keyword{
    id: string,
    category: string,
    definition: string,
    identifier: string,
}

function KeywordComponent(props: any) {

    const {goTerms} = props;
    const {keywords} = props;

    const keywordColumns: GridColDef[] = [
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
            field: 'term',
            headerName: 'Term',
            width: 150,
        },
        {
            field: 'definition',
            headerName: 'Definition',
            width: 1500,
            renderCell: (params: any) =>  (
                <>
                    <Tooltip title={params.value} placement="top-start">
                        <span>{params.value}</span>
                    </Tooltip>
                </>)
        }
    ];

    const goColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
            renderCell: (params: any) =>  (
                <>
                    <a href={"https://amigo.geneontology.org/amigo/term/"+params.value} target="_blank">{params.value}</a>
                </>)
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
        },
        {
            field: 'term',
            headerName: 'Term',
            width: 150,
        },
        {
            field: 'definition',
            headerName: 'Definition',
            width: 1500,
            renderCell: (params: any) =>  (
                <>
                    <Tooltip title={params.value} placement="top-start">
                        <span>{params.value}</span>
                    </Tooltip>
                </>)
        }
    ];

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        height: '550px',
        width: '100%',
        borderRadius: 0
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && <Box p={3}>{children}</Box>}
            </div>
        );
    };

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return(
        <>
            {(goTerms && goTerms.length > 0 && keywords && keywords.length > 0) &&
                <Paper style={paperStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                            <span style={{paddingLeft: '10px'}}>
                                <h3>GO Terms & Uniprot Keywords</h3>
                            </span>
                    </div>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab key={0} label={<Typography variant="h6" style={{ textTransform: 'none', fontSize: '1rem' }}>GO Terms</Typography>} />
                        <Tab key={1} label={<Typography variant="h6" style={{ textTransform: 'none', fontSize: '1rem' }}>Uniprot Keywords</Typography>} />
                    </Tabs>
                    <TabPanel key={0} value={tabValue} index={0}>
                        <Grid item xs={12}>
                            <DataGrid
                                rows={goTerms}
                                columns={goColumns}
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
                    </TabPanel>
                    <TabPanel key={1} value={tabValue} index={1}>
                        <Grid item xs={12}>
                            <DataGrid
                                rows={keywords}
                                columns={keywordColumns}
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
                    </TabPanel>
            </Paper>
            }
        </>
    );
}

export default KeywordComponent;