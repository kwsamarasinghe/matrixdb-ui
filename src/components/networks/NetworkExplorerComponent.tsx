import React, {useEffect, useState} from "react";
import {
    AppBar,
    Autocomplete, Box,
    IconButton,
    InputLabel, LinearProgress, List, ListItem,
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
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../../stateManagement/store";
import * as actions from "../../stateManagement/actions";

const mapStateToProps = (state: RootState) => ({
    currentState: state.currentState,
    filterConfiguration: state.filterConfiguration,
    filters: state.filters,
    network: state.network
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    setNetworkDataAction: (networkData: any) => dispatch(actions.setNetworkDataAction(networkData))
});

const connector = connect(mapStateToProps, mapDispatchToProps);


const NetworkExplorer: React.FC<any> = ({
                                          setNetworkDataAction
                                        }) => {

    const [searchQuery,setSearchQuery] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<Array<string>>([]);
    const [suggestionNameMapping, setSuggestionNameMapping] = useState<Map<string,string> | null>(null);
    const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
    const [loadingNetwork, setLoadingNetwork] = useState<boolean>(false);
    const [biomolecules, setBiomolecules] = useState<[string] | []>([]);
    const [network, setNetwork] = useState<any | null>(null);
    const theme = useTheme();

    useEffect(() => {
        if(searchQuery && searchQuery.length >= 3) {
            setLoadingSuggestions(true);
            http.get("/biomolecules/suggestions/" + searchQuery)
                .then((suggestionResponse) => {
                    setSuggestions([]);
                    setSuggestions(suggestionResponse.data.suggestions.map((suggestion:any) => suggestion.name));

                    let nameMapping : Map<string, string> = new Map<string, string>();
                    suggestionResponse.data.suggestions.forEach((suggestion:any) => nameMapping.set(suggestion.name as string, suggestion.biomolecule_id));
                    setSuggestionNameMapping(nameMapping);

                    setLoadingSuggestions(false);
                });
        }
    }, [searchQuery]);

    useEffect(() => {
        let biomoelcules = getFromLocalStorage("selectedBiomolecules");
        if(!biomoelcules) biomoelcules = [];
        setBiomolecules(biomolecules);
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
            http.post("/network", {
                biomolecules: biomolecules
            })
                .then((networkResponse) => {
                    setNetworkDataAction({...networkResponse.data, biomolecules: JSON.parse(JSON.stringify(biomolecules))});
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
                                options={suggestions}
                                value={searchQuery}
                                noOptionsText={'Type and search for biomolecules'}
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
                                    let newBiomoelcules : [string] | []= [];
                                    if(biomolecules.length > 0) {
                                        newBiomoelcules = biomolecules;
                                    }
                                    if (newValue) {
                                        // Get the id from name
                                        let biomoleculeId = null;
                                        if(suggestionNameMapping) {
                                            biomoleculeId = suggestionNameMapping.get(newValue as string);
                                        }
                                        if(biomoleculeId) {
                                            newBiomoelcules.push(biomoleculeId as never);
                                        }
                                        setBiomolecules(newBiomoelcules);
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
                                                            width: '250px'
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
                            />
                        </>
                    }
                    {
                        loadingNetwork &&
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '60vh',
                        }}>
                            <div style={{
                                width: '80%',
                            }}>
                                <Box sx={{
                                    width: '100%',
                                    textAlign: 'center',
                                }}>
                                    <Typography variant={'body1'}>
                                        Building interaction network for {biomolecules.map((b: string) => b).join(', ')}
                                    </Typography>
                                    <LinearProgress />
                                </Box>
                            </div>
                        </div>
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

export default connector(NetworkExplorer);