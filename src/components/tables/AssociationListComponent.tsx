import React, {useEffect, useState} from 'react';
import {RootState} from "../../stateManagement/store";
import {connect, ConnectedProps} from "react-redux";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Tooltip, Typography} from "@mui/material";
import {CSVLink} from "react-csv";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileDownload} from "@fortawesome/free-solid-svg-icons";

const mapStateToProps = (state: RootState) => ({
    network: state.network,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type AssociationListProps = PropsFromRedux & {biomoleculeIds: [string] | []};
const AssociationListComponent : React.FC<AssociationListProps> = ({network, biomoleculeIds}) => {

    const rows = network.interactions.map((interaction: any) => {
        return {
            id: interaction.id,
            association: interaction.id,
            directlySupportedBy: [],
            spokeExpandedFrom: []
        }
    });
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Partner',
            width: 200,
            renderCell: (params: any) =>  (
                <>
                    <a href={params.value}>{params.value}</a>
                </>)
        },
        {
            field: 'association',
            headerName: 'Association',
            width: 350,
            renderCell: (params: any) =>  (
                <>
                    <a href={process.env.REACT_APP_PUBLIC_URL + "association/"+params.value}>{params.value}</a>
                </>)
        },
        {
            field: 'directlySupportedBy',
            headerName: 'Experimentally Supported',
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
        }
    ];


    return(
        <>
            {
                network.interactors && network.interactors.length > 0 &&
                <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingBottom: '5px'
                    }}>
                        <CSVLink
                            data={rows}
                            headers={['id','association', 'directlySupportedBy', 'spokeExpandedFrom']}
                        >
                            <Typography variant={"body2"}>
                                <FontAwesomeIcon
                                    icon={faFileDownload}
                                    style={{
                                        marginRight: '10px',
                                        fontSize: '1.5em'
                                    }}
                                    color={'darkgreen'}
                                />Export as CSV
                            </Typography>

                        </CSVLink>
                    </div>
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
                                        pageSize: 10,
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
    );
}

export default connector(AssociationListComponent);