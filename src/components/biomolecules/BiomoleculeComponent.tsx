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
    Box
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
                console.log(biomoleculeResponse)
            });
    }, []);

    const handleSearch = () => {
        // handle search logic
    };

    const theme = useTheme();
    return (<>
        <Box sx={{ display: 'flex', bgcolor: 'white' }}>
            <AppBar style={{zIndex: theme.zIndex.drawer + 1}} position="fixed">
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
            <Drawer
                variant="permanent"
                sx={{
                    width: 250,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {width: 250, boxSizing: 'border-box'},
                }}
            >
                <Toolbar/>
                <Box sx={{overflow: 'auto'}}>
                    <List>
                        {['Overview', 'Interactions', 'Expression', 'Keywords'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                    </ListItemIcon>
                                    <ListItemText primary={text}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main">
                    { biomolecule && <OverviewComponent biomolecule={biomolecule}/>}
                    <AssociationsOverviewComponent biomoleculeId={biomoleculeId}/>
                    {
                        biomolecule && <KeywordComponent biomolecule={biomolecule}/>
                    }
            </Box>
        </Box>
        </>
    );
}

export default BiomoleculeComponent;