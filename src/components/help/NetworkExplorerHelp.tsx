import {Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";

function NetworkExplorerHelp() {
    return(
        <>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                <CircleIcon style={{
                    fontSize: "0.6em",
                    paddingRight: "4px"
                }}/>
                Search for biomolecules with free text queries
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                <CircleIcon style={{
                    fontSize: "0.6em",
                    paddingRight: "4px"
                }}/>
                Select the biomolecules to be added to the network
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                <CircleIcon style={{
                    fontSize: "0.6em",
                    paddingRight: "4px"
                }}/>
                Generate network and export it to an image or cytoscape export
            </Typography>
        </>
    );
}

export default NetworkExplorerHelp;