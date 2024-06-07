import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {AppBar, Toolbar, useTheme} from "@mui/material";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleNodes} from '@fortawesome/free-solid-svg-icons';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {faInfo} from '@fortawesome/free-solid-svg-icons';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
    pageDetails: {
        type: string,
        id?: string
    }
}

function Header(props: HeaderProps) {


    const {pageDetails} = props;
    const [selectedBiomolecules, setSelectedBiomolecules] = useState<string[]>([]);
    const [biomoleculeAdded, setBiomoleculeAdded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedBiomolecules(getFromLocalStorage("selectedBiomolecules"));
    }, []);

    const saveToLocalStorage = (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    };

    const getFromLocalStorage = (key: string) => {
        try {
            const storedData = localStorage.getItem(key);
            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            console.error('Error retrieving from local storage:', error);
            return null;
        }
    };

    const onBiomoleculeAdd = () => {
        if(pageDetails && pageDetails.id) {
            setBiomoleculeAdded(true);
            let selected = getFromLocalStorage("selectedBiomolecules");
            if(!selected) selected = [];
            saveToLocalStorage("selectedBiomolecules", [...selected, pageDetails.id])
        }
    }

    const goToExplorer = () => {
        navigate("/networks")
    }

    const theme = useTheme();

    return(
        <div style={{height: '5vh'}}>
        <AppBar
            style={{ zIndex: theme.zIndex.drawer + 1, position: "fixed", top: 0 }}
            position="static"
        >
            <Toolbar className={'App-search-header'}>
                <a href="/">
                    <div>
                        <img src={logo} style={{width: '50px', height: '50px'}} className={"App-logo"}/>
                    </div>
                </a>
                <div style={{ marginLeft: 'auto' }}>
                    {pageDetails.type === 'biomolecule' && <button style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', marginRight: '10px' }}
                            title={"Add " + pageDetails.id +" to Explorer"}
                            onClick={onBiomoleculeAdd}
                    >
                        <FontAwesomeIcon
                            icon={faCircleNodes}
                            style={{ fontSize: '1.5em' }}
                            color={!biomoleculeAdded ? 'green': 'blue' }

                        />
                        {!biomoleculeAdded && <FontAwesomeIcon
                            icon={faPlus}
                            style={{ position: 'absolute', top: '-8px', fontSize: '0.8em' }}
                            color={'green'}
                        />}
                        {selectedBiomolecules && selectedBiomolecules.length > 0 && (
                            <div style={{ position: 'absolute', top: '-8px', fontSize: '0.8em', color: 'green' }}>
                                {selectedBiomolecules.length}
                            </div>
                        )}
                    </button>}

                    {
                        pageDetails.type !== 'biomolecule' &&
                        <button style={{
                            color: 'white',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            marginRight: '10px'
                        }}
                            title={"Go to Explorer"}
                            onClick={goToExplorer}
                        >
                            <FontAwesomeIcon
                                icon={faCircleNodes}
                                style={{ fontSize: '1.5em' }}
                                color={!biomoleculeAdded ? 'green': 'blue' }

                            />
                            {selectedBiomolecules && selectedBiomolecules.length > 0 && (
                                <div style={{ position: 'absolute', top: '-8px', fontSize: '0.8em', color: 'green' }}>
                                    {selectedBiomolecules.length}
                                </div>
                            )}
                        </button>
                    }

                    {/*
                    <button style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer'}} title="Downloads">
                        <FontAwesomeIcon icon={faDownload} style={{ marginRight: '10px', fontSize: '1.5em' }} />
                    </button>

                    <button style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Help">
                        <FontAwesomeIcon icon={faInfo} style={{ marginRight: '10px', fontSize: '1.5em' }} />
                    </button>*/
                    }
                </div>
            </Toolbar>
        </AppBar>
        </div>
    );
}

export default Header;