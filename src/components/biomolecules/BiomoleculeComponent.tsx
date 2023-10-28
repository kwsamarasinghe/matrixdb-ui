import {useEffect, useState} from 'react';
import {
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemText,
    useTheme,
    ListItemButton,
    Box,
} from '@mui/material';
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {useParams} from "react-router";
import OverviewComponent from "./OverviewComponent";
import http from "../../commons/http-commons";
import AssociationsOverviewComponent from "./AssociationsOverviewComponent";
import KeywordComponent from './KeywordComponent';
import ExpressionComponent from "./ExpressionComponent";
import StructureComponent from "./StructureComponent";

function BiomoleculeComponent() {
    const { biomoleculeId } = useParams();
    const [biomolecule, setBiomolecule] = useState(null);

    useEffect(() => {
        if(!biomolecule) {
            console.log("Biomole")
            http.get("/biomolecules/" + biomoleculeId)
                .then((biomoleculeResponse) => {
                    setBiomolecule(biomoleculeResponse.data);
                });
        }
    }, []);

    const handleSearch = () => {
        // handle search logic
    };

    const theme = useTheme();

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
                                biomoleculeId &&
                                <div style={{marginBottom: '10px'}}>
                                    <ExpressionComponent biomoleculeId={biomoleculeId}/>
                                </div>
                            }
                            {
                                biomolecule &&
                                <div style={{marginBottom: '10px'}}>
                                    <KeywordComponent biomolecule={biomolecule}/>
                                </div>
                            }
                            {
                                biomolecule &&
                                <div style={{marginBottom: '10px'}}>
                                    <StructureComponent pdbId={""}/>
                                </div>
                            }
                        </div>
                    </Box>
            </Box>
    </div>
    )
}

export default BiomoleculeComponent;