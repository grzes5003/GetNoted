import React from "react";
import TextField from "@material-ui/core/TextField";
import {strings} from "../../localization";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '90%',
    },
}));

export const AddNoteField = () => {
    const classes = useStyles();

    return (
        <form className='form-edit-input' noValidate autoComplete="off">
            <TextField className={classes.root}  id="outlined-basic"
                       label={strings.addNote} variant="outlined"/>
            <IconButton edge="end" aria-label="add">
                <AddIcon/>
            </IconButton>
        </form>
    )
};
