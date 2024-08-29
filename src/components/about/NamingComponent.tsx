import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import {Typography} from "@mui/material";
import React from "react";
function NamingComponent() {
    return(
        <div
            className="App"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                paddingTop: '20px'
            }}
        >
            <Header pageDetails={{
                type: "about"
            }}/>
            <div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '0 auto',
                    width: '70%',
                    marginBottom: '5px',
                    background: 'rgb(197,205,229)',
                    paddingTop: '5px'
                }}>
                    <Typography
                        variant={'body1'}
                        style={{
                            fontWeight: 'bold',
                            marginBottom: '5px',
                            marginTop: '5px'
                        }}>
                        MatrixDB Naming Convention
                    </Typography>
                    <div style={{
                        paddingLeft: '20px',
                        paddingRight: '20px'
                    }}>
                        <Typography
                            variant="body1"
                            style={{
                                fontWeight: 'bold'
                            }}
                        >
                            Biomolecules
                        </Typography>
                        <Typography variant="body2">
                            We use custom identifiers for all biomolecule types except proteins. An annotated list of these custom identifiers is available in the Downloads section. The types and identifiers are as follows.
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#f89406',
                                marginRight: '10px'
                            }}></div>
                            <Typography
                                variant="body2"
                                style={{
                                    fontWeight: 'bold'
                                }}
                            >
                                Proteins
                            </Typography>
                        </div>
                        <Typography variant="body2">
                            They are identified by their UniProtKB - Swiss-Prot/TrEMBL primary Accession Number (Example: P98160). This is the most stable identifier of UniProtKB - Swiss-Prot/TrEMBL (when a protein entry is modified, the previous accession number is retained in a secondary accession number list).
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#6a09c5',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Multimers</Typography>
                        </div>
                        <Typography variant="body2">
                            They are identified by a MatrixDB-specific identifier "MULT_x_species" or "MULT_x_VARy_species" for molecular isoforms where x and y are numbers. A cross-reference to the EBI Complex Portal is provided when available.
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#018FD5',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Glycosaminoglycans</Typography>
                        </div>
                        <Typography variant="body2">
                            They are identified by a MatrixDB-specific identifier "GAG_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) is provided when available.
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#f5e214',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Protein fragments</Typography>
                        </div>
                        <Typography variant="body2">
                            PFRAG in short-form, they are identified by a MatrixDB-specific identifier "PFRAG_x_species" where x is a number. A cross-reference to the PRO feature of UniProtKB is provided when available.
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'black',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Cations</Typography>
                        </div>
                        <Typography variant="body2">
                            They are identified by a MatrixDB-specific identifier "CAT_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) is provided when available.
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'lightpink',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Lipidic molecules</Typography>
                        </div>
                        <Typography variant="body2">
                            Fatty-acid related biomolecules are identified by a MatrixDB-specific identifier "LIP_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) is provided when available.
                        </Typography>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: '#d3b486',
                                marginRight: '10px'
                            }}></div>
                            <Typography variant="body2" style={{
                                fontWeight: 'bold'
                            }}>Synthetic peptides</Typography>
                        </div>
                        <Typography variant="body2">
                            Engineered peptides are identified by a MatrixDB-specific identifier "SPEP_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) or an EBI identifier is provided when available.
                        </Typography>
                        <Typography variant="body2" style={{
                            fontWeight: 'bold'
                        }}>Others</Typography>
                        <Typography variant="body2">
                            Remaining molecules are identified by a MatrixDB-specific identifier "SMALLMOL_x" where x is a number. A cross-reference to ChEBI (Chemical Entities of Biological Interest) is provided when available.
                        </Typography>
                    </div>
                    <div style={{
                        paddingTop: '10px',
                        paddingLeft: '20px',
                        paddingRight: '20px'
                    }}>
                        <Typography
                            variant="body1"
                            style={{
                                fontWeight: 'bold'
                            }}
                        >
                            Interactions
                        </Typography>
                        <Typography variant="body2">
                            MatrixDB uses the following naming convention for interactions: identifiers of the biomolecules in alphanumerical order, separated by two underscores. Experiment identifiers begin the same way, and are followed by the PMID (PubMed Identifier), the name of the source database, and a counter (starts at 1, useful when a single source database documents several experiments curated from the same publication and supporting the same interaction). These three fields are underscore-separated.
                        </Typography>
                        <Typography variant="body2">Example interactions:</Typography>
                        <ul>
                            <Typography variant="body2" component="li">CAT_1__O54943</Typography>
                            <Typography variant="body2" component="li">O15496__P12109</Typography>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default NamingComponent;