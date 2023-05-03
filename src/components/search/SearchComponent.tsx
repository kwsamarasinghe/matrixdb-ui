import React, {useState} from 'react';
import {
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    InputBase,
    LinearProgress,
    List,
    ListItem,
    Paper,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import http from "../../commons/http-commons";
import logo from "../../assets/images/matrixdb_logo_medium.png";

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
            <div className={"App-header"}>
                <div>
                    <img src={logo} className={"App-logo"}/>
                </div>
                <div>
                    <h3>The extracellular matrix interaction database</h3>
                </div>
            </div>
            <div className={"App-search"}>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
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
            <div className={"App-search"}>
                {
                    searchStart && <div style={{paddingTop: '20px'}}>
                        <CircularProgress />
                        </div>
                }
                {
                    searchDone && <h5>{searchResults.length} Results</h5>
                }
                {
                    searchDone && searchResults.length === 0  && <h5>Sorry we couldn't find what you looking for</h5>
                }
                <List>
                    {
                        searchResults &&
                        searchResults.map((result: any) => {
                            return(
                                <ListItem>
                                    <Card sx={{ width: 500 }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                                                <a href={"/biomolecule/" + result.id}>{result.id}</a>
                                            </Typography>
                                            {
                                                result.GAG_Name && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.GAG_Name}
                                                </Typography>
                                            }
                                            {
                                                result.SmallMol_Name && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.SmallMol_Name}
                                                </Typography>
                                            }
                                            {
                                                result.FragmentName && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.FragmentName}
                                                </Typography>
                                            }
                                            {
                                                result.Spep_Name && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.Spep_Name}
                                                </Typography>
                                            }
                                            {
                                                result.GAG_Comments && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.GAG_Comments}
                                                </Typography>
                                            }
                                            {
                                                result.SmallMol_Definition && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.SmallMol_Definition}
                                                </Typography>
                                            }
                                            {
                                                result.Spep_Comments && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.Spep_Comments}
                                                </Typography>
                                            }
                                            {
                                                result.Pfrag_Info && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.Pfrag_Info}
                                                </Typography>
                                            }
                                            {
                                                result.CheBI_identifier && <Typography variant="body2">
                                                    {result.CheBI_identifier}
                                                </Typography>
                                            }
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            );
                        })
                    }
                </List>
            </div>
        </>
    );
}

export default SearchComponents;
