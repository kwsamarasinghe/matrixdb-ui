import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import {
    useTheme
 } from "@mui/material";
import SearchComponent from '../search/SearchComponent';
import MainContentComponent from './MainContentComponent';
import Header from "./HeaderComponent";
import Footer from "./Footer";


function MainComponent() {

    const theme = useTheme();

    const location = useLocation();
    const currentPath = location.pathname;

    return (

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <Header pageDetails={{
                type: "home",
                id: ""
            }}/>
            <main style={{ flex: 1}}>
                <div style={{marginBottom: '20px'}}>
                    <SearchComponent/>
                </div>
                {currentPath !== '/search' && <MainContentComponent/>}
            </main>
            <Footer/>
        </div>
    );
}

export default MainComponent;
