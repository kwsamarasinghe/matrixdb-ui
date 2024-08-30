import {IconButton, List, ListItem, Paper, Typography} from "@mui/material";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SelectableList: React.FC<any> = (props: any) => {

    const {selectedItem, items, onItemChange, itemLogo, itemURL} = props;

    const rowColor = (itemId: string, index: number) => {
        if(selectedItem === itemId) {
            return {border: '1px solid #3498db'};
        } else {
            if(index % 2 === 0) {
                return {background: 'white'}
            } else {
                return {background: 'rgb(223,236,243)'};
            }
        }
    }

    const [expandedItems, setExpandedItems] = useState({});

    // Function to toggle expansion state
    const toggleExpand = (itemId: string) => {
        setExpandedItems((prevState : any)=> ({
            ...prevState,
            [itemId]: !prevState[itemId] // Toggle the current state of the clicked item
        }));
    };

    const onHighlight = (start: number, end: number) => {
        //onItemChange(selectedItem.id);
        props.onHighlight(start, end);
    }

    // Example row color function
    /*const rowColor = (itemId, index) => ({
        backgroundColor: index % 2 === 0 ? 'lightgray' : 'white'
    });*/

    return (
        <List style={{
            height: '500px',
            overflowY: 'auto'
        }}>
            {items.map((item: any, index: number) => (
                <div key={index}>
                    <ListItem key={index}
                              style={rowColor(item.id, index)}
                              onClick={() => onItemChange(item.id)}
                    >
                        <img
                            src={itemLogo}
                            style={{
                                width: '20px',
                                paddingRight: '10px'
                        }}/>
                        <Typography variant={'body2'}>
                            <a
                                href={`${itemURL}${item.id}`}
                                target='_blank'
                                rel="noreferrer"
                            >
                                {item.id}
                            </a>
                        </Typography>
                    </ListItem>
                    {
                        item.bindingRegions && item.bindingRegions.length > 0 &&
                        <div style={{
                            paddingLeft: '30px',
                            paddingTop: '10px',
                            background: 'lightgray'
                        }}>
                            <Typography variant="body2">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ flex: 1, fontWeight: 'bold' }}>Chains</div>
                                    <div style={{ flex: 2, fontWeight: 'bold' }}>Binding Regions</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {
                                        item.bindingRegions.map((bindingRegion: any, index: number) => (
                                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <span>{item.chain}</span>
                                                    </div>
                                                    <div style={{ flex: 2, display: 'flex', alignItems: 'center' }}>
                                                    <span>
                                                        {bindingRegion.start} - {bindingRegion.end}
                                                    </span>
                                                    <IconButton
                                                        onClick={() => onHighlight(bindingRegion.start, bindingRegion.end)}
                                                        size='small'
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEye}
                                                            style={{
                                                                marginRight: '10px',
                                                                fontSize: '0.5em'
                                                            }}
                                                        />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </Typography>
                        </div>
                    }
                </div>
            ))}
        </List>
    );
};

export default SelectableList;