import React, {useEffect, useState} from "react";
import {
    Alert,
    AppBar,
    Autocomplete, Avatar, Box, Card, CardContent,
    IconButton,
    InputLabel, LinearProgress, List, ListItem,
    Paper,
    TextField,
    Toolbar, Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import AssociationNetworkComponent from "./AssociationNetworkComponent";
import http from "../../commons/http-commons";
import BuildIcon from "@mui/icons-material/Build";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ClearIcon from "@mui/icons-material/Clear";
import HeaderComponent from "../home/HeaderComponent";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../../stateManagement/store";
import * as actions from "../../stateManagement/actions";
import SpeciesIcon from "../commons/icons/SpeciesIcon";

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
    const [suggestionNameMapping, setSuggestionNameMapping] = useState<Map<string,any> | null>(null);
    const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
    const [loadingNetwork, setLoadingNetwork] = useState<boolean>(false);
    const [biomolecules, setBiomolecules] = useState<[any] | []>([]);
    const [network, setNetwork] = useState<any | null>(null);
    const [networkGenerationError, setNetworkGenerationError] = useState<boolean>(false);
    const theme = useTheme();

    useEffect(() => {
        if(searchQuery && searchQuery.length >= 3) {
            setLoadingSuggestions(true);
            http.get("/biomolecules/suggestions/" + searchQuery)
                .then((suggestionResponse) => {
                    let nameMapping : Map<string, string> = new Map<string, string>();
                    suggestionResponse.data.suggestions.forEach((suggestion:any) => nameMapping.set(suggestion.biomolecule_id as string, suggestion));
                    if(nameMapping.size !== 0) {
                        setSuggestionNameMapping(nameMapping);
                        setSuggestions([...nameMapping.keys()]);
                    }
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
            let biomoleculeIds = biomolecules.map((biomolecule: any) => biomolecule.biomolecule_id);
            http.post("/network", {
                biomolecules: biomoleculeIds
            })
                .then((networkResponse) => {
                    setNetworkDataAction({...networkResponse.data, biomolecules: JSON.parse(JSON.stringify(biomoleculeIds))});
                    setNetwork({
                        participantIds: networkResponse.data.participants,
                        associations: networkResponse.data.associations
                    });
                    setLoadingNetwork(false);
                })
                .catch((reason: any) => {
                    setNetworkGenerationError(true);
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

    const renderOptions = (params: any) => {
        return (<TextField {...params} variant="outlined"/>);
    }

    function BiomoleculeTypeIcon(props: any){
        let {biomoleculeType} = props;
        const defaultStyles = {
            width: 28,
            height: 28,
            color: '#fff',
            fontSize: 8,
            fontWeight: 'bold'
        };

        const cases = {
            "protein": { backgroundColor: '#f89406', text: "PROT" },
            "gag": { backgroundColor: '#018FD5', text: "GAG" },
            "multimer": { backgroundColor: '#6a09c5', text: "MULT" },
            "pfrag": { backgroundColor: '#f5e214', text: "PRAG" }
        };

        let styles : any;
        switch(biomoleculeType) {
            case "protein":
                styles = { backgroundColor: '#f89406', text: "PROT" };
                break
            case "gag":
                styles = { backgroundColor: '#018FD5', text: "GAG" };
                break
            case "multimer":
                styles = { backgroundColor: '#6a09c5', text: "MULT" };
                break
            case "pfrag":
                styles = { backgroundColor: '#f5e214', text: "PRAG" }
                break
        }

        return (
            <Avatar
                sx={{
                    ...defaultStyles,
                    ...styles
                }}
            >
                {styles.text}
            </Avatar>
        );
    }

    const getSpeciesNCBI = (biomolecule: any) => {
        if(biomolecule.species) {
            return biomolecule.species;
        } else {
            let biomoleculeId = biomolecule.biomolecule_id;
            let biomolTokens = biomoleculeId.split('_');
            if(biomolTokens.length > 1) {
                return biomolTokens[biomolTokens.length - 1].toLowerCase();
            }
        }
    }

    function BiomoleculeCard(props: any) {
        let {biomolecule} = props;
        return(<Card variant="outlined" style={{ marginBottom: '8px' }}>
            <CardContent style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <div style={{display: "flex"}}>
                    <BiomoleculeTypeIcon biomoleculeType={biomolecule?.biomolecule_type}/>
                    <Typography
                        variant="body1"
                        style={{
                            marginRight: '16px',
                            marginLeft: '8px'
                        }}
                    >
                        {biomolecule.recommended_name ?  biomolecule.recommended_name : biomolecule.name }
                    </Typography>
                    <SpeciesIcon speciesId={getSpeciesNCBI(biomolecule)} width="20" height="20" />
                </div>
                <div style={{ display: 'inline-block', paddingTop: '5px' }}>
                    <Typography
                        variant="body2"
                        style={{
                            marginLeft: '8px'
                        }}
                    >
                        {biomolecule.biomolecule_id }
                    </Typography>
                </div>
            </CardContent>
        </Card>);
    }

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
                                    if(newInputValue !== undefined) {
                                        setSearchQuery(newInputValue);
                                    }
                                }}
                                renderInput={(params) => {
                                    return renderOptions(params);
                                }}
                                filterOptions={(options: any[], state: any) => {
                                    return options;
                                }}
                                renderOption={(props: any, option: any) => {
                                    if(suggestions.length === 0) return;
                                    if(suggestionNameMapping && option !== undefined) {
                                        let optionDetails = suggestionNameMapping.get(option);
                                        if(optionDetails) {
                                            return(
                                                <div {...props}>
                                                    <BiomoleculeCard biomolecule={optionDetails}/>
                                                </div>
                                            );
                                        }
                                    }
                                }}
                                onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => {
                                    let newBiomoelcules : [any] | []= [];
                                    if(biomolecules.length > 0) {
                                        newBiomoelcules = biomolecules;
                                    }
                                    if (newValue && suggestionNameMapping) {
                                        let existing = newBiomoelcules.find((bm: any) => bm.biomolecule_id === newValue);
                                        if(!existing) {
                                            newBiomoelcules.push(suggestionNameMapping.get(newValue) as never);
                                            setBiomolecules(newBiomoelcules);
                                            setSearchQuery(null);
                                        }
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
                                                if(biomolecule) {
                                                    return (<BiomoleculeCard biomolecule={biomolecule}/>);
                                                }
                                            })
                                        }
                                    </List>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            justifyContent: 'right',
                            textAlign: 'right'
                        }}>
                            {
                                biomolecules.length > 0 &&
                                <Tooltip title="Clear" arrow>
                                    <IconButton style={{color: 'green'}} aria-label="Clear">
                                        <ClearIcon onClick={clearBiomolecules}/>
                                    </IconButton>
                                </Tooltip>
                            }
                            {
                                biomolecules.length > 0 &&
                                <Tooltip title="Generate Network" arrow>
                                    <IconButton style={{color: 'green'}} aria-label="Generate">
                                        <PlayCircleIcon onClick={generateNetwork}/>
                                    </IconButton>
                                </Tooltip>
                            }
                        </div>
                    </Paper>
                </div>

                <div style={{
                    width: '80%',
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    {
                        !loadingNetwork && biomolecules.length > 0 && network && !networkGenerationError &&
                        <>
                            <AssociationNetworkComponent
                                biomoleculeIds={biomolecules}
                            />
                        </>
                    }
                    {
                        networkGenerationError &&
                        <>
                            <Box sx={{
                                width: '100%',
                                textAlign: 'center'
                            }}>
                                <Alert severity="error">Could not generate network due to unexpected issue.</Alert>
                            </Box>
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
                                        Building interaction network for {biomolecules.map((b: any) => b.biomoelcule_id).join(', ')}
                                    </Typography>
                                    <LinearProgress />
                                </Box>
                            </div>
                        </div>
                    }
                    {
                        networkGenerationError &&
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
                                    <Typography variant="body1" color="warning" gutterBottom>
                                        Network Generation failed.
                                    </Typography>
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