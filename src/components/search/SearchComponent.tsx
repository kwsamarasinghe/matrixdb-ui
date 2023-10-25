import React, {useState} from 'react';
import {
    CircularProgress,
    IconButton,
    InputBase,
    List,
    Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import http from "../../commons/http-commons";
import logo from "../../assets/images/matrixdb_logo_medium.png";
import ResultComponent from './ResultComponent';

function SearchComponents() {

    const [searchText, setSearchText] = useState("");
    const [searchStart, setSearchStart] = useState(false);
    const [searchDone, setSearchDone] = useState(false);
    const [searchResults, setSearchResults] = useState([]);


    const keyDownHandler = (e: React.KeyboardEvent) =>{
        if( e.key === 'Enter' ){
            e.preventDefault();
            handleSearch();
            setSearchStart(true);
        }
    };

    const handleSearchTextChange = (e : any) => {
        setSearchText(e.target.value);
    }

    const handleSearch = () => {
        http.get("/search?text=" + searchText)
            .then((searchResponse) => {
                setSearchResults(searchResponse.data);
                setSearchDone(true);
                setSearchStart(false);
            });
    }

    return (
        <>
            <div className={"App App-header"}>
                <div>
                    <img src={logo} className={"App-logo"}/>
                </div>
                <div>
                    <h4>The extracellular matrix interaction database</h4>
                </div>
                <div className={"App-search"}>
                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: 600,
                            borderRadius: 0
                        }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search MatrixDB e.g GAG_1"
                            inputProps={{ 'aria-label': 'e.g Heparin' }}
                            onChange={handleSearchTextChange}
                            onKeyDown={keyDownHandler}
                        />
                        <IconButton
                            type="button"
                            sx={{ p: '10px' }}
                            aria-label="search"
                            onClick={handleSearch}
                        >
                            <SearchIcon/>
                        </IconButton>
                    </Paper>
                </div>
            </div>
            <div className={"App-search"}>
                {
                    searchStart && <div style={{paddingTop: '20px'}}>
                        <CircularProgress />
                        </div>
                }
                {
                    !searchStart && searchDone && <h5>{searchResults.length} Results</h5>
                }
                {
                    !searchStart && searchDone && searchResults.length === 0  && <h5>Sorry we couldn't find what you looking for</h5>
                }
                <List>
                    {
                        searchResults && <ResultComponent searchResults={searchResults}/>
                    }
                </List>
            </div>
        </>
    );
}

export default SearchComponents;