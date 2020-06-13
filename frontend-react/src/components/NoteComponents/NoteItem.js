import React from "react";
import {makeStyles, withStyles} from '@material-ui/core/styles';

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

import {constants} from "../../constants";
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";
import {StatusIcon} from "../utils/StatusIcon";
import ButtonBase from "@material-ui/core/ButtonBase";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";


const DELETE_CATEGORY = gql`
    mutation DeleteCategory($UUID: String!) {
        deleteCategory(UUID: $UUID)
    }
`;

const DELETE_TASK = gql`
    mutation DeleteTask($UUID: String!) {
        deleteTask(UUID: $UUID)
    }
`;

const CHANGE_TASK_STATUS = gql`
    mutation ChangeTaskStatus($UUID: String!) {
        changeTaskStatus(UUID: $UUID)
    }
`;

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

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

export const NoteItem = ({category, tasks, editMode}) => {

    const { addToast } = useToasts();

    const [activeItem, setActiveItem] = React.useState(1);
    const [expanded, setExpanded] = React.useState(false);
    //const [isDisabled, setIsDisabled] = React.useState(false);

    const [deleteCategory] = useMutation(DELETE_CATEGORY);
    const [deleteTask] = useMutation(DELETE_TASK);
    const [changeTaskStatus] = useMutation(CHANGE_TASK_STATUS);

    const classes = useStyles();

    // shows toast alert if deletion is successful
    const showDeleteAlert = () => {
        addToast(strings.deleteDataAlert, {
            appearance: 'success',
            autoDismiss: true,
        })
    };

    // handles delete button
    const handleDeleteClickTask = (e, uuid) => {
        console.log('klink ', e, uuid);
        e.stopPropagation();

        deleteTask({variables: {UUID: uuid}}).then();

        showDeleteAlert();
    };


    const handleDeleteClickCategory = (e, uuid) => {
        console.log('klink ', e, uuid);
        e.stopPropagation();

        deleteCategory({variables: {UUID: uuid}}).then();

        showDeleteAlert();
    };

    // custom handler for expandable list
    const handleChange = panel => () => {
        setExpanded(expanded !== panel ? panel : !panel);
    };

    // formats scalar as date string
    const scalarToTimeString = (date) => {
        let d = new Date(date);
        return d.toLocaleDateString("en-US");
    };

    // counts number of tasks in particular category
    const countTasks = t => {
        if(t === null) return 0;
        return t.filter(v => v.status).length
    };

    // handle triggered when task status is changed
    const handleTaskStatusChange = (e, uuid) => {
        e.stopPropagation();
        console.log("handle: ", uuid);
        changeTaskStatus({variables: {UUID: uuid}}).then();
    };

    return (
        <ExpansionPanel expanded={expanded}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon onClick={handleChange(expanded)} />}
            >
                <ListItem>
                    <ListItemAvatar>
                        <Badge badgeContent={countTasks(category.tasks)} color="primary">
                            <StatusIcon onClick={handleChange(expanded)}/>
                        </Badge>
                    </ListItemAvatar>
                    <Grid onClick={handleChange(expanded)} className='category-grid-div'>
                        <ListItemText primary={category.name} />
                        {category.tasks.length !== 0 ?
                            <BorderLinearProgress variant="determinate" value={(countTasks(category.tasks)/category.tasks.length)*100}/>
                            :
                            null
                        }
                    </Grid>
                    { editMode ?
                        <ExpansionPanelActions>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon onClick={(e) => {handleDeleteClickCategory(e, category.UUID)}}/>
                        </IconButton>
                        </ExpansionPanelActions>
                        :
                        null
                    }
                </ListItem>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                { category.tasks.length !== 0 ?
                    <List className='sublist-body'>
                        {tasks.map(note => (
                                <div>
                                    <ListItem className={classes.nested}>
                                        <ListItemAvatar>
                                            <ButtonBase onClick={(e) => {handleTaskStatusChange(e,note.UUID)}}>
                                                <StatusIcon active={note.status} />
                                            </ButtonBase>
                                        </ListItemAvatar>
                                        <ListItemText primary={note.name} secondary={note.status.toString()}/>
                                        <ListItemText primary={scalarToTimeString(note.date)}/>
                                        {editMode ?
                                            <IconButton edge="end" aria-label="delete">
                                                <DeleteIcon onClick={(e) => {handleDeleteClickTask(e, note.UUID)}}/>
                                            </IconButton>
                                            :
                                            null
                                        }
                                    </ListItem>
                                    <Divider variant="inset" component="li"/>
                                </div>
                            )
                        )}
                        {editMode ?
                            <ListItem className={classes.nested}>
                                <AddNoteField ctx={constants.CTX_TASK} cat={category}/>
                            </ListItem>
                            :
                            null
                        }
                    </List>
                    :
                    <ListItem className={classes.nested}>
                        <AddNoteField ctx={constants.CTX_TASK} cat={category}/>
                    </ListItem>
                }
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
};
