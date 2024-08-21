import {Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";

import searchHelp from "../../assets/images/help/search-help.gif";
import searchResult from "../../assets/images/help/search-results.png";
import searchSeeMore from "../../assets/images/help/search-seemore.png";
import searchAdvaned from "../../assets/images/help/search-advanced.png";

function SearchHelp() {
    return(
        <>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                MatrixDB Provides a search facility to search for biomolecules and publications, with free texts (Basic Search) and more specific queries (Advanced Search)
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "10px"
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
                Basic search is a free text search, which intends to perform a flexible search on the entire database.<br/>
                By default, most relevant results deemed by the matrixdb search engine is displayed. Relevance of a resulting biomolecule is computed by matrixdb search system, based on specific weights given to different properties of the biomolecule, followed by an filtering criteria <br/>
            </Typography>
            <span style={{
                paddingLeft: "10px"
            }}>
                <img src={searchResult} width="600px" alt="search results"/>
            </span>

            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                Results beyond the most relevant results can be viewed in the see more view, where all the results are displayed sorted by the corresponding interaction partner counts for each biomolecule.<br/>
            </Typography>
            <span style={{
                paddingLeft: "10px"
            }}>
                <img src={searchSeeMore} width="600px" alt="search results"/>
            </span>

            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                Results can be further filtered according to the type of biomolecules or biomolecule properties such as the species and associated go terms. A demonstration of the use of filter can be found below.
            </Typography>
            <span style={{
                paddingLeft: "10px"
            }}>
                <img src={searchHelp} width={"600px"} alt="search help"/>
            </span>

            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                <CircleIcon style={{
                    fontSize: "0.6em",
                    paddingRight: "10px"
                }}/>
                Advanced Search
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                Advanced search provides a more targeted search feature, where database can be search with particular properties of biomolecules.
            </Typography>
            <span style={{
                paddingLeft: "10px",
                paddingBottom: "30px"
            }}>
                <img src={searchAdvaned} width={"600px"} alt="search advanced"/>
            </span>


        </>
    );
}

export default SearchHelp;