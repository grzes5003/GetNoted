import React from 'react';
import {NoteList} from "../NoteComponents/NoteList";
import {LeftDrawer} from "./LeftDrawer";
import {makeStyles} from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,

    root: {
        display: 'flex',
    },

    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },

    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
}));

export const Content = () => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <LeftDrawer className={classes.drawer} />
            <NoteList className={classes.appBar}/>
        </section>
    )
}
