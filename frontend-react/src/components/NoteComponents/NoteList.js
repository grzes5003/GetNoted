import React from "react";
import {NoteItem} from "./NoteItem";

import List from '@material-ui/core/List';

import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {makeStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import {strings} from "../../localization";

import AddIcon from '@material-ui/icons/Add';
import {AddNoteField} from "../utils/AddNoteField";

import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

const GET_NOTES_LIST = gql`
{
    notes {
        name 
        number
        UUID
        tasks {
            name
            number
            UUID
        }
    }
}
`;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '80%',
        maxWidth: 1000,
        backgroundColor: theme.palette.background.paper,
        //padding: theme.spacing(5),

        position: 'relative',
        //left: '50%',
        top: '30px',
        //transform: 'translate(-50%, 30px)',

        marginLeft: 'auto',
        marginRight: 'auto',

        height: 'min-content',
    },
}));


export const NoteList = () => {

    const [editMode, setEditMode] = React.useState(false);
    const changeEditModeState = () => setEditMode(!editMode);

    const {loading, error, data} = useQuery(GET_NOTES_LIST);

    const classes = useStyles();

    console.log(data);

    //const notes = [{name: "name", date: "today"}, {name: "name2", date: "tomorrow"}];

    if (loading || !data) {
        return <div> Loading... </div>;
    } else if (error) {
        return <div> Error ${error.message} </div>;
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };



    const getListStyle = isDraggingOver => ({
        //background: isDraggingOver ? "lightblue" : "",
        //padding: grid,
        //width: 250
    });

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        //padding: grid * 2,
        //margin: `0 0 ${grid}px 0`,

        // change background colour if dragging
        //background: isDragging ? "lightgreen" : "",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            data.notes,
            result.source.index,
            result.destination.index
        );

        data.notes = items;
    };


    return (
        <div className={classes.root}>
            <List>
                <ListItem>
                    <ListItemText primary=''/>
                    <IconButton edge="end" aria-label="delete">
                        <EditIcon onClick={changeEditModeState} color={editMode ? 'secondary' : 'primary'}/>
                    </IconButton>
                </ListItem>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {data.notes.map((note, index) => (
                                        <Draggable key={note.number} draggableId={note.UUID} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <li key={`$note.name`}>
                                                        <NoteItem name={note.name} tasks={note.tasks} editMode={editMode}/>
                                                    </li>
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                {editMode ?
                    <li>
                        <ListItem className={classes.nested}>
                            <AddNoteField/>
                        </ListItem>
                    </li>
                    :
                    null
                }
            </List>
        </div>)
};

//<Divider variant="inset" component="li" />

// export const NoteList = () => (
//     <Query query={GET_NOTES_LIST}>
//         {({data: {notes}, loading}) => {
//             if (loading || !notes) {
//                 return <div> Loading... </div>;
//             }
//
//             return (<div>
//                 <ul className={"notes_list"}>
//                     {notes.map(note => (
//                             <li key={`$note.name`}>
//                                 <NoteItem name={note.name} date={note.date}/>
//                             </li>
//                         )
//                     )}
//                 </ul>
//             </div>)
//         }}
//     </Query>
// );
