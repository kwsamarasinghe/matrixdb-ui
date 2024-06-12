import { Drawer, IconButton, Typography} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function NetworkExplorerHelp(props: any) {

    const open = {props};

    return (
        <Drawer
            open={props.open}
            onClose={props.onClose}
            anchor={"right"}
            PaperProps={{
                sx: {
                    width: '40vw',
                    top: '45px',
                    position: 'absolute'
                }
            }}
        >
            <div
                style={{
                    display: "flex",
                    paddingTop: "15px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#050a30",
                    color: "white"
                }}
            >
                <div style={{
                    width: "80%",
                    paddingLeft: "5px"
                }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Help
                    </Typography>
                </div>
                <div style={{
                    width: "20%",
                    textAlign: "right"
                }}>
                    <IconButton onClick={() => !open} style={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
        </Drawer>
    );
}

export default NetworkExplorerHelp;