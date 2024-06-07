import {IconButton, InputBase, Paper} from "@mui/material";
import React, {useState} from "react";
import SearchIcon from "@mui/icons-material/Search";

function SearchBox(props: any) {

    const [searchText, setSearchText] = useState<string | null>(null);

    const onPressEnter = (e: React.KeyboardEvent) =>{
        if( e.key === 'Enter' ){
            e.preventDefault();
            props.onPressEnter(e);
        }
    };

    const handleSearch = () => {
        props.onClickSearch(searchText);
    }
    const onSearchTextChange = (e : any) => {
        setSearchText(e.target.value);
        props.onSearchTextChange(e);
    }

    return (
        <>
            <Paper
                component="form"
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 0,
                    width: '100%'
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    inputProps={{ 'aria-label': 'e.g Heparin' }}
                    onChange={onSearchTextChange}
                    onKeyDown={onPressEnter}
                    value={props.searchQuery}
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
        </>
    );
}

export default SearchBox;