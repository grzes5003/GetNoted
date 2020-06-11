import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {strings} from "../../localization";

import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export const DeleteAlert = ({text, dismiss}) => {
    const classes = useStyles();

    return (
        <Grid container justify="space-around">
            <Typography variant="body2" component="p">
                {text}
            </Typography>
            {
                text === strings.deleteDataAlert ?
                    <Button variant="outlined" size="small" onClick={dismiss}>{strings.undo}</Button> : null
            }
        </Grid>
    );
};
