import React, {useEffect, useState} from "react";
import {
    AppBar,
    Autocomplete,
    IconButton,
    InputLabel, List, ListItem,
    Paper,
    TextField,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import AssociationNetworkComponent from "./AssociationNetworkComponent";
import http from "../../commons/http-commons";
import BuildIcon from "@mui/icons-material/Build";
import ClearIcon from "@mui/icons-material/Clear";
import HeaderComponent from "../home/HeaderComponent";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";


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
    }, [searchQuery]);

    useEffect(() => {
        setBiomolecules(getFromLocalStorage("selectedBiomolecules"));
    }, []);

    const getFromLocalStorage = (key: string) => {
        try {
            const storedData = localStorage.getItem(key);
            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            console.error('Error retrieving from local storage:', error);
            return null;
        }
    };

    const saveToLocalStorage = (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    };

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
        saveToLocalStorage("selectedBiomolecules", []);
    }

    const footerHeight = 60;
    const paperHeight = `calc(100vh - ${footerHeight}px)`;

    return (
        <>
            <Header pageDetails={{
                type: 'network',
            }}/>
            <div style={{ height: '100%', minHeight: '81vh', display: 'flex' }}>
                <div style={{width: '20%', padding: '20px' }}>
                    <Paper elevation={1} style={{ padding: '20px' }}>
                        <div style={{
                            paddingTop: '10px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div>
                                <Typography variant={'body2'}>
                                    <strong>Search for biomolecules to generate interaction networks </strong>
                                </Typography>
                            </div>
                            <Autocomplete
                                style={{ width: '100%' }}
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
                                    if (newValue) {
                                        setBiomolecules([...biomolecules, newValue]);
                                    }
                                }}
                            />
                            <div style={{
                                paddingTop: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                {
                                    !loadingNetwork && biomolecules.length > 0 &&
                                    <div>
                                        <Typography>Interaction network for : </Typography>
                                    </div>
                                }
                                <div>
                                    <List>
                                        {
                                            biomolecules.map((biomolecule, index) => {
                                                return (

                                                    <ListItem key={index}>
                                                        <InputLabel style={{
                                                            border: '1px solid green',
                                                            padding: '5px',
                                                            textAlign: 'center',
                                                            color: 'green',
                                                            fontWeight: 'bold',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            textTransform: 'capitalize',
                                                            width: '50px'
                                                        }}>{biomolecule}</InputLabel>
                                                    </ListItem>
                                                )
                                            })
                                        }
                                    </List>
                                </div>
                            </div>
                        </div>
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
                    </Paper>
                </div>

                <div style={{ width: '80%', padding: '20px', overflowY: 'auto' }}>
                    {
                        !loadingNetwork && biomolecules.length > 0 && network &&
                        <>
                            <AssociationNetworkComponent
                                biomoleculeIds={biomolecules}
                                network={network}
                            />
                        </>
                    }
                </div>
            </div>
            {/*<div style={{height: '81vh', width: '20%', maxWidth: '400px'}}>
                <Paper
                    elevation={1}
                    style={{ padding: '20px' }}
                >
                    <div style={{
                        paddingTop: '100px',
                        display: 'flex',
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
                </Paper>
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
            </div>*/}
            <Footer/>

        </>
    );
}

export default NetworkExplorer;