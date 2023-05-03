import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useEffect, useState } from "react";

function KeywordComponent(props: any) {

    const {biomolecule} = props;
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        if(biomolecule.Keywrd) {
            setKeywords(biomolecule.Keywrd);
        }
    }, []);

    return(
        <>
            {keywords && keywords.length > 0 && <Box style={{paddingTop: "10px"}}>
                <div style={{float: 'left', paddingLeft: '20px'}}>
                    <h2>Keywords</h2>
                </div>
                <Table sx={{ rowHeight: '20px' }}>
                    <TableContainer>
                        <TableBody>
                            {
                                keywords && keywords.map((keyword : any) => {
                                    return(<TableRow>
                                        <TableCell>
                                            <h4>{keyword}</h4>
                                        </TableCell>
                                        <TableCell>
                                            {keyword}
                                        </TableCell>
                                    </TableRow>)
                                })
                            }
                        </TableBody>
                    </TableContainer>
                </Table>
            </Box>}
        </>
    );
}

export default KeywordComponent;