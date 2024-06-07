import {Grid, Paper, Typography} from "@mui/material";
import InfiniteScrollingList from "../commons/lists/InfinteScrollingList";
import BiomoleculeFilter from "./biomolecule-filter/BiomoleculeFilter";
import React, {useEffect, useState} from "react";
import NetworkParticipantBoard from "./NetworkParticipantBoardComponent";
import BiomoleculeCard from "../commons/cards/BiomoleculeCards";

const BiomoleculeSelectionComponent: React.FC<any> = (props: any)  => {

    const [selectedBiomolecules, setSelectedBiomolecules] = useState<any[]>([]);
    const [filteredBiomolecules, setFilteredBiomolecules] = useState<any[] | null>(null);
    const [filterCriteria, setFilterCriteria] = useState<any>(null);

    useEffect(() => {
        setFilteredBiomolecules(props.biomolecules);
    }, [props.biomolecules]);

    useEffect(() => {
        setSelectedBiomolecules(props.selectedBiomolecules);
    }, [props.selectedBiomolecules]);

    useEffect(() => {
        if(!props.biomolecules) return;
        if(!filterCriteria) return;

        // Filter the biomolecules
        let filteredBiomolecules = props.biomolecules.filter((biomolecule: any) => {
            if(filterCriteria.type === 'species') {
                return biomolecule.species === filterCriteria.value;
            } else if(filterCriteria.type === 'goTerms') {
                return biomolecule?.go_names?.includes(filterCriteria.value);
            }
            return false;
        });
        if(filteredBiomolecules.length === 0 || !filteredBiomolecules) filteredBiomolecules = [];
        setFilteredBiomolecules(filteredBiomolecules);
    }, [filterCriteria]);

    const onBimoleculeAdd = (biomolecule: any) => {
        let newSelectedBiomolecules = [...selectedBiomolecules, biomolecule];
        setSelectedBiomolecules(newSelectedBiomolecules);
        props.onSelectionChange(newSelectedBiomolecules);
    }

    const onBiomoleculeRemove = (biomoleculeToRemove: any) => {
        let newSelectedBiomolecules = selectedBiomolecules
            .filter((biomolecule: any) => biomolecule.biomolecule_id !== biomoleculeToRemove.biomolecule_id);
        props.onSelectionChange(newSelectedBiomolecules);
    }

    const onGenerateNetwork = (onlyDirectPartners: boolean) => {
        props.onGenerateNetwork(onlyDirectPartners);
    }

    return(
        <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0'
        }}>
            <Grid
                container
                spacing={0}
                sx={{
                    width: '100%'
                }}
            >
                {
                    <Grid item xs={12} md={3} sm={3}>
                        <div style={{
                            overflow: 'auto'
                        }}>
                            {
                                selectedBiomolecules &&
                                <NetworkParticipantBoard
                                    participants={selectedBiomolecules}
                                    onClear={() => setSelectedBiomolecules([])}
                                    onBiomoleculeRemove={onBiomoleculeRemove}
                                    onGenerate={onGenerateNetwork}
                                />
                            }
                        </div>
                    </Grid>
                }
                {
                    <Grid item xs={12} md={6} sm={6}>
                        {
                            props.biomolecules && props.biomolecules.length > 0 &&
                            <>
                                <div
                                    style={{
                                        background: "#e0e7f2",
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingTop: '5px',
                                        paddingLeft: '5px'
                                    }}
                                >
                                    <Typography style={{
                                        fontWeight: 'bold',
                                        color: 'darkblue'
                                    }} variant="body2">
                                        Biomolecules ({ props.biomolecules.length })
                                    </Typography>
                                </div>
                                <Paper
                                    style={{
                                        textAlign: 'center',
                                        marginBottom: '20px',
                                        height: '400px',
                                        borderRadius: '0em',
                                        overflow: 'auto'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-around'
                                        }}
                                    >
                                        {/*
                                            <List>
                                                {biomolecules.slice(0,5).map((result: any, index: number) => (
                                                    <ListItem key={index} style={{
                                                        paddingBottom: '20px'
                                                    }}>
                                                        <Typography>
                                                            <div key={index} style={{
                                                                display: 'flex',
                                                                marginBottom: '10px',
                                                                width: '400px'
                                                            }}>
                                                                {result.species && (
                                                                    <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                        <SpeciesIcon
                                                                            speciesId={result.species}
                                                                            width={'20px'}
                                                                            height={'20px'}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {!result.species && (
                                                                    <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                        <SpeciesIcon
                                                                            speciesId={'-1'}
                                                                            width={'15px'}
                                                                            height={'15px'}
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div style={{ flex: '60%' }}>
                                                                    <a href={`/biomolecule/${result.biomolecule_id}`} color="inherit">
                                                                        {displayName(result)}
                                                                    </a>
                                                                </div>
                                                                <div style={{ flex: '20%' }}>
                                                                    <Typography variant="caption">
                                                                        <strong>{result.interaction_count}</strong>
                                                                    </Typography>
                                                                </div>
                                                                <div style={{ flex: '10%', paddingRight: '5px' }}>
                                                                    <IconButton style={{color: 'green'}} aria-label="Add">
                                                                        <AddIcon/>
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'row'}}>
                                                                {
                                                                    result.biomolecule_type !== 'protein' &&
                                                                    <>
                                                                        <LogoIcon logoName={'matrixdb'} width={'15'} height={'15'}/>
                                                                        <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}} variant="body2">
                                                                            {result.biomolecule_id}
                                                                        </Typography>
                                                                    </>
                                                                }
                                                                {
                                                                    result.biomolecule_type === 'protein' &&
                                                                    <>
                                                                        <LogoIcon logoName={'uniprot'} width={'15'} height={'15'}/>
                                                                        <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                            {result.biomolecule_id}
                                                                        </Typography>
                                                                        {
                                                                            result.gene &&
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                Gene: {result.gene}
                                                                            </Typography>
                                                                        }
                                                                    </>
                                                                }
                                                                {
                                                                    result.chebi &&
                                                                    <>
                                                                        <LogoIcon logoName={'chebi'} width={'15'} height={'15'}/>
                                                                        <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                            {result.chebi}
                                                                        </Typography>
                                                                    </>
                                                                }
                                                                {
                                                                    result.complex_portal &&
                                                                    <>
                                                                        <LogoIcon logoName={'complex-portal'} width={'15'} height={'15'}/>
                                                                        <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                            {result.complex_portal}
                                                                        </Typography>
                                                                    </>
                                                                }
                                                            </div>
                                                        </Typography>
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <List>
                                                {biomolecules.slice(5,10).map((result: any, index: number) => (
                                                        <ListItem key={index} style={{ paddingBottom: '20px' }}>
                                                            <Typography>
                                                                <div key={index} style={{
                                                                    display: 'flex',
                                                                    width: '400px',
                                                                    marginBottom: '10px'
                                                                }}>
                                                                    {result.species && (
                                                                        <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                            <SpeciesIcon
                                                                                speciesId={result.species}
                                                                                width={'20px'}
                                                                                height={'20px'}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    {!result.species && (
                                                                        <div style={{ flex: '10%', paddingRight: '10px' }}>
                                                                            <SpeciesIcon
                                                                                speciesId={'-1'}
                                                                                width={'15px'}
                                                                                height={'15px'}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div style={{ flex: '70%' }}>
                                                                        <a href={`/biomolecule/${result.biomolecule_id}`} color="inherit">
                                                                            {displayName(result)}
                                                                        </a>
                                                                    </div>
                                                                    <div style={{ flex: '20%' }}>
                                                                        <Typography variant="caption">
                                                                            <strong>{result.interaction_count}</strong>
                                                                        </Typography>
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', flexDirection: 'row'}}>
                                                                    {
                                                                        result.biomolecule_type !== 'protein' &&
                                                                        <>
                                                                            <LogoIcon logoName={'matrixdb'} width={'15'} height={'15'}/>
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}} variant="body2">
                                                                                {result.biomolecule_id}
                                                                            </Typography>
                                                                        </>
                                                                    }
                                                                    {
                                                                        result.biomolecule_type === 'protein' &&
                                                                        <>
                                                                            <LogoIcon logoName={'uniprot'} width={'15'} height={'15'}/>
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                {result.biomolecule_id}
                                                                            </Typography>
                                                                            {
                                                                                result.gene &&
                                                                                <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                    Gene: {result.gene}
                                                                                </Typography>
                                                                            }
                                                                        </>
                                                                    }
                                                                    {
                                                                        result.chebi &&
                                                                        <>
                                                                            <LogoIcon logoName={'chebi'} width={'15'} height={'15'}/>
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                {result.chebi}
                                                                            </Typography>
                                                                        </>
                                                                    }
                                                                    {
                                                                        result.complex_portal &&
                                                                        <>
                                                                            <LogoIcon logoName={'complex-portal'} width={'15'} height={'15'}/>
                                                                            <Typography style={{paddingLeft: '5px', paddingRight: '5px', fontSize: '12px'}}  variant="body2">
                                                                                {result.complex_portal}
                                                                            </Typography>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </Typography>
                                                        </ListItem>
                                                    ))}
                                            </List>
                                            */}

                                        {filteredBiomolecules &&
                                            <InfiniteScrollingList listItems={props.biomolecules}>
                                                {
                                                    filteredBiomolecules.map((biomolecule) => {
                                                            let selectedIds = selectedBiomolecules.map(
                                                                (biomolecule: any) => biomolecule.biomolecule_id);
                                                            return (
                                                                <BiomoleculeCard
                                                                    biomolecule={biomolecule}
                                                                    onBiomoleculeAdd={onBimoleculeAdd}
                                                                    onBiomoleculeRemove={onBiomoleculeRemove}
                                                                    cardType="normal"
                                                                    selected={selectedIds.includes(biomolecule.biomolecule_id)}
                                                                />
                                                            );
                                                        }
                                                    )}
                                            </InfiniteScrollingList>
                                        }
                                    </div>
                                </Paper>
                            </>
                        }
                    </Grid>
                }
                {
                    <Grid item xs={12} md={3} sm={3}>
                        <div style={{
                            overflow: 'auto'
                        }}>
                            {
                                props.searchQuery && props.biomolecules && props.biomolecules.length > 0 &&
                                <BiomoleculeFilter
                                    searchQuery={props.searchQuery}
                                    biomolecules={props.biomolecules}
                                    onFilterSelection={(filterCriteria: any) => setFilterCriteria(filterCriteria)}
                                />
                            }
                        </div>
                    </Grid>

                }
            </Grid>
        </div>
    )
}

export default BiomoleculeSelectionComponent;