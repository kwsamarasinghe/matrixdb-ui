import {useEffect, useState, useRef} from "react";
import http from "../../commons/http-commons";
import cytoscape from "cytoscape";
import {Card, CardContent, Typography} from "@mui/material";

function PartnerOverview(props: any) {

    const [partner, setPartner] = useState<any>(null);

    useEffect(() => {
        if(props && props.partnerId) {
            http.get("/biomolecules/" + props.partnerId)
                .then((biomoleculeResponse) => {
                    setPartner(biomoleculeResponse.data);
                });
        }
    },[props.partnerId]);

    if(partner) {
        return(
            <Card>
                <CardContent>
                    <Typography variant="body2" gutterBottom>
                        <a href={"/biomolecule/"+partner.id}>{partner.names && partner.names.name || partner.id}</a>
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
    }
    else{
        return <></>
    }
}

function InteractionOverview(props: any) {

    const [interaction, setinteraction] = useState<any>(null);

    useEffect(() => {
        setinteraction(props.interaction);
    }, [props.interaction])

    if(interaction) {
        return(
            <Card style={{width: 230}}>
                <CardContent>
                    <Typography variant="body2" gutterBottom>
                        <a href={"/association/"+interaction.id}>
                            {interaction.id && interaction.id}
                        </a>
                    </Typography>
                    {
                        interaction.experiments.map((experiment: any) => {
                            return (
                                <div style={{ wordWrap: 'break-word' }}>
                                    <Typography variant="caption" color="textSecondary">
                                        <strong>Experiments:</strong> {experiment}
                                    </Typography>
                                </div>
                            );
                        })
                    }
                    <div style={{ wordWrap: 'break-word' }}>
                        <Typography variant="caption" color="textSecondary">
                            <strong>Pubmed Id:</strong> {interaction.pubmed}
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        );
    }
    else{
        return <></>
    }
}


function AssociationNetworkComponent(props: any) {

    const {biomoleculeIds} = props;
    const [associations, setAssociations] = useState<any[]>();
    const [participants, setParticipants] = useState<any[]>();
    const [loading, setLoading] = useState(false);
    const cyRef = useRef(null);
    const radius = 200;

    const [selectedPartnerId, setSelectedPartnerId] = useState(null);
    const [selectedInteraction, setSelectedInteraction] = useState(null);

    useEffect(() => {
        if(!loading && !associations) {
            setLoading(true);
            http.post("/associations/", {
                biomolecules: biomoleculeIds
            })
            .then((associationResponse) => {
                if(associationResponse.data && associationResponse.data.interactions) {
                        setAssociations(associationResponse.data.interactions);
                        setParticipants(associationResponse.data.participants);
                }
            });
        }
    }, []);

    useEffect(() => {
        if(participants && associations) {
            let centerBiomoleculeId = biomoleculeIds[0];
            let elements = [];
            elements.push({
                data: {
                    id: centerBiomoleculeId,
                    label: centerBiomoleculeId,
                    type: 'center'
                },
                position: {
                    x: 0,
                    y: 0
                }
            });
            let i = 0;
            let associationCount = participants.filter(p => p.id !== biomoleculeIds[0]).length;
            if(associationCount) {
                associations.forEach(association => {
                    let partnerId = association.participants.filter((participantId: string) => participantId !== centerBiomoleculeId)[0];
                    //TODO: self interactions to be handled
                    if(partnerId && partnerId !== centerBiomoleculeId){
                        elements.push({
                            data: {
                                id: partnerId,
                                label: partnerId,
                                type: 'interactor'
                            },
                            position: {
                                x: radius * Math.cos(i*2*(Math.PI/associationCount)),
                                y: radius * Math.sin(i*2*(Math.PI/associationCount))
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

                });

            }

            const cy = cytoscape({
                container: cyRef.current,
                elements: elements,
                layout: {
                    name: 'preset',
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
                            'background-color': "green"
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
               // userZoomingEnabled: false,
               // userPanningEnabled: false,
            });
            cy.zoom(1.5);

            cy.on('click', 'node', function(event) {
               const node = event.target;
               let selectedInteraction = associations.find(association => association.id === biomoleculeIds[0]+'__'+node.id());
               console.log(node.id())
               if(selectedInteraction) {
                   setSelectedInteraction(selectedInteraction);
                   setSelectedPartnerId(null);
               }
            });

            cy.on('mouseover', 'node', function(event) {
                const node = event.target;
                setSelectedPartnerId(node.id());
                setSelectedInteraction(null);
            });

            cy.on('mouseout', 'node', function(event) {
                const node = event.target;
                //alert(`Mouseout on node: ${node.id()}`);
            });

            return () => {
                cy.destroy();
            };
        }

    }, [associations])

    return(
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 0.75, backgroundColor: 'lightgray' }}>
                { selectedPartnerId && <PartnerOverview partnerId={selectedPartnerId}/> }
                { selectedInteraction && <InteractionOverview interaction={selectedInteraction}/> }
            </div>

            <div
                ref={cyRef}
                style={{ flex: 3, height: "800px" }}
            />

            <div style={{ flex: 1.25,  backgroundColor: 'lightgray' }}>
            </div>
        </div>
    );
    
}

export default AssociationNetworkComponent;