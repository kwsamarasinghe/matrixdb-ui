import React from 'react';
import {Routes, Route} from 'react-router-dom';

import SearchComponent from "./components/search/SearchComponent";
import BiomoleculeComponent from "./components/biomolecules/BiomoleculeComponent";
import AssociationComponent from "./components/associations/AssociationComponent";
import ExperimentComponent from "./components/experiments/ExperimentComponent";

import './App.css';

function App() {

  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<SearchComponent/>}>
            </Route>
            <Route path="/biomolecule/:biomoleculeId" element={<BiomoleculeComponent/>} />
            <Route path="/association/:associationId" element={<AssociationComponent/>} />
            <Route path="/experiment/:experimentId" element={<ExperimentComponent/>} />
        </Routes>
    </div>
  );
}

export default App;
