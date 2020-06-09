import React from "react";
import {makeStyles} from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Divider from "@material-ui/core/Divider";

import List from '@material-ui/core/List';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(10),
        width: '100%',
    },
}));

export const NoteItem = ({name, tasks}) => {

    const [activeItem, setActiveItem] = React.useState(1);

    const classes = useStyles();

    return (
        <ExpansionPanel>
            <ExpansionPanelSummary>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>

                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={name}/>
                </ListItem>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <List>
                    {tasks.map(note => (
                        <li>
                            <ListItem className={classes.nested}>
                                <ListItemAvatar>
                                    <Avatar>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={note.name} />

                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </li>
                        )
                    )}
                </List>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
};
