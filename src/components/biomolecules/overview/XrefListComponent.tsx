import {useState} from "react";
import {Collapse, IconButton, Link, List, ListItem, ListItemText, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const XefListComponent: React.FC<any> = (props: any) => {
    const {xrefList, xrefLink} = props;
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <List style={{
                padding: 0
            }}>
                {xrefList.map((item : any) => (
                    <ListItem style={{
                        padding: 1
                    }}>
                        <a href={`${xrefLink}${item.id}`}
                           style={{
                               textDecoration: 'none',
                               paddingRight: '8px'
                            }}
                            target={'_blank'}>
                            <Typography variant="body2">
                                {item.id}
                            </Typography>
                        </a>
                        <Typography variant="body2">
                            {item.name}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default XefListComponent;