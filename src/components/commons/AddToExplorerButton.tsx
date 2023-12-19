import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNodes, faPlus} from "@fortawesome/free-solid-svg-icons";
import React from "react";

function NetworkExplorerButton() {
    return(
        <button style={{
            color: 'white',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            margin: '10px'
        }} title="Add To Network Explorer">
            <FontAwesomeIcon icon={faCircleNodes} style={{ marginRight: '10px', fontSize: '1.2em' }} />
            <FontAwesomeIcon icon={faPlus} style={{ position: 'absolute', top: '-8px', fontSize: '0.8em' }} />
        </button>
    )
}