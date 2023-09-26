import {useEffect, useState} from 'react';
import {
    Box,
    CircularProgress,
    Divider, Grid, 
    IconButton, 
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';

interface BiomoleculeToDisplay {
    id: string,
    type: string,
    name: string,
    recommendedName: string,
    image: string | undefined,
    species: string,
    otherNames?: Array<string> | [],
    description: string | undefined,
    structure?: string | undefined,
    location?: string | undefined,
    crossRefs?: any | undefined,
    biologicalProcessing: Array<string>,
    glycoct: string,
    gene: string | undefined,
    molecularWeight: number | undefined,
    sequenceLength: number | undefined,
    interpro: Array<string> | [],
    subcellularLocation: string,
    function: string
}


function OverviewComponent(props: any) {

    const {biomolecule} = props;
    const [biomoleculeToDisplay, setBiomoleculeToDisplay] = useState<BiomoleculeToDisplay>();
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        let biomoleculeToDisplay: BiomoleculeToDisplay = {
            id: "",
            type: "",
            name: "",
            recommendedName: "",
            image: undefined,
            species: "",
            otherNames: [],
            description: undefined,
            location: undefined,
            crossRefs: {},
            biologicalProcessing: [],
            glycoct: "",
            gene: undefined,
            molecularWeight: undefined,
            sequenceLength: undefined,
            interpro: [],
            subcellularLocation: "",

            function: ""
        };
        biomoleculeToDisplay.id = biomolecule.id;
        biomoleculeToDisplay.type = biomolecule.type;
        biomoleculeToDisplay.name = biomolecule.names.name;
        biomoleculeToDisplay.recommendedName = biomolecule.names?.recommended_name;
        biomoleculeToDisplay.species = biomolecule.species;
        biomoleculeToDisplay.gene = biomolecule.relations.gene_name;
        biomoleculeToDisplay.sequenceLength = biomolecule.molecular_details?.sequence?.length;
        biomoleculeToDisplay.molecularWeight = biomolecule.molecularWeight;

        biomoleculeToDisplay.function = biomolecule.annotations?.function?.text;
        biomoleculeToDisplay.subcellularLocation = biomolecule.annotations?.subcellular_location?.join(",");
        biomoleculeToDisplay.crossRefs = biomolecule.xrefs;
        
        setBiomoleculeToDisplay(biomoleculeToDisplay);
    }, []);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        width: '100%'
    };

    const cellStyles = {
        padding: '0px',
        borderBottom: 'none',
        width: '250px'
    };

    return (
        <>
            <Paper style={paperStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                        <div style={{ paddingLeft: '20px'}}>
                            <h2>{biomoleculeToDisplay && biomoleculeToDisplay.id} : {biomoleculeToDisplay && biomoleculeToDisplay.name}</h2>
                        </div>
                        {
                            biomoleculeToDisplay && biomoleculeToDisplay.species && 
                            <div style={{ paddingLeft: '20px' }}>
                                <FontAwesomeIcon icon={faPerson} size={'2x'}/>
                            </div>
                        }
                    </div>
                    <div style={{float: 'right'}}>
                            <IconButton onClick={toggleExpansion}>
                                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', width: '60%', paddingLeft: '10%', paddingRight: '10%' }}>
                        <Grid container spacing={0}>
                            <Grid item xs={6}>
                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Name</h4></TableCell>
                                <TableCell style={cellStyles}>
                                    {
                                        biomoleculeToDisplay?.recommendedName || biomoleculeToDisplay?.name
                                    }
                                </TableCell>
                            </Grid>
                            {biomoleculeToDisplay?.sequenceLength  && <Grid item xs={6}>
                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Sequence Length</h4></TableCell>
                                <TableCell style={cellStyles}>
                                    {
                                        biomoleculeToDisplay?.sequenceLength 
                                    }
                                </TableCell>
                            </Grid>}
                            {biomoleculeToDisplay?.gene && <Grid item xs={6}>
                                <TableCell style={{...cellStyles, textAlign: 'right', paddingRight: '10px'}}><h4>Gene</h4></TableCell>
                                <TableCell style={cellStyles}>
                                    {
                                        biomoleculeToDisplay?.gene 
                                    }
                                </TableCell>
                            </Grid>}
                            <Grid item xs={6}>
                                <Typography></Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography></Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography></Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography></Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography></Typography>
                            </Grid>
                        </Grid>
                    </div>
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
                    { isExpanded &&
                        <>
                        <TableContainer>
                        <TableBody>
                            {
                                biomoleculeToDisplay && biomoleculeToDisplay.function &&
                                <div style={{textAlign: 'left' , width: '400px', paddingLeft: '20px'}}>
                                    <h3>Biological function</h3>
                                    <Divider/>
                                </div>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.function &&
                            <TableRow>
                                <TableCell style={{borderBottom: 'none'}}>
                                    {
                                        biomoleculeToDisplay && biomoleculeToDisplay.function
                                    }
                                </TableCell>
                            </TableRow>
                            }
                            {
                                biomoleculeToDisplay && biomoleculeToDisplay.subcellularLocation &&
                                <>
                                    <div style={{textAlign: 'left' , width: '400px', paddingLeft: '20px'}}>
                                        <h3>Subcellular Locations</h3>
                                        <Divider/>
                                    </div>
                                    <TableRow>
                                        <TableCell style={{borderBottom: 'none'}}>
                                            {
                                                biomoleculeToDisplay && biomoleculeToDisplay.subcellularLocation
                                            }
                                        </TableCell>
                                    </TableRow>
                                </>
                            }
                        </TableBody>
                    </TableContainer>
                        <TableContainer>
                        <TableBody>
                            {
                                biomoleculeToDisplay && biomoleculeToDisplay.crossRefs &&
                                <>
                                    <div style={{textAlign: 'left' , width: '200px', paddingLeft: '20px'}}>
                                        <h3>Cross References</h3>
                                        <Divider/>
                                    </div>
                                    {
                                        biomoleculeToDisplay.crossRefs.chebi &&
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
                                    {
                                        biomoleculeToDisplay.crossRefs.kegg && <TableRow>
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

                                </>
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
                            {biomoleculeToDisplay && biomoleculeToDisplay.crossRefs
                            && biomoleculeToDisplay.crossRefs.EBI_xref &&

                            <TableRow>
                                <TableCell>
                                    <h4>EBI</h4>
                                </TableCell>
                                <TableCell>
                                    <a href={"https://www.ebi.ac.uk/intact/query/" + biomoleculeToDisplay.crossRefs.EBI_xref }>{
                                        biomoleculeToDisplay && biomoleculeToDisplay.crossRefs
                                        && biomoleculeToDisplay.crossRefs.EBI_xref
                                    }</a>
                                </TableCell>
                            </TableRow>
                            }
                            {biomoleculeToDisplay && biomoleculeToDisplay.type === 'protein' && 
                            <TableRow>
                                <TableCell>
                                    <h4>Uniprot reference</h4>
                                </TableCell>
                                <TableCell style={{textAlign: 'left'}}>
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
                        </>    
                    }
            </Paper>
        </>
    );
}

export default OverviewComponent;