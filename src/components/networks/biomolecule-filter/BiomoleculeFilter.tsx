import {SimpleTreeView} from "@mui/x-tree-view/SimpleTreeView";
import {TreeItem} from "@mui/x-tree-view/TreeItem";
import {Box, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import http from "../../../commons/http-commons";

interface BiomoleculeFilterProps {
    searchQuery: string;
    biomolecules: any;
    onFilterSelection: (filterCriteria: any) => void;
}

function BiomoleculeFilter(props: BiomoleculeFilterProps) {

    const {searchQuery, biomolecules, onFilterSelection} = props;
    const [filter, setFilter] = useState<Map<string, any>
        | null>(null);
    const [ncbiTaxonomy, setncbiTaxonomy] = useState<any | null>(null);

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

    useEffect(() => {
        if(!ncbiTaxonomy) {
            http.get("/metadata/ncbi")
                .then((ncbiResponse: any) => {
                    interface NcbiData {
                        commonName: string;
                        name: string;
                    }
                    let ncbiMap: { [key: string]: NcbiData } = {};

                    if(ncbiResponse.data.ncbi) {
                        Object.keys(ncbiResponse.data.ncbi).forEach((ncbiId: any) => {
                            ncbiMap[ncbiId] = {
                                commonName : ncbiResponse.data.ncbi[ncbiId].common_name,
                                name: ncbiResponse.data.ncbi[ncbiId].name
                            }
                        });
                        setncbiTaxonomy(ncbiMap);
                    }
                });
        }
    }, []);

    return(
        <>
            <div
                style={{
                    background: "#e0e7f2",
                    height: '70px',
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
                    filter && ncbiTaxonomy &&
                    <SimpleTreeView>
                        {
                            Array.from(filter.keys()).map((key: string) => (
                                <TreeItem
                                    key={key}
                                    itemId={key}
                                    label={key}
                                    onClick={() => onFilterSelection({
                                        type: 'biomolecule',
                                        value: key
                                    })}
                                >
                                    {
                                        Object.keys(filter.get(key)).map((subKey: any) => {
                                            if (subKey !== "count" && Object.keys(filter.get(key)[subKey]).length > 0) {
                                                return (
                                                    <TreeItem
                                                        key={`${key}_${subKey}`}
                                                        itemId={`${key}_${subKey}`}
                                                        label={subKey}
                                                    >
                                                        {
                                                            Object.keys(filter.get(key)[subKey]).map((nestedKey: any) => {
                                                                let label = nestedKey;
                                                                if(subKey === 'species') {
                                                                    label = ncbiTaxonomy[nestedKey] ? ncbiTaxonomy[nestedKey].name : nestedKey;
                                                                }
                                                                return (
                                                                    <TreeItem
                                                                        key={`${key}_${subKey}_${nestedKey}`}
                                                                        itemId={`${key}_${subKey}_${nestedKey}`}
                                                                        label={label}
                                                                        onClick={() => onFilterSelection({
                                                                            type: subKey,
                                                                            value: nestedKey
                                                                        })}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </TreeItem>
                                                );
                                            } else {
                                                return null;
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