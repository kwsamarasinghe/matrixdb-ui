import {useEffect, useState} from 'react';
import {
    Box,
    CircularProgress,
    Divider, Grid, 
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';

interface BiomoleculeToDisplay {
    id: string,
    type: string,
    name: string,
    image: string | undefined,
    inSpecies: string,
    otherName?: Array<string> | [],
    description: string | undefined,
    structure?: string | undefined,
    location?: string | undefined,
    crossRefs?: any | undefined,
    biologicalProcessing: Array<string>,
    glycoct: string,
    gene: string | undefined,
    molecularWeight: number | undefined,
    interpro: Array<string> | [],
    subcellularLocation: string
}


function OverviewComponent(props: any) {

    const {biomolecule} = props;
    const [biomoleculeToDisplay, setBiomoleculeToDisplay] = useState<BiomoleculeToDisplay>();

    useEffect(() => {
        let biomoleculeToDisplay: BiomoleculeToDisplay = {
            id: "",
            type: "",
            name: "",
            image: undefined,
            inSpecies: "",
            otherName: [],
            description: undefined,
            location: undefined,
            crossRefs: {},
            biologicalProcessing: [],
            glycoct: "",
            gene: undefined,
            molecularWeight: undefined,
            interpro: [],
            subcellularLocation: ""
        };
        biomoleculeToDisplay.id = biomolecule.id;
        biomoleculeToDisplay.type = biomolecule.type;
        if(biomolecule.In_species) {
            biomoleculeToDisplay.inSpecies = biomolecule.In_species;
        }

        if (biomolecule.Location) {
            biomoleculeToDisplay.location = biomolecule.Location;
        }

        if (biomolecule.CheBI_identifier) {
            biomoleculeToDisplay.crossRefs.chebi = biomolecule.CheBI_identifier;
        }

        if (biomolecule.KEGG) {
            biomoleculeToDisplay.crossRefs.kegg = biomolecule.KEGG;
        }

        if (biomolecule.type.trim() === '"GAG"') {
            if (biomolecule.GAG_Name) {
                biomoleculeToDisplay.name = biomolecule.GAG_Name;
            }
            if (biomolecule.GAG_Comments) {
                biomoleculeToDisplay.description = biomolecule.GAG_Comments;
            }

            if (biomolecule.GAG_Structure) {
                biomoleculeToDisplay.structure = biomolecule.GAG_Structure;
            }

            if (biomolecule.Other_GAG_Name) {
                biomoleculeToDisplay.otherName = [biomolecule.Other_GAG_Name];
            }

            if (biomolecule.GAG_SNFG) {
                biomoleculeToDisplay.image = biomolecule.GAG_SNFG;
            }

            if (biomolecule.ContainsFragment) {
                biomoleculeToDisplay.biologicalProcessing = biomolecule.ContainsFragment;
            }

            if (biomolecule.GlycoCT_String) {
                biomoleculeToDisplay.glycoct = biomolecule.GlycoCT_String;
            }
        }

        if (biomolecule.type.trim() === '"SMALLMOL"') {
            if (biomolecule.SmallMol_Name) {
                biomoleculeToDisplay.name = biomolecule.SmallMol_Name;
            }

            if (biomolecule.SmallMol_Definition) {
                biomoleculeToDisplay.description = biomolecule.SmallMol_Definition;
            }
        }

        if (biomolecule.type.trim().includes("MULT_")) {
            if (biomolecule.Multimer_Name) {
                biomoleculeToDisplay.name = biomolecule.Multimer_Name;
            }

            if (biomolecule.Mult_Info) {
                biomoleculeToDisplay.description = biomolecule.Mult_Info;
            }

            if (biomolecule.ComplexPortal) {
                biomoleculeToDisplay.crossRefs.complexPortal = biomolecule.ComplexPortal;
            }

            if (biomolecule.Other_Multimer_Name) {
                biomoleculeToDisplay.otherName = biomolecule.Other_Multimer_Name;
            }
        }

        if (biomolecule.type.trim() === 'protein') {
            if (biomolecule.Common_Name) {
                biomoleculeToDisplay.name = biomolecule.Common_Name;
            }

            if (biomolecule.GeneName) {
                biomoleculeToDisplay.gene = biomolecule.GeneName;
            }

            if (biomolecule.Molecular_Weight) {
                biomoleculeToDisplay.molecularWeight = biomolecule.Molecular_Weight;
            }

            if (biomolecule.InterPro) {
                //biomoleculeToDisplay.interpro = biomolecule.InterPro;
            } 

            if (biomolecule.Subcellular_location) {
                biomoleculeToDisplay.subcellularLocation = biomolecule.Subcellular_location;
            }
        }

        setBiomoleculeToDisplay(biomoleculeToDisplay);
    }, []);

    return (
        <>
            <Box style={{paddingTop: "60px"}}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ paddingLeft: '20px' }}>
                            <h2>{biomoleculeToDisplay && biomoleculeToDisplay.id} : {biomoleculeToDisplay && biomoleculeToDisplay.name}</h2>
                        </div>
                        {
                            biomoleculeToDisplay && biomoleculeToDisplay.inSpecies && 
                            <div style={{ paddingLeft: '20px' }}>
                                <FontAwesomeIcon icon={faPerson} size={'2x'}/>
                            </div>
                        }
                    </div>
                    <Grid container>
                        <Grid>
                                <TableBody>
                                    {biomoleculeToDisplay && biomoleculeToDisplay.otherName && biomoleculeToDisplay.otherName.length > 0 &&
                                    <TableRow>
                                        <TableCell>
                                            <h4>Other Names</h4>
                                        </TableCell>
                                        <TableCell>
                                            {biomoleculeToDisplay && biomoleculeToDisplay.otherName && biomoleculeToDisplay.otherName.join(',')}
                                        </TableCell>
                                    </TableRow>}
                                    {biomoleculeToDisplay && biomoleculeToDisplay.structure && <TableRow>
                                        <TableCell>
                                            <h4>Structure</h4>
                                        </TableCell>
                                        <TableCell>
                                            {biomoleculeToDisplay && biomoleculeToDisplay.structure}
                                        </TableCell>
                                    </TableRow>}
                                    {biomoleculeToDisplay && biomoleculeToDisplay.description && <TableRow>
                                        <TableCell >
                                            <h4>Comment</h4>
                                        </TableCell>
                                        <TableCell>
                                            {biomoleculeToDisplay && biomoleculeToDisplay.description}
                                        </TableCell>
                                    </TableRow>}
                                    {biomoleculeToDisplay && biomoleculeToDisplay.gene !== undefined && <TableRow>
                                        <TableCell >
                                            <h4>Gene</h4>
                                        </TableCell>
                                        <TableCell>
                                            {biomoleculeToDisplay && biomoleculeToDisplay.gene}
                                        </TableCell>
                                    </TableRow>}
                                    {biomoleculeToDisplay && biomoleculeToDisplay.molecularWeight !== undefined && <TableRow>
                                        <TableCell >
                                            <h4>Moelcular Weight</h4>
                                        </TableCell>
                                        <TableCell>
                                            {biomoleculeToDisplay && biomoleculeToDisplay.molecularWeight} Da
                                        </TableCell>
                                    </TableRow>}
                                </TableBody>
                        </Grid>

                    </Grid>
                    {
                    biomoleculeToDisplay && biomoleculeToDisplay.type === '"GAG"' && biomoleculeToDisplay.image && 
                    <Grid item xs={3} style={{paddingLeft: '20px'}}>
                        <div style={{textAlign: 'left' , width: '300px'}}>
                            <h3>Symbol Nomenclature For Glycans </h3>
                            <Divider/>
                        </div>
                        <Paper style={{ width: '400px'}}>
                            <img src={process.env.REACT_APP_PUBLIC_URL + "img/snfg_img/"+biomoleculeToDisplay.image} style={{ width: '400px'}}/>
                        </Paper>
                    </Grid>
                    }
                    <TableContainer>
                        <TableBody>
                            {
                                biomoleculeToDisplay && (biomoleculeToDisplay.location || biomoleculeToDisplay.subcellularLocation) &&
                                <div style={{textAlign: 'left' , width: '400px', paddingLeft: '20px'}}>
                                    <h3>Biological function, location and expression</h3>
                                    <Divider/>
                                </div>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.location &&
                            <TableRow>
                                <TableCell>
                                    <h4>Cellular Location</h4>
                                </TableCell>
                                <TableCell>
                                    {
                                        biomoleculeToDisplay && biomoleculeToDisplay.location
                                    }
                                </TableCell>
                            </TableRow>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.subcellularLocation &&
                            <TableRow>
                                <TableCell>
                                    <h4>Cellular Location</h4>
                                </TableCell>
                                <TableCell>
                                    {
                                        biomoleculeToDisplay && biomoleculeToDisplay.subcellularLocation                                    }
                                </TableCell>
                            </TableRow>
                            }
                            {
                                biomoleculeToDisplay && biomoleculeToDisplay.crossRefs &&
                                <div style={{textAlign: 'left' , width: '200px', paddingLeft: '20px'}}>
                                    <h3>Cross References</h3>
                                    <Divider/>
                                </div>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.crossRefs
                            && biomoleculeToDisplay.crossRefs.chebi &&
                            <TableRow>
                                <TableCell>
                                    <h4>CheBI</h4>
                                </TableCell>
                                <TableCell>
                                    <a href={"https://www.ebi.ac.uk/chebi/searchId.do?chebiId="+biomoleculeToDisplay.crossRefs.chebi}>
                                        {
                                            biomoleculeToDisplay && biomoleculeToDisplay.crossRefs
                                            && biomoleculeToDisplay.crossRefs.chebi
                                        }
                                    </a>
                                </TableCell>
                            </TableRow>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.crossRefs
                            && biomoleculeToDisplay.crossRefs.kegg &&

                            <TableRow>
                                <TableCell>
                                    <h4>KEGG</h4>
                                </TableCell>
                                <TableCell>
                                    <a href={"https://www.genome.jp/dbget-bin/www_bget?" + biomoleculeToDisplay.crossRefs.kegg}>
                                        {
                                            biomoleculeToDisplay && biomoleculeToDisplay.crossRefs
                                            && biomoleculeToDisplay.crossRefs.kegg
                                        }
                                    </a>
                                </TableCell>
                            </TableRow>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.crossRefs
                            && biomoleculeToDisplay.crossRefs.complexPortal &&

                            <TableRow>
                                <TableCell>
                                    <h4>Complex Portal</h4>
                                </TableCell>
                                <TableCell>
                                    <a href={"https://www.ebi.ac.uk/complexportal/complex/" + biomoleculeToDisplay.crossRefs.complexPortal }>{
                                        biomoleculeToDisplay && biomoleculeToDisplay.crossRefs
                                        && biomoleculeToDisplay.crossRefs.complexPortal
                                    }</a>
                                </TableCell>
                            </TableRow>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.type === 'protein' && 
                            <TableRow>
                                <TableCell>
                                    <h4>Uniprot reference</h4>
                                </TableCell>
                                <TableCell>
                                    <a href={"https://www.uniprot.org/uniprotkb/" + biomoleculeToDisplay.id }>{
                                        biomoleculeToDisplay && biomoleculeToDisplay.id
                                    }</a>
                                </TableCell>
                            </TableRow>
                            }
                            {
                                biomoleculeToDisplay && biomoleculeToDisplay.interpro.length > 0 &&
                                <div style={{textAlign: 'left' , width: '200px', paddingLeft: '20px'}}>
                                    <h3>Domain annotations</h3>
                                    <Divider/>
                                </div>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.interpro.length > 0 &&
                            <TableRow>
                                <TableCell>
                                    <h4>InterPro</h4>
                                </TableCell>
                                <TableCell>
                                    {
                                        biomoleculeToDisplay && biomoleculeToDisplay.interpro.map((ip) => {
                                            return <a href={"https://www.ebi.ac.uk/interpro/entry/InterPro/"+ip}>{ip} </a>
                                        })
                                    }
                                </TableCell>
                            </TableRow>
                            }
                            {
                                biomoleculeToDisplay && biomoleculeToDisplay.biologicalProcessing.length > 0 &&
                                <div style={{textAlign: 'left', width: '200px', paddingLeft: '20px'}}>
                                    <h3>Biological Processing</h3>
                                    <Divider/>
                                </div>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.biologicalProcessing.length > 0
                            &&
                            <TableRow>
                                <TableCell>
                                    <h4>Cleaved Into</h4>
                                </TableCell>
                                <TableCell style={{width: 200,
                                    maxWidth: 400,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    borderStyle: "border-box"}}>
                                    {
                                        biomoleculeToDisplay && biomoleculeToDisplay.biologicalProcessing.map((bp) => {
                                            return <a href={'/biomolecule/' + bp}>{bp}</a>
                                        })
                                    }
                                </TableCell>
                            </TableRow>
                            }
                        </TableBody>
                    </TableContainer>
            </Box>
        </>
    );
}

export default OverviewComponent;