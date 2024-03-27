import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent, Container, Grid, IconButton,
    List,
    ListItem, ListItemIcon, ListItemText,
    Pagination, Paper, Tab, Tabs, Tooltip,
    Typography
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAtom, faBook} from "@fortawesome/free-solid-svg-icons";
import SpeciesIcon from "../commons/spceiesIcons/SpeciesIcon";

function ResultDetailsComponent(props: any) {

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState('biomolecules');

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }
    const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
        return (
            <div role="tabpanel" hidden={value !== index}>
                {value === index && <Box p={3}>{children}</Box>}
            </div>
        );
    };

    return(
        <>
        {

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '20px'
                }}>
                    <Tabs value={0} onChange={() => {}} centered>
                        {
                            <Tab
                                label="Biomolecules"
                                icon={<IconButton>
                                    <FontAwesomeIcon icon={faAtom} size={"2xs"}/>
                                </IconButton>}
                                iconPosition="start"
                                style={{ padding: '4px', margin: '0' }}
                            />
                        }
                        {
                            <Tab
                                label="Publications"
                                icon={<IconButton>
                                    <FontAwesomeIcon icon={faBook} size={"2xs"}/>
                                </IconButton>}
                                iconPosition="start"
                            />
                        }
                    </Tabs>
                </div>
        }
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '30%'
                }}>

                        {
                            props.searchResults &&
                            props.searchResults.slice((currentPage - 1) * 10, currentPage * 10).map((result: any) => {
                                return(
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            paddingBottom: '20px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'row'
                                            }}>
                                                <div style={{
                                                    width: '10%',
                                                    height: '10px',
                                                    paddingRight: '5px'
                                                }}>
                                                    <SpeciesIcon speciesId={'9606'} width={'20px'} height={'20px'}/>
                                                </div>
                                                <div style={{
                                                    width: '70%'
                                                }}>
                                                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                                                        <a href={process.env.REACT_APP_PUBLIC_URL + "biomolecule/" + result.biomolecule_id}>{result.name}</a>
                                                    </Typography>
                                                </div>
                                                <div style={{
                                                    width: '20%'
                                                }}>
                                                    <Typography sx={{ paddingLeft: '40px',fontSize: 14 }} color="text.primary" gutterBottom>
                                                        {result.interaction_count}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                            }}>
                                                <div style={{
                                                    width: '10%',
                                                    height: '10px',
                                                    paddingRight: '5px'
                                                }}>
                                                </div>
                                                {
                                                    result.name && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                        {result.biomolecule_id}
                                                    </Typography>
                                                }
                                                {
                                                    result.names && result.names.other_name
                                                    && !Array.isArray(result.names.other_name)
                                                    && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                        {result.names.other_name}
                                                    </Typography>
                                                }
                                                {
                                                    result.names && result.names.other_name
                                                    && Array.isArray(result.names.other_name)
                                                    && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                        {result.names.other_name[0]}
                                                    </Typography>
                                                }
                                            </div>
                                        </div>
                                );
                            })
                        }
                </div>
                {
                    props.searchResults && props.searchResults.length > 0 &&
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '20px'
                    }}>
                        <Pagination
                            count={Math.ceil(props.searchResults.length / 10)}
                            page={currentPage}
                            onChange={(event, page) => setCurrentPage(page)}
                            color="primary"
                        />
                    </div>
                }
            </div>
        </>
    )
}

interface TruncatedListItemTextProps {
    text: string;
    url: string;
    length: number
}
const TruncatedListItemText: React.FC<TruncatedListItemTextProps> = ({ text, url,length }) => {
    const truncatedText = text.length > length ? `${text.substring(0, length)}...` : text;

    return (
        <Tooltip title={text.length > 80 ? text : ''} arrow>
            <Typography variant="body2" noWrap>
                {text.length > 80 ? (
                    <a href={url} target="_blank">
                        {truncatedText}
                    </a>
                ) : (
                    <a href={url} target="_blank">
                        {truncatedText}
                    </a>
                )}
            </Typography>
        </Tooltip>
    );
};

