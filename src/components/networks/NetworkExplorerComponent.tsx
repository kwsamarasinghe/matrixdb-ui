import React, {useEffect, useState} from "react";
import {AppBar, Autocomplete, IconButton, InputLabel, TextField, Toolbar, useTheme} from "@mui/material";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import AssociationNetworkComponent from "./AssociationNetworkComponent";
import http from "../../commons/http-commons";
import BuildIcon from "@mui/icons-material/Build";
import ClearIcon from "@mui/icons-material/Clear";


function NetworkExplorer(props: any){

    const [searchQuery,setSearchQuery] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<Array<string>>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
    const [loadingNetwork, setLoadingNetwork] = useState<boolean>(false);
    const [biomolecules, setBiomolecules] = useState<Array<any>>([]);
    const [network, setNetwork] = useState<any | null>(null);
    const theme = useTheme();

    useEffect(() => {
        if(searchQuery && searchQuery.length >= 3) {
            setLoadingSuggestions(true);
            http.get("/biomolecules/suggestions/" + searchQuery)
                .then((suggestionResponse) => {
                    setSuggestions(suggestionResponse.data.suggestions);
                    setLoadingSuggestions(false);
                });
        }
    }, [searchQuery])

    const generateNetwork = () => {
        if(biomolecules.length > 0 ) {
            setLoadingNetwork(true);
            http.post("/networks", {
                biomolecules: biomolecules
            })
                .then((networkResponse) => {
                    setNetwork({
                        participantIds: networkResponse.data.participants,
                        associations: networkResponse.data.associations
                    });
                    setLoadingNetwork(false);
                });
        }
    }

    const clearBiomolecules = () => {
        setBiomolecules([]);
        setNetwork(null);
        setLoadingNetwork(false);
    }

    return (
        <>
        <div>
            <AppBar style={{ zIndex: theme.zIndex.drawer + 1 }} position="static">
                <Toolbar className={'App-search-header'}>
                    <div>
                        <a href="/">
                            <img src={logo} style={{width: '50px', height: '50px'}} className={"App-logo"}/>
                        </a>
                    </div>
                </Toolbar>
            </AppBar>
            <div>
                <div style={{
                    paddingTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Autocomplete
                        style={{ width: '500px' }}
                        size={"medium"}
                        id="property"
                        disabled={loadingSuggestions || loadingNetwork}
                        options={suggestions}
                        value={searchQuery}
                        onInputChange={(event, newInputValue) => {
                            setSearchQuery(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                            />
                        )}
                        onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => {
                            if(newValue){
                                setBiomolecules([...biomolecules, newValue]);
                            }
                        }}
                    />
                </div>
                <div style={{
                    paddingTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    Interaction network for : {biomolecules.map((biomolecule) => {
                        return(<InputLabel style={{
                            border: '1px solid green',
                            padding: '5px',
                            textAlign: 'center',
                            color: 'green',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            fontSize: '12px',
                            textTransform: 'capitalize'
                        }}>{biomolecule}</InputLabel>)
                    })}
                    {
                        biomolecules.length > 0 &&
                        <IconButton style={{color: 'green'}} aria-label="Generate">
                            <BuildIcon onClick={generateNetwork}/>
                        </IconButton>
                    }
                    {
                        biomolecules.length > 0 &&
                        <IconButton style={{color: 'green'}} aria-label="Generate">
                            <ClearIcon onClick={clearBiomolecules}/>
                        </IconButton>
                    }
                </div>
            </div>
        </div>

        {
            !loadingNetwork && biomolecules.length > 0 && network && <AssociationNetworkComponent
                biomoleculeIds={biomolecules}
                network={network}
            />
        }
        </>
    );
}

export default NetworkExplorer;