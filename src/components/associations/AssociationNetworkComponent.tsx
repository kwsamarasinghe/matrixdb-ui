import {useParams} from "react-router";
import {useEffect, useState, useRef} from "react";
import http from "../../commons/http-commons";
import cytoscape from "cytoscape";


function AssociationNetworkComponent(props: any) {

    const {biomoleculeIds} = props;
    const [associations, setAssociations] = useState<any[]>();
    const [participants, setParticipants] = useState<any[]>();
    const [associationsRetreived, setAssociationsRetrieved] = useState(false);
    const [loading, setLoading] = useState(false);
    const cyRef = useRef(null);
    const radius = 100;

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
    }, [associations]);

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
            })
            let i = 0;
            let associationCount = associations?.length;
            
            associations?.map(association => {
                let partnerId = association.participants.filter((participantId: string) => participantId != centerBiomoleculeId)[0];
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
            });
        
            const cy = cytoscape({
                container: cyRef.current,
                elements: elements,
                layout: {
                    name: 'preset',
                },
                style: [
                    {
                        selector: 'node[type="interactor"]',
                        style: {
                            width: "10px",
                            height: "10px",
                            "background-color": "green"
                        },
                    },
                    {
                        selector: 'node[type="center"]',
                        style: {
                            width: "10px",
                            height: "10px",
                            "background-color": "yellow"
                        },
                    },
                    {
                        selector: 'edge',
                        style: {
                            width: "0.5px",
                            "background-color": "blue"
                        },
                    },
                ],
                // Disable zooming
                userZoomingEnabled: false,

                // Disable double-click zoom
                //zoomingEnabled: false,

                // Disable panning (optional)
                userPanningEnabled: false,
            });
            cy.zoom(1.5);
            return () => {
                cy.destroy();
                
            };
        }


    }, [associations])


    return(
        <div ref={cyRef} style={{width: "100%", height: "500px"}}/>    
    );
    
}

export default AssociationNetworkComponent;