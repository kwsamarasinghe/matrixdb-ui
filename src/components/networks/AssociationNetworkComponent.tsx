import {useEffect, useState, useRef} from "react";
import http from "../../commons/http-commons";
import cytoscape from "cytoscape";
import {
    Card,
    CardContent,
    Typography,
    Autocomplete,
    TextField,
    Grid,
    Button,
    IconButton,
    InputLabel, Slider,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from '@fortawesome/free-solid-svg-icons';


interface Filter {
    type : string,
    subCriteria: {
        property: string,
        value: string
    }[],
    active: boolean
}

const filterAssociations = ((biomoleculeId: any, associations: any, participants: any, filters: Array<Filter>) => {

    // Filters partners with the filter criteria
    let filteredAssociations = new Array<any>();
    const participantMap = new Map<string, any>();
    for (const participant of participants) {
        if (participant.geneExpression) {
            participant["expressedIn"] = new Array<any>();
            participant.geneExpression.forEach((expression: any) => {
                participant["expressedIn"].push(expression.tissueUberonName);
            });
        }
        participantMap.set(participant.id, participant);
    }
    if (filters) {
        // take the last filter criteria and apply it
        let lastFilter = filters[filters.length - 1];
        if(lastFilter.subCriteria && lastFilter.subCriteria.length > 0) {
            if (lastFilter.type === 'interactor') {
                // Apply the last sub criteria
                    associations.forEach((association: any) => {
                        // Get the partner
                        const partnerId = association.participants.find((participant: any) =>
                            participant !== biomoleculeId);
                        if(partnerId) {
                            const partner = participantMap.get(partnerId);
                            let subCriteria = lastFilter.subCriteria[lastFilter.subCriteria.length - 1 ];
                            if(subCriteria) {
                                if (Array.isArray(partner[subCriteria.property])) {
                                    if (partner[subCriteria.property].includes(subCriteria.value)) {
                                        filteredAssociations.push(association);
                                    }
                                } else {
                                    if (partner && partner[subCriteria.property] === subCriteria.value) {
                                        filteredAssociations.push(association);
                                    }
                                }
                            }
                        }
                    });
            } else if (lastFilter.type === 'interaction') {
                associations.forEach((association: any) => {
                    let subCriteria = lastFilter.subCriteria[lastFilter.subCriteria.length - 1 ];
                    if(subCriteria) {
                       // if(association)
                    }
                });
            }
        } else {
            filteredAssociations = associations;
        }
    }

    return filteredAssociations;
});

function PartnerOverview(props: any) {

    const [partner, setPartner] = useState<any>(null);

    useEffect(() => {
        if (props && props.partnerId) {
            http.get("/biomolecules/" + props.partnerId)
                .then((biomoleculeResponse) => {
                    setPartner(biomoleculeResponse.data);
                });
        }
    }, [props.partnerId]);

    if (partner) {
        return (
            <Card style={{width: '220px'}}>
                <CardContent>
                    <Typography variant="body2" gutterBottom>
                        <a href={"/biomolecule/" + partner.id}>{partner.names && partner.names.name || partner.id}</a>
                    </Typography>
                    <Typography color="textSecondary">
                        {partner.type}
                    </Typography>
                    <Typography color="textSecondary">
                        {partner.ecm}
                    </Typography>
                </CardContent>
            </Card>
        );
    } else {
        return <></>
    }
}

function AssociationOverview(props: any) {

    const [association, setAssociation] = useState<any>(null);

    useEffect(() => {
        setAssociation(props.interaction);
    }, [props.interaction])

    if (association) {
        return (
            <Card style={{width: '220px'}}>
                <CardContent>
                    <Typography variant="body2" gutterBottom>
                        <a href={"/association/" + association.id}>
                            {association.id && association.id}
                        </a>
                    </Typography>
                    {
                        association.experiments.map((experiment: any) => {
                            return (
                                <div style={{wordWrap: 'break-word'}}>
                                    <Typography variant="caption" color="textSecondary">
                                        <strong>Experiments:</strong> {experiment}
                                    </Typography>
                                </div>
                            );
                        })
                    }
                    <div style={{wordWrap: 'break-word'}}>
                        <Typography variant="caption" color="textSecondary">
                            <strong>Pubmed Id:</strong> {association.pubmed}
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        );
    } else {
        return <></>
    }
}

function FilterComponent(props: any) {

    const [filteredAssociations, setFilteredAssociations] = useState<any>();
    const [participants, setParticipants] = useState<Array<any>>([]);
    const [experiments, setExperiments] = useState<any>([]);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [filterOptions, setFilterOptions] = useState<any>();

    useEffect(() => {
        setFilteredAssociations(props.associations);

        // Extracts the experiments and fetch experiemnts
        let experimentIds = new Set();
        if(props.associations.length > 0 && experiments.length === 0) {
            props.associations.forEach((association: any) => {
                association.experiments.forEach((experimentId: string) =>
                    experimentIds.add(experimentId))
                }
            );

            http.post("/experiments/", {
                ids: [...experimentIds]
            })
            .then((experimentResponse) => {
                setExperiments(experimentResponse.data.experiments);
            });
        }

    }, [props.associations]);

    useEffect(() => {
        if(props.participants) {
            setParticipants(props.participants);
        }
    }, [props.participants])

    useEffect(() => {
        if(experiments.length > 0 ) {
            filteredAssociations.forEach((filteredAssociation: any) => {
               let experiment = experiments.filter((experiment: any) => {
                   experiment.directly_supports.includes(filteredAssociation.id);
               });
               if(experiment) {
                   filteredAssociation.detectionMethod = experiment.interaction_detection_method;
               }
            });
        }
    },[experiments]);

    useEffect(() => {
        // Derive the filter options
        // id, type
        if (filteredAssociations) {
            // For interactors
            let interactorIds = new Set();
            let interactorTypes = new Set();
            let expressionTissues = new Set();
            let detectionMethods = new Set();

            filteredAssociations.forEach((association: any) => {
                association.participants.forEach((participantId: any) => {
                    interactorIds.add(participantId);
                    let participant = participants.find((participant: any) => participant.id === participantId);
                    interactorTypes.add(participant.type);

                    // Expression tissues
                    if (participant.geneExpression) {
                        participant.geneExpression.forEach((expression: any) => expressionTissues.add(expression.tissueUberonName));
                    }
                });
            });

            // Experiment detection method
            if(experiments && experiments.length > 0) {
                experiments.forEach((experiment: any) => {
                    detectionMethods.add(experiment.interaction_detection_method);
                });
            }

            setFilterOptions({
                interactor: {
                    type: {
                        values: [...interactorTypes],
                        conjugation: ['OR']
                    },
                    ecm: {
                        values: ["ECM", "Non-ECM"]
                    },
                    expressedIn: {
                        values: [...expressionTissues],
                        subProperties: {
                            score: {
                                type: 'numeric',
                                min: 0,
                                max: 100
                            }
                        },
                        conjugation: ['OR','AND'],
                        condition: {
                            on: 'type',
                            value: 'protein'
                        }
                    }
                },
                interaction: {
                    detectionMethod: {
                        values: [...detectionMethods]
                    },
                }
            });
        }
    }, [filteredAssociations, experiments]);

    useEffect(() => {
        // Derives the filter options from associations
        if (filteredAssociations) {

        }

        // Apply the filters
    }, [filters]);

    const onFilterAdd = ((filter: any, editing: boolean) => {
        // By definition only two filters are supported, interactor and interaction
        if(filters && filter.length > 0 &&
            ["interactor", "interaction"].every((type: string) => filter.some((filter: any) => filter.type === type))) {
            return;
        }

        // Need to pop the last filter and if it is not the same type add new filter
        // or add a criteria to the existing
        if(filters.length > 0) {
            let lastFilter = filters[filters.length - 1];
            if(lastFilter.type === filter.type) {
                if(editing) {
                    let lastSubCriteria = lastFilter.subCriteria[lastFilter.subCriteria.length - 1];
                    lastSubCriteria.property = filter.property;
                    lastSubCriteria.value = filter.value;
                } else {
                    lastFilter.subCriteria.push({
                        property: filter.property,
                        value: filter.value
                    });
                }
            } else {
                let newFilter : Filter = {
                    type: filter.type,
                    active: true,
                    subCriteria: []
                };
                if(filter.property && filter.value) {
                    newFilter.subCriteria.push({
                        property: filter.property,
                        value: filter.value
                    });
                }
                filters.push(newFilter);
                lastFilter.active = false;
            }
        } else {
            let newFilter : Filter = {
                type: filter.type,
                active: true,
                subCriteria: []
            };
            if(filter.property && filter.value) {
                newFilter.subCriteria.push({
                    property: filter.property,
                    value: filter.value
                });
            }
            setFilters([newFilter]);
        }

        props.onFilterAdd(filters, editing);
    });

    const onFilterDelete = (() => {
       // It is by construction, only last filter to be deleted
        if(filters.length > 0) {
            // Should remove the last criteria of the last filter
            // If no filter sub criteria in the only filter, remove it
            const lastFilter = filters[filters.length - 1]

            if(filters.length === 1) {
                if(lastFilter.subCriteria.length === 1) {
                    setFilters([]);
                    props.onFilterDelete([]);
                    return;
                }
            }

            let filterSubCriteria = lastFilter.subCriteria;
            if(filterSubCriteria && filterSubCriteria.length > 0 ) {
                lastFilter.subCriteria = filterSubCriteria.slice(0,-1);
                if(lastFilter.subCriteria.length === 0) {
                    filters.pop();
                    filters[filters.length - 1].active = true;
                }
                setFilters([...filters]);
                props.onFilterDelete(filters);
            }
        }
    });

    const getNextFilterType = () => {
        if(filters.length > 0) {
            let lastFilter = filters[filters.length - 1];
            let nextFilter = ['interactor', 'interaction'].filter((type: string) => type !== lastFilter.type);
            return nextFilter[0];
        }
    };

    const shouldShowNext = () => {
        if(filters.length === 0) {
            return true;
        } else if(filters.length === 2) {
            return false;
        } else {
            return filters && filters.some((filter: any) => filter.type && filter.subCriteria.length > 0);
        }
    };

    function FilterSubCriteria(props: any) {
        const [editable, setEditable] = useState(true);
        const [showEditing, setShowEditing] = useState(false);
        const [editing, setEditing] = useState(false);
        const [subPropertyEditing, setSubPropertyEditing] = useState(false);
        const [property, setProperty] = useState<string | null>(null);
        const [value, setValue] = useState<string | null>(null);
        const [filterType, setFilterType] = useState<string>();

        useEffect(() => {
            if(props.editable) {
                setEditable(true);
            } else {
                setEditable(false);
            }
        }, [props.editable]);

        useEffect(() => {
            setShowEditing(props.showEditing);
        }, [props.showEditing]);

        useEffect(() => {
            setFilterType(props.filterType);
        }, [props.filterType]);

        useEffect(() => {
            setProperty(props.property);
        }, [props.property]);

        useEffect(() => {
            setValue(props.value);
        }, [props.value]);

        const onFilterAdd = ((editing: boolean) => {
            props.onFilterAdd({
                type: filterType,
                property: property,
                value: value
            }, editing);
            setShowEditing(true);
        });

        const onFilterEdit = () => {
            setShowEditing(false);
            setEditable(true);
            setEditing(true);
        }

        const onExpressionValueChange = ((event : any, newValue : any) => {
            //setSliderValue(newValue);
        });

        return(
            <>
                {
                    <>
                        <div style={{display: 'flex', paddingTop: '8px'}}>
                            {
                                editable && filterType !== undefined && props.filterOptions &&
                                <div style={{width: '40%', marginRight: '10px'}}>
                                    {
                                            <Autocomplete
                                                size={"small"}
                                                id="property"
                                                options={Object.keys(props.filterOptions[filterType]) || []}
                                                value={property}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Property"
                                                        variant="outlined"
                                                    />
                                                )}
                                                onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => {
                                                    setProperty(newValue);
                                                }}
                                            />
                                    }
                                </div>
                            }
                            {
                                props.property && !editable &&
                                <div style={{width: '40%',  marginRight: '10px'}}>
                                    <InputLabel style={{
                                        border: '1px solid orange',
                                        padding: '5px',
                                        textAlign: 'center',
                                        color: 'orange',
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        textTransform: 'capitalize'
                                    }}>{props.property}</InputLabel>
                                </div>
                            }
                            {
                                editable && property  && filterType !== undefined && props.filterOptions[filterType][property] &&
                                    <div style={{width: '40%',  marginRight: '10px'}}>
                                        {
                                            <Autocomplete
                                                size={"small"}
                                                id="value"
                                                options={props.filterOptions[filterType][property].values|| []}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Value"
                                                        variant="outlined"
                                                    />
                                                )}
                                                onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => {
                                                    setValue(newValue);
                                                }}
                                            />
                                        }
                                    </div>
                            }
                            {
                                props.value && !editable &&
                                <div style={{width: '40%', marginRight: '10px'}}>
                                    <InputLabel style={{
                                        border: '1px solid blue',
                                        padding: '5px',
                                        textAlign: 'center',
                                        color: 'blue',
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        textTransform: 'capitalize'
                                    }}>{props.value}
                                    </InputLabel>
                                </div>
                            }
                            {
                                property && value && editable &&
                                    <div style={{flex: '1' , marginRight: '4px', width: '3px'}}>
                                        <IconButton style={{color: 'green'}} aria-label="Add">
                                            <CheckIcon onClick={() =>onFilterAdd(editing)}/>
                                        </IconButton>
                                    </div>
                            }
                            {
                                property && value && showEditing &&
                                    <>
                                        <div style={{flex: '1' , marginRight: '4px', width: '3px'}}>
                                            <IconButton style={{color: 'orange'}} size={'small'} aria-label="Remove">
                                                <EditIcon onClick={onFilterEdit}/>
                                            </IconButton>
                                        </div>
                                        <div style={{flex: '1' , marginRight: '4px', width: '3px'}}>
                                            <IconButton style={{color: 'red'}} size={'small'} aria-label="Remove">
                                                <DeleteIcon onClick={props.onFilterDelete}/>
                                            </IconButton>
                                        </div>
                                    </>
                            }
                            {
                                editable && <div style={{flex: '1' , marginRight: '4px', width: '3px'}}>
                                    <IconButton style={{color: 'red'}} size={'small'} aria-label="Remove">
                                        <DeleteIcon onClick={() => props.onFilterDelete('clear')}/>
                                    </IconButton>
                                </div>
                            }
                        </div>
                        {
                            <div style={{
                                display: 'flex',
                                paddingTop: '4px',
                                justifyContent: 'flex-end',
                                width: '80%'
                            }}>
                                {
                                    property && value && filterType && props.filterOptions && props.filterOptions[filterType][property] &&
                                    props.filterOptions[filterType][property].subProperties && editable &&
                                    Object.keys(props.filterOptions[filterType][property].subProperties).map((subproperty: any) => {
                                        if(props.filterOptions[filterType][property].subProperties[subproperty].type === 'numeric') {
                                            return(
                                                <div style={{
                                                    display: 'flex',
                                                    paddingTop: '4px',
                                                    justifyContent: 'flex-end',
                                                    width: '80%'
                                                }}>
                                                    <div style={{width: '40%', marginRight: '10px'}}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            color="primary"
                                                            style={{
                                                                borderColor: 'green',
                                                                color: 'green',
                                                                height: '20px',
                                                                fontSize: '8px'
                                                            }}
                                                            onClick={() => setSubPropertyEditing(true)}
                                                            disabled={subPropertyEditing}
                                                        >
                                                            score
                                                        </Button>
                                                    </div>
                                                    {subPropertyEditing &&
                                                    <div style={{width: '40%', marginRight: '10px'}}>
                                                        <Slider
                                                            aria-label="Small steps"
                                                            defaultValue={50}
                                                            step={10}
                                                            marks
                                                            min={0}
                                                            max={100}
                                                            valueLabelDisplay="auto"
                                                        />
                                                    </div>
                                                    }
                                                </div>)
                                        }
                                    })
                                }
                            </div>
                        }

                    </>
                    }
            </>
        )

    }

    function FilterCriteriaComponent(props: any) {

        const [editable, setEditable] = useState(true);
        const [newCriteria, setNewCriteria] = useState(false);
        const [filter, setFilter] = useState<Filter | undefined>(undefined);
        const [filterType, setFilterType] = useState<string | null>(null);


        useEffect(() => {
            if(props.filter) {
                setFilter(props.filter);
                setEditable(props.filter.active);
                setFilterType(props.filter.type);
            }
        }, [props.filter]);

        useEffect(() => {
            if(props.filterType) {
                setFilterType(props.filterType);
            }
        }, [props.filterType]);

        const onFilterAdd = ((filter: any, editing: boolean) => {
            setEditable(false);
            props.onFilterAdd(filter, editing);
        });

        const onFilterEdit = (() => {
           setEditable(true);
        });

        const onFilterDelete = ((type: string) => {
            if(type === 'clear') {
                setNewCriteria(false);
            } else {
                props.onFilterDelete();
            }
        });

        const onFilterSelection = ((type: string) => {
            setEditable(true);
            setFilterType(type);
            props.onFilterAdd({
                type: type,
                subCriteria: [],
                active: true
            }, true);
        });

        const onAdd = () => {
            setNewCriteria(true);
        }

        return (
            <>
                <div style={{paddingTop : '10px'}}>
                    {
                        <Grid container alignItems="center" spacing={1}>
                        {
                            (filterType === 'interactor' || !filterType)  &&
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                        style={{ borderColor: 'green', color: 'green', height: '30px' }}
                                        disabled={filter !== undefined}
                                        onClick={() => onFilterSelection('interactor')}
                                    >
                                        <IconButton>
                                            <FontAwesomeIcon icon={faFilter} size={"2xs"} color={'green'}/>
                                        </IconButton>
                                        Interactor
                                    </Button>
                                </Grid>
                        }
                        {
                            (filterType === 'interaction' || !filterType)  &&  <Grid item>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    style={{ borderColor: 'blue', color: 'blue', height: '30px' }}
                                    disabled={filter !== undefined}
                                    onClick={() => onFilterSelection('interaction')}
                                >
                                    <IconButton>
                                        <FontAwesomeIcon icon={faFilter} size={"2xs"}/>
                                    </IconButton>
                                    Interaction
                                </Button>
                            </Grid>
                        }
                        </Grid>
                    }
                </div>
                {
                    filter && filter.subCriteria.map((filterSubCriteria: any, index: number) => {
                        return <FilterSubCriteria
                            editable={false}
                            showEditing={!newCriteria && filterType && filter.active &&  index === filter.subCriteria.length - 1}
                            filterType={filterType}
                            property={filterSubCriteria.property}
                            value={filterSubCriteria.value}
                            filterOptions={props.filterOptions}
                            onFilterAdd={onFilterAdd}
                            onFilterEdit={onFilterEdit}
                            onFilterDelete={onFilterDelete}
                        />
                    })
                }
                {
                    filter && filterType && filter.active && newCriteria && <FilterSubCriteria
                        editable={filter.active}
                        filterType={filterType}
                        filterOptions={props.filterOptions}
                        onFilterAdd={onFilterAdd}
                        onFilterEdit={onFilterEdit}
                        onFilterDelete={onFilterDelete}
                    />
                }
                {
                    filterType && filter && filter.active && !newCriteria && <IconButton style={{color: 'green'}} aria-label="Add">
                        <AddIcon onClick={onAdd}/>
                    </IconButton>
                }
            </>
        );
    }

    return (
        <>
            <Card style={{height: '500px'}}>
                <Typography style={{textAlign: 'center'}}>
                    <h5>Filter Interactions</h5>
                </Typography>
                <CardContent>
                    {
                        filters.map((filter: any) => {
                            return(
                                <>
                                    <FilterCriteriaComponent
                                        filter={filter}
                                        filterOptions={filterOptions}
                                        onFilterAdd={onFilterAdd}
                                        onFilterDelete={onFilterDelete}
                                    />
                                    <hr/>
                                </>
                            );
                        })
                    }
                    {
                        shouldShowNext()   && <FilterCriteriaComponent
                            filterOptions={filterOptions}
                            filterType={getNextFilterType() || null}
                            onFilterAdd={onFilterAdd}
                            onFilterDelete={onFilterDelete}
                        />
                    }
                </CardContent>
            </Card>
        </>
    );
}

