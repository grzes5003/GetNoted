import React, {useEffect} from "react";
import {NoteItem} from "./NoteItem";

import List from '@material-ui/core/List';

import gql from 'graphql-tag';
import {useMutation, useQuery, useSubscription} from '@apollo/react-hooks';
import {makeStyles, withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import {strings} from "../../localization";

import AddIcon from '@material-ui/icons/Add';
import {AddNoteField} from "../utils/AddNoteField";

import {ToastProvider, useToasts} from 'react-toast-notifications'

import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {constants} from "../../constants";
import CircularProgress from "@material-ui/core/CircularProgress";
import {StatusIcon} from "../utils/StatusIcon";
import LinearProgress from '@material-ui/core/LinearProgress';

const GET_NOTES_LIST = gql`
{
    categories {
        name 
        number
        UUID
        date
        tasks {
            name
            number
            UUID
            date
            status
        }
    }
}
`;

const SWAP_NOTES = gql`
mutation SwapCategoryPlaces($first: Int!, $second: Int!) {
    swapCategoryPlaces(first: $first, second: $second)
}
`;

const CATEGORY_SUBSCRIPTION = gql`
  subscription CategoryAdded {
    categoryAdded {
      number
      name
      UUID
      tasks {
        UUID
        name
        date
        status
        number
      }
      date
    }
  }
`;

const TASK_SUBSCRIPTION = gql`
  subscription TaskAdded {
    taskAdded {
      number
      name
      UUID
      tasks {
        UUID
        name
        date
        status
        number
      }
      date
    }
  }
`;

const  TASK_DELETED = gql`
  subscription TaskDeleted {
    taskDeleted {
      number
      name
      UUID
      tasks {
        UUID
        name
        date
        status
        number
      }
      date
    }
  }
`;

const  CATEGORY_DELETED = gql`
  subscription CategoryDeleted {
    categoryDeleted  
  }
`;

const TASK_STATUS_CHANGED = gql`
    subscription TaskCategoryChanged {
        taskStatusChanged {
            number
            name
            UUID
            tasks {
                UUID
                name
                date
                status
                number
            }
            date
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

    const [pageData, setPageData] = React.useState();

    const [editMode, setEditMode] = React.useState(false);
    const changeEditModeState = () => setEditMode(!editMode);

    const {subscribeToMore, loading, error, data} = useQuery(GET_NOTES_LIST);
    const [swapCategoryPlaces, _] = useMutation(SWAP_NOTES);

    //const { data_sub, loading_sub } = useSubscription(CATEGORY_SUBSCRIPTION);

    //console.log("NEW SUB INFO", data_sub, loading_sub);

    //if(!loading_sub && data_sub) {
    //    data.concat(data_sub);
    //    console.log("NEW SUB INFO")
    //}

    const subscribeToNewCategories = () => {
        subscribeToMore({
            document: CATEGORY_SUBSCRIPTION,
            updateQuery: (prev, {subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newFeedItem = subscriptionData.data.categoryAdded;

                console.log(prev);

                return Object.assign({}, prev, {
                        categories: [...prev.categories,newFeedItem]
                });
            }
        });

        subscribeToMore({
            document: TASK_SUBSCRIPTION,
            updateQuery: (prev, {subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newFeedItem = subscriptionData.data.taskAdded;

                console.log(prev);

                return Object.assign({}, prev, {
                    categories: [...prev.categories.map(obj => newFeedItem.UUID === obj.UUID ? newFeedItem : obj)]
                });
            }
        });

        subscribeToMore({
            document: CATEGORY_DELETED,
            updateQuery: (prev, {subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const uuid = subscriptionData.data.categoryDeleted;

                console.log(prev, uuid, subscriptionData.data);

                return Object.assign({}, prev, {
                    categories: [...prev.categories.filter(obj => uuid !== obj.UUID)]
                });
            }
        });

        subscribeToMore({
            document: TASK_DELETED,
            updateQuery: (prev, {subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newFeedItem = subscriptionData.data.taskDeleted;

                console.log("deleted: ", newFeedItem );

                //for(let i = 0; i<prev.categories.length; i++){
                //     prev.categories[i].tasks = prev.categories[i].tasks.filter(x => uuid !== x.UUID);
                //}

                console.log("pozniej: ", prev.categories);

                // .map(x => {x.tasks = x.tasks.filter(obj => uuid !== obj.UUID); return x;})

                return Object.assign({}, prev, {
                    categories: [...prev.categories.map(obj => newFeedItem.UUID === obj.UUID ? newFeedItem : obj)]
                });
            }
        });

        subscribeToMore({
            document: TASK_STATUS_CHANGED,
            updateQuery: (prev, {subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const newFeedItem = subscriptionData.data.taskStatusChanged;

                console.log("cotam: ", subscriptionData.data);

                return Object.assign({}, prev, {
                    categories: [...prev.categories.map(obj => newFeedItem.UUID === obj.UUID ? newFeedItem : obj)]
                });
            }
        });
    };

    useEffect(() => {
        subscribeToNewCategories();
    }, []);

    const classes = useStyles();

    //console.log(data);


    if (loading || !data) {
        return <div className='loading-div'> <CircularProgress /> </div>;
    } else if (error) {
        return <div> Error ${error.message} </div>;
    }

    // swaps list items based on startIndex and endIndex
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        swapCategoryPlaces({variables: {first: startIndex, second: endIndex}}).then();

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
            data.categories,
            result.source.index,
            result.destination.index
        );

        data.categories = items;
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
                                {data.categories.map((note, index) => (
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
                                                    <NoteItem key={note.UUID} category={note} tasks={note.tasks}
                                                              editMode={editMode}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                {editMode || !data.categories || data.categories.length === 0 ?
                    <ListItem className={classes.nested}>
                        <AddNoteField ctx={constants.CTX_CATEGORY}/>
                    </ListItem>
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
