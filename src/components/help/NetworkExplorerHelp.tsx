import {Typography} from "@mui/material";
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
            <h4>Network Explorer</h4>
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
                Network explorer lets the users explore interaction networks of the biomolecules of their choice
            </Typography>

            <h5>Biomolecule selection</h5>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                Biomolecules of the user's choice can be added to the network explorer and can be maintained in the browser session. It can be considered as a list of favorite biomolecules, where you can build the interaction networks.
                There are two ways to add biomolecules to the network explorer.
                <ul>
                    <li>
                        From the biomolecule page.
                    </li>
                </ul>
                    <ul>
                        Add the biomolecule to the explorer from the biomolecule page itself. Click on the network explorer icon on the header.
                        <br/><img src={biomoleculeAdd} alt="biomolecule add"/>
                    </ul>
                    <ul>
                        Once the biomolecule is added to the explorer, icon turn white and you can click on the icon to navigate to the explorer.
                        <br/><img src={biomoleculeAdded} alt="biomolecule added"/>
                    </ul>
                <ul>
                    <li>
                        From the network explorer
                    </li>
                </ul>
                <ul>
                    From the network explorer, using the matrixdb search interface, you can
                    - search for biomolecules,
                    <br/><img src={biomoleculeSearch} width="600px" alt="biomolecule search"/>
                </ul>
                <ul>
                    Filter them according to their properties (e.g species, go terms).
                    <br/><img src={resultsWithFilters} width="600px" alt="biomolecule filter"/>
                </ul>
                <ul>
                    Add the either one by one, or all together to the biomolecule collection. Note that on the left tab, it displays existing biomolecules, you may have already added.
                </ul>
            </Typography>
            <Typography
                variant="body2"
                style={{
                    paddingTop: "4px"
                }}
            >
                <h5>Network generation</h5>
                From the biomolecules list, you can select the participants for the network generation, either one by one or all together.
                <ul>
                    <li>
                        Once the participants are selected click on the network generation icon, which will generate the resulting network in the network tab.
                        <br/><img src={participants} width="300px" alt="participants"/>
                    </li>
                </ul>
            </Typography>

        </div>
    );
}

export default NetworkExplorerHelp;