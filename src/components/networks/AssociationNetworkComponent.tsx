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
    InputLabel, Slider, Tooltip, Chip,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DownloadIcon from '@mui/icons-material/Download';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from '@fortawesome/free-solid-svg-icons';
import React from "react";
import NewFilterComponent from "./filter/FilterComponent";
import {RootState} from "../../stateManagement/store";
import {connect, ConnectedProps} from "react-redux";
import FilterManager from "./filter/FilterManager";
import cytoscapeLogo from "../../assets/images/cytoscape.png";

interface Filter {
    type : string,
    subCriteria: {
        property: string,
        value: string
        propertyAttributes?: [
            attribute: string,
            value: string
        ]
    }[],
    active: boolean
}

function PartnerOverview(props: any) {

    const {partner} = props;

    if (partner) {
        return (
            <Card style={{ flex: 0.35, backgroundColor: 'white', margin: '10px' }}>
                <CardContent style={{ flex: 0.35, backgroundColor: 'white', padding: '20px' }}>
                    <Typography variant="body2" gutterBottom>
                        <a href={"/biomolecule/" + partner.id} style={{ wordBreak: 'break-all' }}>
                            {partner.names && partner.names.name || partner.biomoleculeId}
                        </a>
                    </Typography>
                    <Typography color="textSecondary">
                        {partner.type}
                    </Typography>
                    {partner.ecm &&
                        <div style={{
                            width: '140px'
                        }}>
                            <Chip
                                sx={{
                                    borderColor: 'darkblue',
                                    color: 'darkblue'
                                }}
                                size="small"
                                label="MatrixDB ECM"
                                variant="outlined"
                            />
                        </div>
                    }
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
            <Card style={{ flex: 0.35, backgroundColor: 'white', margin: '10px' }}>
                <CardContent style={{ flex: 0.35, backgroundColor: 'white', padding: '20px' }}>
                    <Typography variant="body2" gutterBottom>
                        <a href={"/association/" + association.id} style={{ wordBreak: 'break-all' }}>
                            {association.id && association.id}
                        </a>
                    </Typography>
                    {association.score && <Typography variant="body2">
                        <strong>Score: {association.score} </strong>
                    </Typography>}
                    {
                        association.type && association.type === 2 && <Typography variant="body2" color="#946011">
                            <strong>Predicted</strong>
                        </Typography>
                    }
                    {association.experiments &&
                            association.experiments.direct &&
                            Object.keys(association.experiments.direct).map((experimentType: any) => (
                                <React.Fragment key={experimentType}>
                                    {
                                        association.experiments.direct[experimentType].length > 0 &&
                                        experimentType === 'spoke_expanded_from' &&
                                        <Typography variant="caption" color="textSecondary">
                                            <strong>Spoke Expanded From</strong>
                                        </Typography>
                                    }
                                    {
                                        association.experiments.direct[experimentType].length > 0 &&
                                        experimentType === 'binary' &&
                                        <Typography variant="caption" color="textSecondary">
                                            <strong>Binary</strong>
                                        </Typography>
                                    }
                                    {association.experiments.direct[experimentType].map((experiment: any, index: number) => (
                                        <div key={index} style={{ wordWrap: 'break-word' }}>
                                            <Typography variant="caption" color="textSecondary">
                                                {experiment}
                                            </Typography>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))
                    }
                </CardContent>
            </Card>
        );
    } else {
        return <></>
    }
}

function Legend(){
    return(
        <Card style={{ flex: 0.35, backgroundColor: 'white', margin: '10px' }}>
            <CardContent style={{ flex: 0.35, backgroundColor: 'white', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f89406', marginRight: '10px' }}></div>
                    <span>Protein</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',backgroundColor: '#018FD5', marginRight: '10px' }}></div>
                    <span>GAG</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',backgroundColor: '#6a09c5', marginRight: '10px' }}></div>
                    <span>Multimer</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%',backgroundColor: '#f5e214', marginRight: '10px' }}></div>
                    <span>PFRAG</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <hr style={{ width: '20px', border: '2px solid black', marginRight: '10px' }} />
                    <span>Experimentally Supported</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <hr style={{ width: '20px', border: '2px solid red', marginRight: '10px' }} />
                    <span>Predicted Interactions</span>
                </div>
            </CardContent>
        </Card>
    )
}

function CytoscapeComponent(props: any) {

    const {biomoleculeId, participants, associations, context} = props;
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [selectedInteraction, setSelectedInteraction] = useState(null);
    const cyRef = useRef(null);

    const circularLayout = {
        name: 'circle',
        radius: 150,
        fit: true,
        transform: (node: any, position: any) => {
            position.y -= 350;
            position.x -= 350;
            return position;
        },
    }

    const coseLayout = {
        name: 'cose',
        idealEdgeLength: ( edge: any ) =>  {return 32},
        nodeOverlap: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: ( node: any ) => { return 2048; },
        edgeElasticity: ( edge: any ) => { return 32; },
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
    }

    let cy : any = null;

    const generateDownloadLink = () => {
        if(cy) {
            const base64URI = cy.png();
            const link = document.createElement('a');
            link.href = base64URI;
            link.download = `${biomoleculeId}-interactions-cytoscape-graph.png`;
            link.click();
        }
    };

    const generateCytoscapeLink = () => {
        if(cy) {
            const jsonGraph = JSON.stringify(cy.json());
            const base64URI = `data:application/json;base64,${btoa(jsonGraph)}`;
            const link = document.createElement('a');
            link.href = base64URI;
            link.download = `${biomoleculeId}-interactions-cytoscape.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

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

            console.log("statrting to draw the graph")

            let filteredParticipants = new Set<string>();

            associations.forEach((association: any) => {
                association.participants.forEach((participant: string) => {
                    filteredParticipants.add(participant);
                });
            });
            console.log("Associations added")

            let participantsToDraw: any[] = [];
            participants.forEach((participant: any) => {
                console.log("Adding parnter " +  participant.id)
                if(filteredParticipants.has(participant.id)) {
                    participantsToDraw.push({
                        data: {
                            id: participant.id,
                            label: participant.id,
                            type: participant.type
                        }
                    });
                }
            });
            console.log("participant added")
            let associationsToDraw: any[] = [];
            associations.forEach((association: any) => {
                // Check for self interactions
                let firstParticipant = association.participants[0];
                let secondParticipant;
                if(association.participants.length === 1) {
                    secondParticipant = association.participants[0];
                } else {
                    secondParticipant = association.participants[1];
                }
                console.log("assoc " +  firstParticipant + " " + secondParticipant)
                associationsToDraw.push({
                    data: {
                        source: firstParticipant,
                        target: secondParticipant,
                        label: association.id,
                        type:  association.type && association.type === 2 ? 'predicted' : 'experimental'
                    }
                });
            });
            elements.push(...participantsToDraw);
            elements.push(...associationsToDraw);
            console.log("Associations added")
            if(!cy) {
                let layout;
                if(filteredParticipants.size < 20) {
                    layout = circularLayout;
                } else {
                    layout = coseLayout;
                }
                console.log("cytoscape initializting")
                cy = cytoscape({
                    container: cyRef.current,
                    elements: elements,
                    layout: layout,
                    style: [
                        {
                            selector: 'node[id="'+biomoleculeId+'"]',
                            style: {
                                label: 'data(label)',
                                width: "20px",
                                height: "20px",
                                'background-color': "green !important",
                                'text-valign': 'center',
                                'text-halign': 'center',
                                'font-size': '10px',
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
                                'background-color': "#f89406",
                            },
                        },
                        {
                            selector: 'node[type="gag"]',
                            style: {
                                'background-color': "#018FD5",
                            },
                        },
                        {
                            selector: 'node[type="multimer"]',
                            style: {
                                'background-color': "#6a09c5",
                            },
                        },
                        {
                            selector: 'node[type="pfrag"]',
                            style: {
                                'background-color': "#f5e214",
                            },
                        },
                        {
                            selector: 'edge',
                            style: {
                                width: "1px",
                                'line-color': '#313030'
                            },
                        },
                        {
                            selector: 'edge[type="predicted"]',
                            style: {
                                width: "1px",
                                'line-color': 'red'
                            },
                        },
                    ],
                    userZoomingEnabled: false,
                });
                console.log("cytoscape done")
                // Calculate node size based on degree
                const nodes = cy.nodes();
                let maxDegree = 0;

                console.log("Starting to calculate")
                nodes.forEach((node: any) => {
                    const degree = node.degree(true);
                    if (degree > maxDegree) {
                        maxDegree = degree;
                    }
                });
                console.log("Calculate the max degree " + maxDegree);

                nodes.forEach((node: any) => {
                    const degree = node.degree(true);
                    const nodeSize = 20 + (20 * (degree / maxDegree));

                    node.style('width', nodeSize).style('height', nodeSize);
                });
                console.log("Calculated the node size")
                cy.zoom(1.5);

                cy.on('click', 'node', function (event : any) {
                    const node = event.target;
                    let nodeId = parseInt(node.id());
                    let selectedPartner = participants.filter((p: any) => p.id === nodeId)[0];
                    let sortedIds = [props.biomoleculeId, context.interactors[selectedPartner.id]].sort();
                    let selectedInteraction = associations.find((association: any) => association.id === sortedIds[0] + '__' + sortedIds[1]);
                    if (selectedInteraction) {
                        setSelectedInteraction(selectedInteraction);
                        setSelectedPartner(null);
                    }
                });

                cy.on('mouseover', 'node', function (event : any) {
                    const node = event.target;
                    let nodeId = parseInt(node.id());
                    let selectedPartner = participants.filter((p: any) => p.id === nodeId)[0];
                    let newSelectedPartner = JSON.parse(JSON.stringify(selectedPartner))
                    if(selectedPartner) {
                        newSelectedPartner.biomoleculeId = context.interactors[nodeId];
                        setSelectedPartner(newSelectedPartner);
                        setSelectedInteraction(null);
                    }
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

    }, [participants, associations]);

    return (
        <>
            <div style={{display: 'flex'}}>
                <div style={{ flex: 0.65, backgroundColor: 'lightgray', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ width: '220px', padding: '10px' }}>
                        {selectedPartner && <PartnerOverview partner={selectedPartner}/>}
                        {selectedInteraction && <AssociationOverview interaction={selectedInteraction}/>}
                    </div>
                    <div style={{ marginTop: 'auto', padding: '10px' }}>
                        <Legend/>
                    </div>
                </div>
                <div>
                    <Tooltip title="Download an image" arrow>
                        <IconButton size="small" style={{color: 'green'}} onClick={generateDownloadLink} aria-label="download">
                            <PhotoCameraIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export to cytoscape" arrow>
                        <IconButton size="small" style={{color: 'green'}} onClick={generateCytoscapeLink} aria-label="download">
                            <img src={cytoscapeLogo} style={{width: '25px', height: 'auto'}}/>
                        </IconButton>
                    </Tooltip>
                </div>
                <div
                    ref={cyRef}
                    style={{flex: 3, height: "800px"}}
                />
            </div>
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    network: state.network,
    filters: state.filters
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type AssociationNetworkProps = PropsFromRedux & {biomoleculeIds: string[] | []}

const AssociationNetworkComponent : React.FC<AssociationNetworkProps> = ({
                                                                             network,
                                                                             filters,
                                                                             biomoleculeIds}) => {

    const filterManager = new FilterManager(network, null);
    const currentNetwork = filterManager.getFilteredNetwork(filters);
    return (
        <div style={{ display: 'flex' }}>
            <div
                style={{ flex: 3.65, height: "800px" }}
            >
                {
                    currentNetwork.interactors && currentNetwork.interactors.length > 0 && currentNetwork.interactions.length > 0 &&
                    <CytoscapeComponent
                        biomoleculeId={biomoleculeIds[0]}
                        participants={currentNetwork.interactors}
                        associations={currentNetwork.interactions}
                        context={network.context}
                    />
                }
            </div>

            <div style={{flex: 1.35, backgroundColor: 'lightgray'}}>
                <NewFilterComponent/>
            </div>
        </div>
    );

}

export default connector(AssociationNetworkComponent);