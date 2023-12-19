import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';

import {
    Box, Button,
    CircularProgress,useTheme
} from "@mui/material";
import http from "../../commons/http-commons";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import SearchBoxComponent from "./SearchBoxComponent";
import { useNavigate } from 'react-router-dom';
import ResultComponent from "./ResultComponent";

function SearchComponents() {

    const [searchText, setSearchText] = useState<string|null>(null);
    const [searchStart, setSearchStart] = useState(false);
    const [searchDone, setSearchDone] = useState(false);
    const [searchResults, setSearchResults] = useState<any>({});
    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query')
        setSearchText(query);
    }, []);

    useEffect(() => {
        /*if(searchText && searchText != '') {
            handleSearch();
        }*/
    }, [searchText]);

    const handleSearch = () => {
        http.get("/search?text=" + searchText)
            .then((searchResponse) => {
                setSearchResults(searchResponse.data);
                setSearchDone(true);
                setSearchStart(false);
            });
    }

    const onPressEnter = (e: React.KeyboardEvent) =>{
        if( e.key === 'Enter' ){
            e.preventDefault();
            handleSearch();
            navigate('/search?query=' + searchText);
            setSearchStart(true);
        }
    };

    const onClickSearch = (query: string) => {
        setSearchText(query);
        navigate('/search?query=' + query);
    }

    const onSearchTextChange = (e : any) => {
        const query = e.target.value;
        setSearchText(query);
        //navigate('/search?query=' + query);
    }

    const theme = useTheme();

    return (
        <>
            { !searchDone &&
                <div className={"App-search"}>
                        <div>
                            <img src={logo} className={"App-logo"}/>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <h3>The extracellular matrix interaction database</h3>
                            <h5>Database focused on interactions established by extracellular matrix proteins, proteoglycans and polysaccharide</h5>
                        </div>
                        <div className={"App-search"}>
                            <SearchBoxComponent
                                onClickSearch={onClickSearch}
                                onPressEnter={onPressEnter}
                                onSearchTextChange={onSearchTextChange}
                            />
                        </div>
                </div>
            }
            {
                searchStart && <div style={{paddingTop: '20px'}}>
                    <CircularProgress />
                    </div>
            }
            {
                /*!searchStart && searchDone && <h5>{searchResults.length} Results</h5>*/
            }
            {
                !searchStart && searchDone && searchResults.length === 0  && <h5>Sorry we couldn't find what you looking for</h5>
            }
            {
                searchDone &&
                <><div style={{
                    alignItems: 'center',
                    position: 'sticky',
                    top: '0',
                    zIndex: theme.zIndex.drawer + 1,
                }}>
                    {
                        searchDone && Object.keys(searchResults).length > 0 &&
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            paddingTop: '20px'
                        }}>
                            <div>
                                <SearchBoxComponent
                                    searchQuery={searchText}
                                    onClickSearch={onClickSearch}
                                    onPressEnter={onPressEnter}
                                    onSearchTextChange={onSearchTextChange}
                                />
                            </div>
                        </div>
                    }
                </div>
                <div>
                    <ResultComponent searchResults={searchResults}/>
                </div></>
            }
        </>
    );
}

export default SearchComponents;