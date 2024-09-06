import {Box, Divider, List, ListItem, ListItemText, Typography} from "@mui/material";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";

import ecmness from "../../assets/images/help/ecmness.png";
import searchResult from "../../assets/images/help/search-results.png";

function BiomoleculeHelp() {
    return(
            <Box sx={{ my: 4, paddingBottom: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Overview of Sections
                </Typography>
                <Typography variant="body1" paragraph>
                    A biomolecule page is organized into five sections, each directly accessible via a menu on the top left. If no information is available for a section, the name of that section will not appear in the top left menu. The sections are:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="1. Overview" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="2. Interactions" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="3. Expression" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="4. Structure" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="5. Annotations" />
                    </ListItem>
                </List>

                <Divider />

                <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                    Overview Section
                </Typography>
                <Typography variant="body1" paragraph>
                    The overview section provides the name(s) and identifier of the biomolecule. Further information is available in several tabs, shown only if information is available.
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    If the biomolecule is a protein:
                </Typography>
                <ul>
                    <li>A description of the biological function(s) (source: UniProt)</li>
                    <li>Details of cellular location (source: UniProt)</li>
                    <li>A list of protein family/domain annotation (source: UniProt/InterPro)</li>
                    <li>Cross-references to UniProt and possible PFRAG related entries</li>
                </ul>

                <Typography variant="subtitle1" gutterBottom>
                    If the biomolecule is a multimer:
                </Typography>
                <ul>
                    <li>A description and number of assembled chains (source: Complex Portal)</li>
                    <li>Details of the biological function(s) (source: Complex Portal)</li>
                    <li>Cross-references to Complex Portal</li>
                </ul>

                <Typography variant="subtitle1" gutterBottom>
                    If the biomolecule is a glycosaminoglycan:
                </Typography>
                <ul>
                    <li>A description of the structure (source: ChEBI)</li>
                    <li>In-house annotation of the GAG sequence</li>
                    <li>Details of cellular location (source: ?)</li>
                    <li>A depiction of the molecule in the <a href="https://www.ncbi.nlm.nih.gov/glycans/snfg.html" target="_blank">Symbol Nomenclature for Glycans (SNFG)</a></li>
                    <li>The GlycoCT encoding of the GAG structure</li>
                    <li>Cross-references to GlyTouCan and ChEBI</li>
                </ul>

                <Typography variant="subtitle1" gutterBottom>
                    If the biomolecule is a cation, a small molecule, or a synthetic peptide:
                </Typography>
                <ul>
                    <li>Cross-references to ChEBI</li>
                </ul>

                <Typography variant="body1" paragraph>
                    ECMness label is displayed in the top right banner for proteins, based on the ECMness criterion of MatrixDB ('MatrixDB ECM' blue capsule) and MatrisomeDB categories and subcategories.
                </Typography>

                <Divider />

                <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                    Interactions Section
                </Typography>
                <Typography variant="body1" paragraph>
                    The 'Interactions' section shows the full set of biomolecules interacting with the biomolecule described above. Information is summarized with three figures:
                </Typography>
                <ul>
                    <li>Number of Participants: counts biomolecules interacting with the subject biomolecule (including self-interactions)</li>
                    <li>Number of Experimentally Supported Interactions: counts interactions with experimental evidence</li>
                    <li>Number of Predicted Interactions: counts predicted interactions</li>
                </ul>

                <Typography variant="body1" paragraph>
                    Two views are available: Interaction list view and Network view. In the Interaction list view, binary interactions are displayed in a list. In the Network view, a network is visualized using <a href="https://cytoscape.org" target="_blank">Cytoscape</a>.
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    Interaction List View
                </Typography>
                <Typography variant="body1" paragraph>
                    Binary interactions are shown in an interactive table with six columns: Participant, Interactions, Non-expanded, Spoke Expanded, MI score, and Type. The table can be exported as a .csv file.
                </Typography>

                <Typography variant="body1" paragraph>
                    Direct interactions, physical associations, and associations are defined according to the <a href="https://www.ebi.ac.uk/intact/documentation/user-guide" target="_blank">IntAct user guide</a>.
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    Network View
                </Typography>
                <Typography variant="body1" paragraph>
                    All listed binary interactions are mapped to an interactive graph with nodes as biomolecules and edges as interactions. Nodes can be moved and edges adjusted interactively. For more details, refer to the <a href="https://cytoscape.org/documentation_users.html" target="_blank">Cytoscape documentation</a>.
                </Typography>

                <Typography variant="body1" paragraph>
                    The graph can be exported as a Cytoscape file or as an image.
                </Typography>
            </Box>
    );
}

export default BiomoleculeHelp;