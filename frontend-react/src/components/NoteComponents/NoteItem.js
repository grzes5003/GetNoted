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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import List from '@material-ui/core/List';
import TextField from "@material-ui/core/TextField";
import {strings} from "../../localization";
import {AddNoteField} from "../utils/AddNoteField";

import Badge from '@material-ui/core/Badge';
import Typography from "@material-ui/core/Typography";
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {DeleteAlert} from "../layout/DeleteAlert";
import {useToasts} from "react-toast-notifications";

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
    grow: {
        flexGrow: 1,
    },
}));

export const NoteItem = ({category, tasks, editMode}) => {

    const { addToast } = useToasts();

    const [activeItem, setActiveItem] = React.useState(1);
    const [expanded, setExpanded] = React.useState(false);
    //const [isDisabled, setIsDisabled] = React.useState(false);

    const classes = useStyles();

    const showDeleteAlert = () => {
        addToast(strings.deleteDataAlert, {
            appearance: 'info',
            autoDismiss: true,
        })
    };

    const handleChange = panel => () => {
        setExpanded(expanded !== panel ? panel : !panel);
    };

    const scalarToTimeString = (date) => {
        let d = new Date(date);
        return d.toLocaleDateString("en-US");
    };

    const renderNewDeleteAlert = () => {

    };

    return (
        <ExpansionPanel expanded={expanded}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon onClick={handleChange(expanded)} />}
            >
                <ListItem>
                    <ListItemAvatar>
                        <Badge badgeContent={category.tasks.filter(v => v.status).length} color="primary">
                        <Avatar onClick={handleChange(expanded)} >

                        </Avatar>
                        </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={category.name}  onClick={handleChange(expanded)}/>
                    { editMode ?
                        <ExpansionPanelActions>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon onClick={renderNewDeleteAlert()}/>
                        </IconButton>
                        </ExpansionPanelActions>
                        :
                        null
                    }
                </ListItem>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <List className='sublist-body'>
                    {tasks.map(note => (
                        <div>
                            <ListItem className={classes.nested}>
                                <ListItemAvatar>
                                    <Avatar>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={note.name} secondary={note.status.toString()}/>
                                <ListItemText primary={scalarToTimeString(note.date) } />
                                { editMode ?
                                    <IconButton edge="end" aria-label="delete" >
                                        <DeleteIcon onClick={console.log("KLIKLEM " + note.name)}/>
                                    </IconButton>
                                    :
                                    null
                                }
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </div>
                        )
                    )}
                    { editMode ?
                        <ListItem className={classes.nested}>
                            <AddNoteField/>
                        </ListItem>
                        :
                        null
                    }
                </List>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
};
