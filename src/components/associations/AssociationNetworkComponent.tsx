import {useParams} from "react-router";
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
    });

    if(partner) {
        return(
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
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

function AssociationNetworkComponent(props: any) {

    const {biomoleculeIds} = props;
    const [associations, setAssociations] = useState<any[]>();
    const [participants, setParticipants] = useState<any[]>();
    const [associationsRetreived, setAssociationsRetrieved] = useState(false);
    const [loading, setLoading] = useState(false);
    const cyRef = useRef(null);
    const radius = 100;

    const [selectedPartnerId, setSelectedPartnerId] = useState(null);
    const selectedInteraction = useState(null);

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
                        setAssociationsRetrieved(true);
                }
            });
        }
    }, []);

    useEffect(() => {
        if(associations) {
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
            let associationCount = associations?.length;
            
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
                            x: radius * 3 * Math.sin(i*2*Math.PI/associationCount),
                            y: radius * Math.cos(i*2*Math.PI/associationCount)
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
                }
            });
        
            const cy = cytoscape({
                container: cyRef.current,
                elements: elements,
                layout: {
                    name: 'preset',
                },
                style: [
                    {
                        selector: 'node',
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

            cy.on('mouseover', 'node', function(event) {
                const node = event.target;
                setSelectedPartnerId(node.id());
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
            <div style={{ flex: 1, backgroundColor: 'lightblue' }}>
                { selectedPartnerId && <PartnerOverview partnerId={selectedPartnerId}/> }
            </div>

            {/* Middle div with your "cy" component */}
            <div
                ref={cyRef}
                style={{ flex: 3, height: "500px", backgroundColor: 'lightgray' }}
            />

            {/* Right div */}
            <div style={{ flex: 1,  backgroundColor: 'lightgreen' }}>
                {/* Content for the right div */}
            </div>
        </div>
    );
    
}

export default AssociationNetworkComponent;