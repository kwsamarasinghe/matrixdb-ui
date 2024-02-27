import {useEffect, useState} from 'react';
import {useParams} from "react-router";
import http from "../../commons/http-commons";

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

import OverviewComponent from "./OverviewComponent";
import AssociationsOverviewComponent from "./AssociationsOverviewComponent";
import KeywordComponent from './KeywordComponent';
import ExpressionComponent from "./ExpressionComponent";
import StructureComponent from "./StructureComponent";
import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";

function BiomoleculeComponent() {
    const { biomoleculeId } = useParams();
    const [sideBarItems, setSideBarItems] = useState<Array<string>>(["Overview", "Interactions"]);
    const [biomolecule, setBiomolecule] = useState<any>(null);

    useEffect(() => {
        if(!biomolecule) {
            http.get("/biomolecules/" + biomoleculeId)
                .then((biomoleculeResponse) => {
                    let biomoleculeData = biomoleculeResponse.data;
                    if(biomoleculeData) {
                        setBiomolecule(biomoleculeData);

                        // Updates the side bar items
                        let newSideBarItems = sideBarItems;
                        if(biomoleculeData.type === 'protein') {
                            newSideBarItems = [...sideBarItems, "Expressions"];
                        }

                        if(biomoleculeData.molecular_details && biomoleculeData.molecular_details.pdb) {
                            newSideBarItems = [...sideBarItems, "3D Structures"];
                        }
                        setSideBarItems(newSideBarItems);
                    }
                });
        }
    }, []);

    const handleSearch = () => {
        // handle search logic
    };

    const theme = useTheme();

    return(
        <>{biomoleculeId &&
                <div>
                    <Header pageDetails={{
                        type: "biomolecule",
                        id: biomoleculeId
                    }}/>
                    <Box display="flex" marginTop="4px">
                        <Box
                            style={{
                                width: "10%",
                                backgroundColor: "#f0f0f0",
                                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                                paddingLeft: "5px",
                                position: "sticky",
                                top: "64px",
                                height: "100vh",
                                overflowY: "auto",
                            }}
                        >
                            <List>
                                {sideBarItems.map((text, index) => {
                                    if (biomolecule) {
                                        return (
                                            <ListItem
                                                key={text}
                                                sx={{ py: 0, px: 0, paddingLeft: "5px", paddingBottom: "12px" }}
                                            >
                                                <ListItemButton
                                                    component="a"
                                                    href={`#${text}`}
                                                    sx={{
                                                        marginY: -1,
                                                        paddingY: 2,
                                                        paddingX: 0,
                                                        transition: "background 0.3s",
                                                        '&:hover': {
                                                            backgroundColor: "rgba(12, 30, 88, 0.1)",
                                                        },
                                                    }}
                                                >
                                                <span
                                                    style={{
                                                        color: "rgb(12, 30, 88)",
                                                        fontWeight: "bold",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                  {text}
                                                </span>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    }
                                })}
                            </List>
                        </Box>
                        <Box style={{ width: "88%" }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
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
                                        (biomolecule && biomolecule.type === 'protein' ||
                                        biomolecule && biomolecule.type === 'pfrag' ||
                                        biomolecule && biomolecule.type === 'multimer' ) && biomoleculeId &&
                                        <div style={{marginBottom: '10px'}}>
                                            <ExpressionComponent
                                                biomolecule={biomolecule}
                                            />
                                        </div>
                                    }
                                    {
                                        biomolecule && biomolecule.xrefs && biomolecule.xrefs.pdb && biomolecule.xrefs.pdb.length > 0 &&
                                        <div style={{marginBottom: '10px'}}>
                                            <StructureComponent pdb={biomolecule.xrefs.pdb}/>
                                        </div>
                                    }
                                    {
                                        biomolecule && biomolecule.molecular_details && biomolecule.molecular_details.pdb &&
                                        <div style={{marginBottom: '10px'}}>
                                            <StructureComponent pdb={biomolecule.molecular_details.pdb}/>
                                        </div>
                                    }
                                    {
                                        (biomolecule && biomolecule.annotations) &&
                                        ((biomolecule.annotations.go && biomolecule.annotations.go.length >0)
                                            || (biomolecule && biomolecule.annotations.keywords && biomolecule.annotations.keywords.length > 0)) &&
                                        <div style={{marginBottom: '10px'}}>
                                            <KeywordComponent
                                                goTerms={biomolecule.annotations.go}
                                                keywords={biomolecule.annotations.keywords}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        </Box>
                    </Box>
                    <Footer/>
                </div>
        }</>
    )
}

export default BiomoleculeComponent;