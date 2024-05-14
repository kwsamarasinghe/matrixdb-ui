import siblogo from "../../assets/images/siblogo.svg";
import snsflogo from "../../assets/images/snsflogo.png";
import ifblogo from "../../assets/images/ifb.png";
import frmlogo from "../../assets/images/frm.png";
import imexlogo from "../../assets/images/imexlogo.png";
import ccbylogo from "../../assets/images/ccby.png";
import React from "react";

function Footer() {
    return(
        <div style={{marginTop: 'auto'}}>
            <footer style={{ background: 'rgb(136, 132, 132)', color: 'white', padding: '10px', textAlign: 'center' }}>
                <div style={{
                    display: 'flex',
                    paddingLeft: '200px',
                    paddingRight: '200px'
                }}>
                    <div style={{ flex: '25%' }}>
                        <div>
                            <a href="https://www.sib.swiss" target={'_blank'}>
                                <img src={siblogo} style={{width: '80px', height: 'auto', paddingLeft: '40px'}} className={"App-logo"}/>
                            </a>
                            <a href="https://www.snf.ch" target={'_blank'}>
                                <img src={snsflogo} style={{width: '180px', height: 'auto', paddingLeft: '20px'}} className={"App-logo"}/>
                            </a>
                        </div>
                        <div style={{paddingTop: '10px'}}>
                            <img src={ifblogo} style={{width: '150px', height: '50px'}} className={"App-logo"}/>
                            <img src={frmlogo} style={{width: '80px', height: 'auto'}} className={"App-logo"}/>
                        </div>
                    </div>
                    <div style={{ flex: '50%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={imexlogo} style={{ width: '60px', height: 'auto', paddingLeft: '20px' }} className={"App-logo"} alt="IMEx Logo" />
                            <span style={{ fontSize: '13px', paddingLeft: '5px' }}>
                                    MatrixDB is an active member of the International Molecular Exchange (IMEx) consortium. Experiments are reported according to the{' '}
                                <a href="https://pubmed.ncbi.nlm.nih.gov/19670377/">Minimum Information required</a> for reporting a Molecular Interaction experiment or to the{' '}
                                <a href="https://pubmed.ncbi.nlm.nih.gov/22453911/">International Molecular Exchange curation rules.</a>
                                </span>
                        </div>
                        <div>
                            <img src={ccbylogo} style={{width: '60px', height: 'auto', paddingLeft: '20px'}} className={"App-logo"}/>
                            <span style={{fontSize: '10px', paddingLeft: '5px'}}>
                                    MatrixDB is distributed under the terms of the Creative Commons Attribution Licence CC BY 4.0
                                </span>
                        </div>
                    </div>
                    <div style={{ flex: '25%' }}>
                        <ul style={{ listStyleType: 'none', padding: 0,  textAlign: 'right', fontSize: '14px' }}>
                            {/* <li style={{ margin: '5px 0' }} ><a style={{ color: 'white', textDecoration: 'none' }} href="/about">About</a></li>
                            <li style={{ margin: '5px 0' }}><a style={{ color: 'white', textDecoration: 'none' }} href="/statistics">Statistics</a></li>*/}
                            <li style={{ margin: '5px 0' }}><a style={{ color: 'white', textDecoration: 'none' }} href="/networks">Network Explorer</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;