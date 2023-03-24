import React from 'react';
import logo from './assets/images/matrixdb_logo_medium.png';
import './App.css';
import {Divider, IconButton, InputBase, Paper, TextField} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import SearchComponent from "./components/search/SearchComponent";

function App() {

  return (
    <div className="App">
        <div className={"App-header"}>
            <div>
                <img src={logo} className={"App-logo"}/>
            </div>
            <div>
                <h3>The extracellular matrix interaction database</h3>
            </div>
        </div>
        <SearchComponent/>
    </div>
  );
}

export default App;