function ResultComponent(props : any) {

    const [expandBiomolecules, setExpandBiomolecules] = useState<boolean>(false);
    const [expandPublications, setExpandPublications] = useState<boolean>(false);

    const truncateText = (text : string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    const showExpanded = () => expandBiomolecules || expandPublications;

    return (
        <>
            {
                !showExpanded() && <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '30px'}}>
                        <div style={{ padding: '10px', textAlign: 'center', width: '50%', marginBottom: '20px', paddingLeft: '100px', paddingRight: '100px' }}>
                            {props.searchResults.biomolecules && props.searchResults.biomolecules.length > 0 &&
                                <>
                                    <div style={{ textAlign: 'left', marginBottom: '20px'}}>
                                        <div style={{
                                            background: 'rgb(225, 235, 252)',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'left',
                                            paddingLeft: '20px'
                                        }}>
                                            <Typography style={{fontWeight: 'bold', color: 'darkblue' }}>
                                                Biomolecules
                                            </Typography>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <List>
                                                {props.searchResults.biomolecules.slice(0,5).map((result: any, index: number) => (
                                                    <ListItem key={index}>
                                                        <Typography>
                                                            <div key={index} style={{ display: 'flex', width: '400px', marginBottom: '10px' }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <a href={`/biomolecule/${result.biomolecule_id}`} color="inherit">
                                                                        {result.name}
                                                                    </a>
                                                                </div>
                                                                <div style={{ flex: 1 }}>
                                                                    <Typography variant="caption">
                                                                        <strong>{result.interaction_count}</strong>
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Typography variant="body2">
                                                                    {result.biomolecule_id}
                                                                </Typography>
                                                            </div>
                                                        </Typography>
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <List>
                                                {props.searchResults.biomolecules &&
                                                    props.searchResults.biomolecules.slice(5,10).map((result: any, index: number) => (
                                                        <ListItem key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography>
                                                                <div key={index} style={{ display: 'flex', width: '400px', marginBottom: '10px' }}>
                                                                    <div style={{ flex: 1 }}>
                                                                        <a href={`/biomolecule/${result.biomolecule_id}`} color="inherit">
                                                                            {result.name}
                                                                        </a>
                                                                    </div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <Typography variant="caption">
                                                                            <strong>{result.interaction_count}</strong>
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <Typography variant="body2">
                                                                        {result.biomolecule_id}
                                                                    </Typography>
                                                                </div>
                                                            </Typography>
                                                        </ListItem>
                                                    ))}
                                            </List>
                                        </div>
                                        <div style={{
                                            alignItems: 'right',
                                            textAlign: 'right'
                                        }}>
                                    <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setExpandBiomolecules(true)}>
                                        See more ...
                                    </span>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                        <div style={{ padding: '10px', textAlign: 'center', width: '50%', marginBottom: '20px' }}>
                            {props.searchResults.publications && props.searchResults.publications.length > 0 &&
                                <>
                                    <div style={{ textAlign: 'left', marginBottom: '20px'}}>
                                        <div style={{
                                            background: 'rgb(225, 235, 252)',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'left',
                                            paddingLeft: '20px'
                                        }}>
                                            <Typography style={{fontWeight: 'bold', color: 'darkblue' }}>
                                                Publications
                                            </Typography>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <List>
                                                {props.searchResults.publications &&
                                                    props.searchResults.publications.slice(0,5).map((result: any, index: number) => (
                                                        <ListItem key={index}>
                                                            <Typography>
                                                                <div key={index} style={{
                                                                    display: 'flex',
                                                                    width: '400px',
                                                                    marginBottom: '10px',
                                                                    justifyContent: 'space-between'
                                                                }}>
                                                                    <div style={{ flex: 1 }}>
                                                                        <TruncatedListItemText
                                                                            text={result.title[0]}
                                                                            url={`/publication/${result.publication_id}`}
                                                                            length={40}
                                                                        />
                                                                    </div>
                                                                    <div style={{
                                                                        flex: 0,
                                                                        paddingRight: '10px'
                                                                    }}>
                                                                        <Typography variant="caption">
                                                                            <strong>{result.interaction_count}</strong>
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <Typography variant="body2">
                                                                        {result.abstract && truncateText(result.abstract[0], 100)}
                                                                    </Typography>
                                                                </div>
                                                            </Typography>
                                                        </ListItem>
                                                    ))}
                                            </List>
                                            <List>
                                                {props.searchResults.publications &&
                                                    props.searchResults.publications.slice(5,10).map((result: any, index: number) => (
                                                        <ListItem key={index}>
                                                            <Typography>
                                                                <div key={index} style={{
                                                                    display: 'flex',
                                                                    width: '400px',
                                                                    marginBottom: '10px',
                                                                    justifyContent: 'space-between'
                                                                }}>
                                                                    <div style={{ flex: 1 }}>
                                                                        <TruncatedListItemText
                                                                            text={result.title[0]}
                                                                            url={`/publication/${result.publication_id}`}
                                                                            length={40}
                                                                        />
                                                                    </div>
                                                                    <div style={{ flex: 0 }}>
                                                                        <Typography variant="caption">
                                                                            <strong>{result.interaction_count}</strong>
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <Typography variant="body2">
                                                                        {result.abstract && truncateText(result.abstract[0], 80)}
                                                                    </Typography>
                                                                </div>
                                                            </Typography>
                                                        </ListItem>
                                                    ))}
                                            </List>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>

                        {/*<div style={{ padding: '10px', textAlign: 'center', width: '60%', paddingLeft: '20px', paddingRight: '20px' }}>
                    <Typography variant="h6">Publications</Typography>
                    <div style={{paddingLeft: '100px', paddingRight: '100px' }}>
                        <List>
                            {props.searchResults.publications &&
                                props.searchResults.publications.slice(0,5).map((result: any, index: number) => (
                                    <ListItem key={index}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>

                                            <div style={{ marginLeft: '10px' }}>
                                                <TruncatedListItemText text={result.title[0]} url={`/details/${result.publication_id}`}/>

                                                <Typography variant="body2">
                                                    {result.abstract && truncateText(result.abstract[0], 200)}
                                                </Typography>
                                            </div>
                                        </div>

                                    </ListItem>
                                ))}
                        </List>
                    </div>
                </div>*/}
                    </div>
                </>
            }
            {
                showExpanded() && <ResultDetailsComponent searchResults={props.searchResults.biomolecules}/>
            }
        </>
    );
}

export default ResultComponent;