function CytoscapeComponent(props: any) {

    const [selectedPartnerId, setSelectedPartnerId] = useState(null);
    const [selectedInteraction, setSelectedInteraction] = useState(null);
    const [associations, setAssociations] = useState<Array<any>>([]);
    const [participants, setParticipants] = useState<Array<any>>([]);
    const [layout, setLayout] = useState<string>("preset");
    const cyRef = useRef(null);
    const radius = 200;
    let cy : any = null;

    useEffect(() => {
        if(props.associations) {
            setAssociations(props.associations);
        }
    }, [props.associations]);

    useEffect(() => {
        if(props.participants) {
            setParticipants(props.participants);
        }
    }, [props.participants]);

    useEffect(() => {
        if (cyRef.current && associations.length > 0) {
            //let elements = [];
            /*elements.push({
                data: {
                    id: centerBiomoleculeId,
                    label: centerBiomoleculeId,
                    type: 'center'
                },
                position: {
                    x: 0,
                    y: 0
                }
            });*/

            /*associations.forEach((association: any) => {
                let partnerId = association.participants.filter((participantId: string) => participantId !== centerBiomoleculeId)[0];
                //TODO: self interactions to be handled
                if (partnerId && partnerId !== centerBiomoleculeId) {
                    elements.push({
                        data: {
                            id: partnerId,
                            label: partnerId,
                            type: 'interactor'
                        },
                        position: {
                            x: radius * Math.cos(i * 2 * (Math.PI / partners.size)),
                            y: radius * Math.sin(i * 2 * (Math.PI / partners.size))
                        }
                    });
                    elements.push({
                        data: {
                            source: centerBiomoleculeId,
                            target: partnerId,
                            label: association["id"]
                        }
                    });
                    i++;
                } else {
                    console.log(association.id)
                    console.log(association.participants)
                    console.log(partnerId);
                }

            });*/

            let elements : Array<any> = [];
            /*participants.forEach((participant: any) => {
                elements.push({
                    data: {
                        id: participant.id,
                        label: participant.id
                    }
                });
            });*/

            let filteredParticipants = new Set<string>();
            associations.forEach((association: any) => {
                association.participants.forEach((participant: string) => {
                    filteredParticipants.add(participant);
                });
            });

            participants.forEach((participant: any) => {
                if(filteredParticipants.has(participant.id)) {
                    elements.push({
                        data: {
                            id: participant.id,
                            label: participant.id,
                            type: participant.type
                        }
                    });
                }
            });

            associations.forEach((association: any) => {
                elements.push({
                    data: {
                        source: association.participants[0],
                        target: association.participants[1],
                        label: association.id
                    }
                });
            });

            if(!cy) {
                cy = cytoscape({
                    container: cyRef.current,
                    elements: elements,
                    /*layout: {
                        name: 'concentric',
                        concentric: function( node ){
                            return node.degree();
                        },
                        levelWidth: function( nodes ){
                            return 2;
                        }
                    },*/
                    layout: {
                        name: 'cose',
                        idealEdgeLength: function( edge ){ return 32; },
                        nodeOverlap: 20,
                        fit: true,
                        padding: 30,
                        randomize: false,
                        componentSpacing: 100,
                        nodeRepulsion: function( node ){ return 2048; },
                        edgeElasticity: function( edge ){ return 32; },
                        nestingFactor: 5,
                        gravity: 80,
                        numIter: 1000,
                        initialTemp: 200,
                        coolingFactor: 0.95,
                        minTemp: 1.0
                    },
                    style: [
                        {
                            selector: 'node[type="center"]',
                            style: {
                                width: "30px",
                                height: "30px",
                                'background-color': "green !important",
                                'label': 'data(label)',
                                'text-valign': 'center',
                                'text-halign': 'center',
                                'font-size': '4px',
                                'font-family': 'Arial',
                                'text-outline-color': '#000',
                            }
                        },
                        {
                            selector: 'node[type="interactor"]',
                            style: {
                                width: "10px",
                                height: "10px",
                                'background-color': "green",
                            },
                        },
                        {
                            selector: 'node[type="protein"]',
                            style: {
                                'background-color': "blue",
                            },
                        },
                        {
                            selector: 'node[type="gag"]',
                            style: {
                                'background-color': "green",
                            },
                        },
                        {
                            selector: 'node[type="multimer"]',
                            style: {
                                'background-color': "orange",
                            },
                        },
                        {
                            selector: 'node[type="pfrag"]',
                            style: {
                                'background-color': "lightBlue",
                            },
                        },
                        {
                            selector: 'edge',
                            style: {
                                width: "0.5px",
                                backgroundColor: "blue"
                            },
                        },
                    ],
                    userZoomingEnabled: false,
                });
                // Calculate node size based on degree
                const nodes = cy.nodes();
                let maxDegree = 0;

                nodes.forEach((node: any) => {
                    const degree = node.degree(true);
                    if (degree > maxDegree) {
                        maxDegree = degree;
                    }
                });

                nodes.forEach((node: any) => {
                    const degree = node.degree(true);
                    const nodeSize = 20 + (10 * (degree / maxDegree)); // Adjust these values as needed

                    node.style('width', nodeSize).style('height', nodeSize);
                });
                cy.zoom(1.5);

                cy.on('click', 'node', function (event : any) {
                    const node = event.target;
                    let sortedIds = [props.biomoleculeId, node.id()].sort();
                    let selectedInteraction = associations.find((association: any) => association.id === sortedIds[0] + '__' + sortedIds[1]);
                    console.log(node.id())
                    if (selectedInteraction) {
                        setSelectedInteraction(selectedInteraction);
                        setSelectedPartnerId(null);
                    }
                });

                cy.on('mouseover', 'node', function (event : any) {
                    const node = event.target;
                    setSelectedPartnerId(node.id());
                    setSelectedInteraction(null);
                });

                cy.on('mouseout', 'node', function (event : any) {
                    const node = event.target;
                    //alert(`Mouseout on node: ${node.id()}`);
                });
            }

            return () => {
                /*if(cy) {
                    cy.destroy();
                }*/
            };
        }

    }, [associations]);

    return (
        <div style={{display: 'flex'}}>
            <div style={{flex: 0.65, backgroundColor: 'lightgray'}}>
                {selectedPartnerId && <PartnerOverview partnerId={selectedPartnerId}/>}
                {selectedInteraction && <AssociationOverview interaction={selectedInteraction}/>}
            </div>
            <div
                ref={cyRef}
                style={{flex: 3, height: "800px"}}
            />
        </div>
    );
}

