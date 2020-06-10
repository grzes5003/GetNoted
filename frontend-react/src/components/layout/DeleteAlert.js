import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import {strings} from "../../localization";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export const DeleteAlert = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Alert
                onClose={() => {}}
                action={
                    <Button color="inherit" size="small">
                        {strings.undo}
                    </Button>
                }
            >
                {strings.deleteDataAlert}
            </Alert>
        </div>
    );
};
