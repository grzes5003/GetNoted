import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {LogoSmall} from "../logos/LogoSmall";
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export const Header = () => {
    const classes = useStyles();
    return <header className="header" data-testid="header">
        <AppBar position={"static"}>
            <Toolbar>
            <LogoSmall/>
            <Typography variant="h6" className={classes.title}>
                News
            </Typography>
            <div>
                due
            </div>
            </Toolbar>
        </AppBar>
    </header>
};
