import React from 'react';
import {NoteList} from "../NoteComponents/NoteList";
import {LeftDrawer} from "./LeftDrawer";
import {makeStyles} from "@material-ui/core/styles";
import {Footer} from "./Footer";

import {ToastProvider, useToasts} from 'react-toast-notifications'
import {strings} from "../../localization";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,

    root: {
        display: 'flex',
        height: '100%',
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

    const [alertType, setAlertType] = React.useState("");


    return (
        <section className={classes.root}>
            <LeftDrawer className={classes.drawer}/>
            <div className='content-div'>
                <ToastProvider>
                    <NoteList className={classes.appBar}/>
                </ToastProvider>
            </div>
            <Footer alertType={alertType}/>
        </section>
    )
};
