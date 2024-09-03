import {Box, List, ListItem, ListItemText, Typography} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";

import biomoleculeAdd from "../../assets/images/help/biomolecule-add.png";
import biomoleculeAdded from "../../assets/images/help/biomolecule-added.png";
import biomoleculeSearch from "../../assets/images/help/biomolecule-search.png";
import participants from "../../assets/images/help/participants.png";
import resultsWithFilters from "../../assets/images/help/results-with-filters.png";

function NetworkExplorerHelp() {
    return(
        <div style={{
            height: '100vh',
            overflowY: 'auto'
        }}>
            <Box sx={{ my: 4 }}>
                <Typography variant="body1" paragraph>
                    <strong>Network Explorer</strong> is a graphic and interactive tool providing an interface to explore interaction networks of a selectable biomolecule set. It proceeds in three steps:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="1. Search for biomolecules with free text queries" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="2. Select the biomolecules to be added to the network" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="3. Generate an interaction network that can be exported as an image or a Cytoscape format file" />
                    </ListItem>
                </List>
                <Typography variant="h5" component="h2" gutterBottom color="secondary">
                    Biomolecule Search and Selection
                </Typography>
                <Typography variant="body1" paragraph>
                    Biomolecules can be searched and added to Network Explorer. The selection can be maintained in the browser session, useful when a user wishes the tool to remember a list of favorite biomolecules from which to build interaction networks.
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom color="textSecondary">
                    There are two ways to add biomolecules to the Network Explorer:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="From the biomolecule page:"
                            secondary={
                                <Typography variant="body2">
                                    In each biomolecule page, the Network Explorer icon is shown in green on the right end side of the top banner (black). When mousing over the icon, a tooltip specifies the identifier/accession number of the biomolecule described in the page and suggests adding it to Network Explorer. Clicking on the icon updates the number (+1) and makes the biomolecule an input of Network Explorer. To go to the Network Explorer page, click on the name itself (Network Explorer).
                                    <img src={biomoleculeAdd} width="200px" alt="ecmness"/>
                                </Typography>
                            }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="From the Network Explorer page:"
                            secondary={
                                <Typography variant="body2">
                                    Depending on the precision of the term input in the search window, the list of results can vary. For example, entering an accession number might limit results to one, while a generic term like 'metalloproteinase' could yield many results. A 'Biomolecule Selection' header is displayed, with sections including 'Selected participants' (initially empty) and 'Search results,' which lists biomolecules matching the search term. Selected items are added by clicking a green plus sign, populating the 'Selected participants' section. Filters are available based on biomolecule types and species, as shown in a demonstration limited to human proteins.
                                </Typography>
                            }
                        />
                    </ListItem>
                </List>
            </Box>

        </div>
    );
}

export default NetworkExplorerHelp;