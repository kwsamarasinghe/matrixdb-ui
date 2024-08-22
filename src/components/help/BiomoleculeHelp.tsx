import {Typography} from "@mui/material";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";

import ecmness from "../../assets/images/help/ecmness.png";
import searchResult from "../../assets/images/help/search-results.png";

function BiomoleculeHelp() {
    return(
        <>
            <Typography
                variant="h6"
                style={{
                    fontWeight: "bold",
                    paddingTop: "4px"
                }}
            >
                Overview Section
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                Overview section provides the following main information;
                <br/>
                <CircleIcon style={{
                    fontSize: "0.6em",
                    paddingRight: "4px"
                }}/>
                Names and identifiers
                <br/>
                <CircleIcon style={{
                    fontSize: "0.6em",
                    paddingRight: "4px"
                }}/>
                Biological functions for proteins (source uniprot)
                <br/>
                <CircleIcon style={{
                    fontSize: "0.6em",
                    paddingRight: "4px"
                }}/>
                Domain annotations for proteins (source uniprot)
                <br/>
                <CircleIcon style={{
                    fontSize: "0.6em",
                    paddingRight: "4px"
                }}/>
                Cross references for proteins to uniprot and pfrag entry, GAGs, SPEPs, Lipids and Cations chebi identifier, multimers complex portal
                <br/>
                <CircleIcon style={{
                    fontSize: "0.6em",
                    paddingRight: "4px"
                }}/>
                ECMness label is displayed for proteins, based on the ECMness criterion of matrixdb and matrisome respectively
                <span style={{
                    paddingLeft: "10px"
                }}>
                <img src={ecmness} width="200px" alt="ecmness"/>
            </span>
            </Typography>

            <Typography
                variant="h6"
                style={{
                    fontWeight: "bold",
                    paddingTop: "4px"
                }}
            >
                Interactions Section
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                Interaction section provides the biomolecule interactions, displayed in a list view and network visualization view with cytoscape.
            </Typography>

            <Typography
                variant="h6"
                style={{
                    fontWeight: "bold",
                    paddingTop: "4px"
                }}
            >
                Transcriptomics and Proteomics Section
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                For proteins this section provides the transcriptomics expression data from bgee and proteomics data from matrisome porject.
            </Typography>

            <Typography
                variant="h6"
                style={{
                    fontWeight: "bold",
                    paddingTop: "4px"
                }}
            >
                Structure Section
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                For proteins displays the pdb structures in a 3D view using the mol-* visualization library.
            </Typography>

            <Typography
                variant="h6"
                style={{
                    fontWeight: "bold",
                    paddingTop: "4px"
                }}
            >
                Annotation Section
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                For proteins and complexes corresponding GO terms, Uniprot keywords and Rectome data is displayed in this section with their cross references.
            </Typography>
        </>
    );
}

export default BiomoleculeHelp;