function AssociationNetworkComponent({biomoleculeIds, network}: any) {

    const {associations, participantIds} = network;
    const [participants, setParticipants] = useState<any[] | null>(null);
    const [filteredAssociation, setFilteredAssociations] = useState<any[]>([]);


    useEffect(() => {
        if(associations) {
            setFilteredAssociations(associations);
        }

        if(participantIds && !participants) {
            http.post("/biomolecules/", {
                ids: [...participantIds]
            })
                .then((biomoleculeResponse) => {
                    setParticipants(biomoleculeResponse.data);
                });
        }
    },[]);

    const onFilterAdd = ((filters: any, editing: boolean) => {
        let associationsToFilter = [];

        if(filters.length === 0) {
            setFilteredAssociations(associations);
            return;
        }

        if(editing && filters.length > 0) {
            associationsToFilter = associations;
        } else {
            associationsToFilter = filteredAssociation;
        }

        if(filters.some((filter: Filter) => filter.type && filter.subCriteria.length > 0)) {
            const filteredAssociations = filterAssociations(biomoleculeIds[0], associationsToFilter, participants, filters);
            setFilteredAssociations(filteredAssociations);
        }

    });

    const onFilterDelete = ((filters: any) => {
        if(filters.length === 0) {
            setFilteredAssociations(associations);
        } else {
            // Reverse the last filter
            const filteredAssociations = filterAssociations(biomoleculeIds[0], associations, participants, filters);
            setFilteredAssociations(filteredAssociations);
        }
    });

    if (associations && associations.length > 0 && participants && participants.length > 0) {
        return (
            <div style={{display: 'flex'}}>
                <div
                    style={{flex: 3.65, height: "800px"}}
                >
                    {
                        filteredAssociation && filteredAssociation.length > 0 && <CytoscapeComponent
                            biomoleculeId={biomoleculeIds[0]}
                            participants={participants}
                            associations={filteredAssociation}
                        />
                    }
                </div>

                <div style={{flex: 1.35, backgroundColor: 'lightgray'}}>
                    <FilterComponent
                        associations={associations}
                        participants={participants}
                        onFilterAdd={onFilterAdd}
                        onFilterDelete={onFilterDelete}
                    />
                </div>
            </div>
        );
    } else {
        return <></>
    }

}

export default AssociationNetworkComponent;