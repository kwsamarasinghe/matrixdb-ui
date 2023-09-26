import {useEffect, useState} from 'react';
import {
    Box, CircularProgress, Paper, Tab, Tabs, Tooltip
} from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import http from "../../commons/http-commons";
import AssociationNetworkComponent from "../associations/AssociationNetworkComponent";

interface Interactors{
    count: number,
    direct: number,
    inferred: number,
    details: {
        [partner: string]: {
            association: string,
            directlySupportedBy: string[],
            spokeExpandedFrom: string[],
            inferredFrom: String[]
        }
    }
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function AssociationsOverviewComponent(props: any) {

    const {biomoleculeId} = props;
    const [interactors, setInteractors] = useState<Interactors>();
    const [rows, setRows] = useState<any[]>([]);
    const [loaded, setLoaded] = useState(false);

    const columns: GridColDef[] = [
        { 
            field: 'id', 
            headerName: 'Partner', 
            width: 150,
            renderCell: (params: any) =>  (
                <>
                    <a href={params.value}>{params.value}</a>
                </>)
        },
        { 
            field: 'association', 
            headerName: 'Association', 
            width: 250,
            renderCell: (params: any) =>  (
                <>
                    <a href={process.env.REACT_APP_PUBLIC_URL + "association/"+params.value}>{params.value}</a>
                </>)
        },
        {
          field: 'directlySupportedBy',
          headerName: 'Directly Supported',
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
          headerName: 'Spoke Expanded',
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
          field: 'inferredfrom',
          headerName: 'Inferred From',
          width: 180,
          renderCell: (params: any) =>  (
            <>
                {
                    params.value.length > 0 && <Tooltip title={
                            params.value.map((ex :any) => {
                                return(<li><a href={process.env.REACT_APP_PUBLIC_URL  + "experiment/"+ ex}>{ex}</a></li>)
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
        }
      ];

    useEffect(() => {
        http.get("/biomolecules/" + biomoleculeId + "/interactors/")
            .then((interactorResponse) => {
                setInteractors(interactorResponse.data);
                setLoaded(true);
            });
    }, []);

    useEffect(() => {
        if(interactors) {
            let rows = Object.keys(interactors.details).map((partner : any) => {
                let ds : string[] = [];
                let se : string[] = [];
                let inf : string[] = [];
                let detail = interactors.details[partner];
                if(detail.directlySupportedBy) {
                    ds = detail.directlySupportedBy;
                }

                if(detail?.spokeExpandedFrom) {
                    se = detail.spokeExpandedFrom;
                }

                return {
                    id: partner,
                    association: interactors.details[partner]["association"] ,
                    directlySupportedBy: ds,
                    spokeExpandedFrom: se,
                    inferredfrom: inf
                }
            });
            setRows(rows);
        }
    }, [interactors]);

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        width: '100%'
    };

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

    return (
        <>
            {
                    !loaded && <div style={{paddingTop: '20px'}}>
                        <CircularProgress />
                        </div>
            }
            {
                interactors && interactors.count > 0 &&
                <div>
                    <Paper style={paperStyle}>
                        <>
                            <div style={{float: 'left'}}>
                                <h2>Interactions</h2>
                            </div>
                            <div style={{clear: 'left', textAlign: 'left'}}>
                                <h4 >Interactors {interactors.count}</h4>
                                {interactors.direct > 0 && <h4>Directly supported by experiments : <span style={{ color : 'red'}}>{interactors.direct}</span> </h4>}
                                {interactors.inferred > 0 && <h4>Inferred from experimentally-supported interactions involving orthologs : <span style={{ color : 'red'}}>{interactors.inferred}</span> </h4>}
                            </div>
                            <Tabs value={tabValue} onChange={handleTabChange} centered>
                                <Tab label="Network View" />
                                <Tab label="List View" />
                            </Tabs>
                            <TabPanel value={tabValue} index={0}>
                                {loaded && <AssociationNetworkComponent biomoleculeIds={[biomoleculeId]}/>}
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                {
                                    interactors.count > 0 &&
                                    <div /*style={{width: '1100px'}}*/>
                                        <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                            paginationModel: {
                                                pageSize: 10,
                                            },
                                            },
                                        }}
                                        pageSizeOptions={[5]}
                                        disableRowSelectionOnClick
                                        />
                                    </div>
                                }
                            </TabPanel>
                        </>
                    </Paper>
                </div>
            }
        </>
    );
}

export default AssociationsOverviewComponent;