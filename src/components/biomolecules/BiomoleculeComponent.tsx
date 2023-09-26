import {useEffect, useState} from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    InputBase,
    Paper,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useTheme,
    ListItemButton,
    ListItemIcon,
    Box,
    Typography
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {useParams} from "react-router";
import OverviewComponent from "./OverviewComponent";
import http from "../../commons/http-commons";
import AssociationsOverviewComponent from "./AssociationsOverviewComponent";
import KeywordComponent from './KeywordComponent';

function BiomoleculeComponent() {
    const { biomoleculeId } = useParams();
    const [biomolecule, setBiomolecule] = useState(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        http.get("/biomolecules/" + biomoleculeId)
            .then((biomoleculeResponse) => {
                setBiomolecule(biomoleculeResponse.data);
            });
    }, []);

    const handleSearch = () => {
        // handle search logic
    };

    const theme = useTheme();
    /*return (<>
        {biomolecule && 
        <Box sx={{ display: 'flex', bgcolor: 'white', width: '100%' }}>
            <Box>
                <AppBar style={{ zIndex: theme.zIndex.drawer + 1 }} position="fixed">
                    <Toolbar className={'App-search-header'}>
                        <div>
                            <a href="/">
                                <img src={logo} style={{width: '50px', height: '50px'}} className={"App-logo"}/>
                            </a>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto'}}>
                            <Paper sx={{p: '2px 20px', display: 'flex', alignItems: 'center', flex: 1}}>
                                <InputBase
                                    placeholder="Search MatrixDB e.g GAG_1"
                                    inputProps={{'aria-label': 'e.g Heparin'}}
                                    value={biomoleculeId}
                                    onChange={e => setSearchText(e.target.value)}
                                    sx={{ml: 1, flex: 1}}
                                />
                                <IconButton type="button" sx={{p: '10px'}} aria-label="search" onClick={handleSearch}>
                                    <SearchIcon/>
                                </IconButton>
                            </Paper>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box style={{width: "100%"}}>
                <Box style={{width: "10%"}}>
                    <Drawer sx={{borderRight: 'none'}}
                        variant="permanent"
                    >
                        <Toolbar/>
                        <Box sx={{overflow: 'auto'}}>
                            <List>
                                {['Overview', 'Interactions', 'Expression', 'Keywords'].map((text, index) =>
                                    {
                                        if(biomolecule) {
                                            return (
                                                <ListItem key={text} disablePadding>
                                                    <ListItemButton>
                                                        <ListItemIcon>
                                                        </ListItemIcon>
                                                        <ListItemText primary={text}/>
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                        }
                                    }
                                )}
                            </List>
                        </Box>
                    </Drawer>
                </Box>
                <Box style={{width: "88%"}}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        {
                            biomolecule &&
                            <div style={{marginBottom: '10px'}}>
                                <OverviewComponent biomolecule={biomolecule}/>
                            </div>
                        }
                        {
                            biomoleculeId &&
                            <div style={{marginBottom: '10px'}}>
                                <AssociationsOverviewComponent biomoleculeId={biomoleculeId}/>
                            </div>
                        }
                        {
                            biomolecule &&
                            <div style={{marginBottom: '10px'}}>
                                <KeywordComponent biomolecule={biomolecule}/>
                            </div>
                        }
                    </div>
                </Box>
            </Box>
        </Box>
        }
        {
                !biomolecule &&
                <Box sx={{ display: 'flex', bgcolor: 'white' , justifyContent: 'center'}}>
                    <Box component="main" justifyContent="center" style={{paddingTop: "70px", width: "50%"}}>
                        <Paper elevation={2}>
                          <Typography variant="subtitle1" component="span">
                            <h5>No data currently availble on association {biomoleculeId}</h5>
                          </Typography>
                        </Paper>
                    </Box>
                </Box>
        }
        </>
    );*/
    return(
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
            <Box display="flex">
                    <Box style={{width: "10%"}}>
                            <List>
                                {['Overview', 'Interactions', 'Expression', 'Keywords'].map((text, index) =>
                                    {
                                        if(biomolecule) {
                                            return (
                                                <ListItem 
                                                    key={text} 
                                                    disablePadding
                                                    sx={{ py: 0, px: 0, paddingLeft: "5px", paddingBottom: "2px" }}
                                                >
                                                    <ListItemButton 
                                                        component="a" 
                                                        href="#your-url-here"  
                                                        sx={{ marginY: -1, paddingY: 2, paddingX: 0 }}
                                                        >
                                                        <ListItemText sx={{color: "rgb(12, 30, 88)"}} primary={text}/>
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                        }
                                    }
                                )}
                            </List>
                    </Box>
                    <Box style={{width: "88%"}}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            {
                                biomolecule &&
                                <div style={{marginBottom: '10px'}}>
                                    <OverviewComponent biomolecule={biomolecule}/>
                                </div>
                            }
                            {
                                biomoleculeId &&
                                <div style={{marginBottom: '10px'}}>
                                    <AssociationsOverviewComponent biomoleculeId={biomoleculeId}/>
                                </div>
                            }
                            {
                                biomolecule &&
                                <div style={{marginBottom: '10px'}}>
                                    <KeywordComponent biomolecule={biomolecule}/>
                                </div>
                            }
                        </div>
                    </Box>
            </Box>
    </div>
    )
}

export default BiomoleculeComponent;