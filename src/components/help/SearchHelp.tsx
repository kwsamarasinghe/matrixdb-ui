import {Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";

function SearchHelp() {
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
                MatrixDB Provides a search facility to search for biomolecules with free texts and advanced queries
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
                Basic Search
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

export default SearchHelp;