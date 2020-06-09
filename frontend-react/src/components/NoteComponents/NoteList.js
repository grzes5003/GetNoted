import React from "react";
import {NoteItem} from "./NoteItem";

import List from '@material-ui/core/List';

import gql from 'graphql-tag';
import {useQuery } from '@apollo/react-hooks';
import {makeStyles} from "@material-ui/core/styles";

const GET_NOTES_LIST = gql`
{
    notes {
        name 
        tasks {
            name
        }
    }
}
`;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 1000,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(5),

        position: 'relative',
        left: '50%',
        transform: 'translate(-50%)'
    },
}));


export const NoteList = () => {

    const { loading, error, data } = useQuery(GET_NOTES_LIST);

    const classes = useStyles();

    console.log(data);

    //const notes = [{name: "name", date: "today"}, {name: "name2", date: "tomorrow"}];

    if (loading || !data) {
        return <div> Loading... </div>;
    }
    else if (error) {
        return <div> Error ${error.message} </div>;
    }
    return (<div className={classes.root}>
        <List>
            {data.notes.map(note => (
                    <li key={`$note.name`}>
                        <NoteItem name={note.name} tasks={note.tasks} />
                    </li>
                )
            )}
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
