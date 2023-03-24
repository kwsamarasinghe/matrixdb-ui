import React, {useState} from 'react';
import {
    Card,
    CardContent,
    Divider,
    IconButton,
    InputBase,
    List,
    ListItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import http from "../../commons/http-commons";

function SearchComponents() {

    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchTextChange = (e : any) => {
        setSearchText(e.target.value);
    }

    const handleSearch = () => {
        http.get("/search?text=" + searchText)
            .then((searchResponse) => {
                setSearchResults(searchResponse.data);
            });
    }

    return (
        <>
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
                    searchResults && <h5>{searchResults.length} Results</h5>
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
                                                <a href={""}>{result.id}</a>
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
                                                result.GAG_Name && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.GAG_Comments}
                                                </Typography>
                                            }
                                            {
                                                result.SmallMol_Definition && <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {result.SmallMol_Definition}
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
