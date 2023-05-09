import {useEffect, useState} from 'react';
import {
    Box, CircularProgress, Tooltip
} from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import http from "../../commons/http-commons";

interface Interactors{
    count: number,
    countMatrixdb: number,
    countIntact: number,
    direct: number,
    inferred: number,
    spokeExpanded: number,
    interactors: {
        [key: string]: any
    }
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
          field: 'directlysupportedby',
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
          field: 'spokeexpandedfrom',
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
        },
        {
            field: 'newFromIntact',
            headerName: 'From Intact 09/22',
            width: 280,
            renderCell: (params: any) =>  (
                <>
                    {
                        params.value.length > 0 && <Tooltip title={
                                params.value.map((ex :any) => {
                                    return(<li><a href={process.env.REACT_APP_PUBLIC_URL  + "experiment/"+ ex}>{ex}</a></li>)
                                })
                        }>
                            <span className="table-cell-trucate" style={{color: 'green'}}>{params.value.length}</span>
                        </Tooltip>
                    }
                    {
                        params.value.length === 0 && <span className="table-cell-trucate" style={{color: 'green'}}>{params.value.length}</span>
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
            let rows = Object.keys(interactors.interactors).map((interactor : string) => {
                let dsCount = 0, seCount = 0, inCount = 0, newFromIntact = [];
                let ds : string[] = [];
                let se : string[] = [];
                let inf : string[] = [];
                let association = interactors.interactors[interactor].association;
                if(interactors.interactors[interactor].directlysupportedby) {
                    ds = interactors.interactors[interactor].directlysupportedby;
                }

                if(interactors.interactors[interactor]?.spokeexpandedfrom) {
                    se = interactors.interactors[interactor].spokeexpandedfrom;
                }

                if(interactors.interactors[interactor]?.inferredfrom) {
                    inf = interactors.interactors[interactor].inferredfrom;
                }

                if(interactors.interactors[interactor]?.direct_from_intact) {
                    newFromIntact = interactors.interactors[interactor].direct_from_intact;
                }

                return {
                    id: interactor,
                    association: association,
                    directlysupportedby: ds,
                    spokeexpandedfrom: se,
                    inferredfrom: inf,
                    newFromIntact: newFromIntact
                }
            });
            setRows(rows);
        }
    }, [interactors]);

    return (
        <>
            {
                    !loaded && <div style={{paddingTop: '20px'}}>
                        <CircularProgress />
                        </div>
            }
            <Box style={{paddingTop: "10px", paddingLeft: '20px'}}>
                {
                    interactors && 
                    <>
                        <div style={{float: 'left'}}>
                            <h2>Interactions</h2>
                        </div>
                        <div style={{clear: 'left', textAlign: 'left'}}>
                          <h4 >Interactors : 
                            <span style={{ color : 'red'}}>MatrixDB 3.5 {interactors.countMatrixdb}</span>
                            <span style={{ color : 'green'}}>, Intact {interactors.countIntact}</span>
                          </h4>
                          {interactors.direct > 0 && <h4>Directly supported by experiments : <span style={{ color : 'red'}}>{interactors.direct}</span> </h4>}
                          {interactors.inferred > 0 && <h4>Inferred from experimentally-supported interactions involving orthologs : <span style={{ color : 'red'}}>{interactors.inferred}</span> </h4>}
                        </div>
                        {
                            interactors.count > 0 &&
                            <div style={{width: '1100px'}}>
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
                    </>
                }
            </Box>
        </>
    );
}

export default AssociationsOverviewComponent;