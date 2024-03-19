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
    const [showExpressions, setShowExpressions] = useState(false);
    const [showInteractions, setShowInteractions] = useState(false);
    const [showStrctures, setShowStructures] = useState(false);
    const [showKeywords, setShowKeywords] = useState(false);


    const [biomolecule, setBiomolecule] = useState<any>(null);

    useEffect(() => {
        if(!biomolecule) {
            http.get("/biomolecules/" + biomoleculeId)
                .then((biomoleculeResponse) => {
                    let biomoleculeData = biomoleculeResponse.data;
                    if(biomoleculeData) {
                        setBiomolecule(biomoleculeData);

                        if(
                            (biomoleculeData.molecular_details && biomoleculeData.molecular_details.pdb && biomoleculeData.molecular_details.pdb.length > 0) ||
                            (biomoleculeData.xrefs && biomoleculeData.xrefs.pdb && biomoleculeData.xrefs.pdb.lenght > 0)
                        ) {
                            setShowStructures(true);
                        }
                        if(biomoleculeData.type !== 'gag' && ((biomoleculeData.annotations && biomoleculeData.annotations.go && biomoleculeData.annotations.go.length >0)
                            || ( biomoleculeData.annotations.keywords && biomoleculeData.annotations.keywords.length > 0))) {
                            setShowKeywords(true);
                        }
                    }
                });
        }
    }, []);

    const onExpressionLoad = () => {
        setShowExpressions(true);
    }

    const onInteractionLoad = () => {
        setShowInteractions(true);
    }

    const handleSearch = () => {
        // handle search logic
    };

    const theme = useTheme();

    return(
        <>{
            biomoleculeId &&
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
                                    {
                                        (
                                            <>
                                                <ListItem
                                                    key={'overview'}
                                                    sx={{ py: 0, px: 0, paddingLeft: "5px", paddingBottom: "12px" }}
                                                >
                                                    <ListItemButton
                                                        component="a"
                                                        href={`#${'overview'}`}
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
                                                      {'Overview'}
                                                    </span>
                                                    </ListItemButton>
                                                </ListItem>
                                                {
                                                    showInteractions && <ListItem
                                                        key={'interactions'}
                                                        sx={{ py: 0, px: 0, paddingLeft: "5px", paddingBottom: "12px" }}
                                                    >
                                                        <ListItemButton
                                                            component="a"
                                                            href={`#${'interactions'}`}
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
                                                          {'Interactions'}
                                                        </span>
                                                        </ListItemButton>
                                                    </ListItem>
                                                }
                                                {
                                                    showExpressions && <ListItem
                                                        key={'expression'}
                                                        sx={{ py: 0, px: 0, paddingLeft: "5px", paddingBottom: "12px" }}
                                                    >
                                                        <ListItemButton
                                                            component="a"
                                                            href={`#${'expressions'}`}
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
                                                          {'Expressions'}
                                                        </span>
                                                        </ListItemButton>
                                                    </ListItem>
                                                }
                                                {
                                                    showStrctures && <ListItem
                                                        key={'strcture'}
                                                        sx={{ py: 0, px: 0, paddingLeft: "5px", paddingBottom: "12px" }}
                                                    >
                                                        <ListItemButton
                                                            component="a"
                                                            href={`#${'structures'}`}
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
                                                          {'Structures'}
                                                        </span>
                                                        </ListItemButton>
                                                    </ListItem>
                                                }
                                                {
                                                    showKeywords && <ListItem
                                                        key={'keywords'}
                                                        sx={{ py: 0, px: 0, paddingLeft: "5px", paddingBottom: "12px" }}
                                                    >
                                                        <ListItemButton
                                                            component="a"
                                                            href={`#${'keywords'}`}
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
                                                          {'Keywords'}
                                                        </span>
                                                        </ListItemButton>
                                                    </ListItem>
                                                }
                                            </>
                                        )
                                    }
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
                                        <div style={{marginBottom: '10px'}}>
                                            <OverviewComponent
                                                biomoleculeId={biomoleculeId}
                                                biomolecule={biomolecule}
                                            />
                                        </div>
                                    }
                                    {
                                        biomoleculeId &&
                                        <div
                                            id='interactions'
                                            style={{marginBottom: '10px'
                                        }}>
                                            <AssociationsOverviewComponent
                                                biomoleculeId={biomoleculeId}
                                                onInteractionLoad={onInteractionLoad}
                                            />
                                        </div>
                                    }
                                    {
                                        (biomolecule && biomolecule.type === 'protein' ||
                                        biomolecule && biomolecule.type === 'pfrag' ||
                                        biomolecule && biomolecule.type === 'multimer' ) && biomoleculeId &&
                                        <div
                                            id='expressions'
                                            style={{marginBottom: '10px'}}>
                                            <ExpressionComponent
                                                biomolecule={biomolecule}
                                                onExpressionLoad={onExpressionLoad}
                                            />
                                        </div>
                                    }
                                    {
                                        biomolecule && biomolecule.xrefs && biomolecule.xrefs.pdb && biomolecule.xrefs.pdb.length > 0 &&
                                        <div
                                            id='structures'
                                            style={{marginBottom: '10px'}}>
                                            <StructureComponent
                                                pdb={biomolecule.xrefs.pdb}
                                            />
                                        </div>
                                    }
                                    {
                                        biomolecule && biomolecule.molecular_details && biomolecule.molecular_details.pdb && biomolecule.molecular_details.pdb.length > 0 &&
                                        <div
                                            id='structures'
                                            style={{marginBottom: '10px'}}>
                                            <StructureComponent
                                                pdb={biomolecule.molecular_details.pdb}
                                            />
                                        </div>
                                    }
                                    {
                                        (biomolecule && biomolecule.type !== 'gag' && biomolecule.annotations) &&
                                        ((biomolecule.annotations.go && biomolecule.annotations.go.length >0)
                                            || (biomolecule.annotations && biomolecule.annotations.keywords && biomolecule.annotations.keywords.length > 0)) &&
                                        <div
                                            id='keywords'
                                            style={{marginBottom: '10px'}}>
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