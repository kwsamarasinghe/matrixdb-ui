import Header from "../home/HeaderComponent";
import Footer from "../home/Footer";
import imexlogo from "../../assets/images/imexlogo.png";
import {Typography} from "@mui/material";
import React from "react";
function DownloadComponent() {
    return(
        <div
            className="App"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
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
                        background: 'rgb(237, 239, 245)',
                        paddingTop: '20px'
                    }}>
                            <Typography
                                variant={'body1'}
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '5px',
                                    marginTop: '5px'
                                }}
                            >
                                Download
                            </Typography>
                            <div style={{
                                paddingRight: '20px',
                                paddingLeft: '20px'
                            }}>
                                <Typography variant={"body2"}>
                                    MatrixDB Core Interactions
                                </Typography>
                                <Typography variant={"body2"}>
                                    All interactions : <a href={"/download/test.txt"}> mytext</a>
                                </Typography>
                            </div>
                    </div>
                </div>
            <Footer/>
        </div>
    );
}

export default DownloadComponent;