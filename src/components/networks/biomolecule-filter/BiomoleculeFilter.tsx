import {SimpleTreeView} from "@mui/x-tree-view/SimpleTreeView";
import {TreeItem} from "@mui/x-tree-view/TreeItem";
import {Box, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {faCircleNodes, faFilter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface BiomoleculeFilterProps {
    searchQuery: string;
    biomolecules: any;
    onFilterSelection: (filterCriteria: any) => void;
}

function BiomoleculeFilter(props: BiomoleculeFilterProps) {

    const {searchQuery, biomolecules, onFilterSelection} = props;
    const [filter, setFilter] = useState<Map<string, any>
        | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Group by the different categories
        // Proteins
        // - species
        // - go terms
        // - uniprot keywords
        // Pfrag
        // - species
        // Multimer
        // - species
        // - go terms
        let filter: Map<string, any> = new Map<string, any>();
        biomolecules.forEach((biomolecule: any) => {
            let type = biomolecule.biomolecule_type;

            // set/update type
            if(!filter.has(type)) {
                filter.set(type, {
                    count: 0,
                    species: {},
                    goTerms: {},
                    keywords: {}
                });
            }
            let currentType = filter.get(type);
            currentType.count += 1;

            let species = biomolecule?.species;
            if(species) {
                if(!(species in currentType.species)) {
                    currentType.species[species] = 0;
                }
                currentType.species[species] += 1;
            }

            let goTerms = biomolecule?.go_names;
            if(goTerms) {
                goTerms.split(';').forEach((goTerm: string) => {
                    if(goTerm.toLowerCase().includes(searchQuery.toLowerCase())) {
                        if(!(goTerm in currentType.goTerms)) {
                            currentType.goTerms[goTerm] = 0;
                        }
                        currentType.goTerms[goTerm] += 1;
                    }
                });
            }
        });
        setFilter(filter);

    }, [props.searchQuery, props.biomolecules]);

    return(
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
                    Filters
                </Typography>
            </div>
            <Box sx={{
                height: 264,
                flexGrow: 1,
                maxWidth: 400
            }}>
                {
                    filter &&
                    <SimpleTreeView>
                        {
                            Array.from(filter.keys()).map((key: string) => (
                                <TreeItem key={key} itemId={key} label={key}>
                                    {
                                        Object.keys(filter.get(key)).map((subKey: any) => {
                                            if (subKey !== "count") {
                                                return (
                                                    <TreeItem
                                                        key={subKey}
                                                        itemId={subKey}
                                                        label={subKey}
                                                    >
                                                        {
                                                            Object.keys(filter.get(key)[subKey]).map((nestedKey: any) => (
                                                                <TreeItem
                                                                    key={nestedKey}
                                                                    itemId={`${key}_${nestedKey}_${subKey}`}
                                                                    label={`${nestedKey} (${filter.get(key)[subKey][nestedKey]})`}
                                                                    onClick={() => onFilterSelection({
                                                                        type: subKey,
                                                                        value: nestedKey
                                                                    })}
                                                                />
                                                            ))
                                                        }
                                                    </TreeItem>
                                                );
                                            } else {
                                                return null; // Returning null to avoid rendering an empty element
                                            }
                                        })
                                    }
                                </TreeItem>
                            ))
                        }
                    </SimpleTreeView>
                }
            </Box>
        </>
    );
}

export default BiomoleculeFilter;