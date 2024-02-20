import {useState} from "react";
import {Collapse, IconButton, Link, List, ListItem, ListItemText, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const InterproComponent: React.FC<any> = (props: any) => {
    const {interproList} = props;
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <List style={{
                padding: 0
            }}>
                {interproList.map((item : any) => (
                    <ListItem style={{
                        padding: 1
                    }}>
                        <a href={`https://www.ebi.ac.uk/interpro/entry/InterPro/${item.id}`}
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

export default InterproComponent;