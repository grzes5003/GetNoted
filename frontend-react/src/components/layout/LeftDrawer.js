import React from "react";
import {makeStyles, useTheme} from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import NoteIcon from '@material-ui/icons/Note';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import {strings} from "../../localization";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,

    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },

        background: 'white',
    },
}));

export const LeftDrawer = () => {

    const classes = useStyles();

    const drawer = (
        <div>
            <div className={classes.toolbar}/>
            <Divider/>
            <List>

                <ListItem button key={strings.allNotes}>
                    <ListItemIcon> <NoteIcon/> </ListItemIcon>
                    <ListItemText primary={strings.allNotes}/>
                </ListItem>

                <ListItem button key={strings.soonNotes}>
                    <ListItemIcon> <FormatAlignJustifyIcon/> </ListItemIcon>
                    <ListItemText primary={strings.soonNotes}/>
                </ListItem>

                <ListItem button key={strings.recentlyDoneNotes}>
                    <ListItemIcon> <AccessTimeIcon/> </ListItemIcon>
                    <ListItemText primary={strings.recentlyDoneNotes}/>
                </ListItem>

            </List>
            <Divider/>
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <nav className={classes.drawer} aria-label="mailbox folders">
            {drawer}
        </nav>
    )
};
