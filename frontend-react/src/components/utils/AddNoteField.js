import React from "react";
import TextField from "@material-ui/core/TextField";
import {strings} from "../../localization";
import SendIcon from '@material-ui/icons/Send';
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles} from "@material-ui/core/styles";

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import {constants} from "../../constants";
import {useMutation} from "@apollo/react-hooks";
import gql from 'graphql-tag';

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

const ADD_NEW_CATEGORY = gql`
mutation AddNewCategory($name: String!, $date: Date) {
    addNewCategory(name: $name, date: $date) {
        name
    }
}
`;

const ADD_NEW_TASK = gql`
mutation AddNewTask($name: String!, $categoryUUID: String!) {
    addNewTask(name: $name, categoryUUID: $categoryUUID) {
        number
        UUID
        name
        date
        status
    }
}
`;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        textAlign: 'center',
    }
}));

// From located inside content Component, used to input user data
export const AddNoteField = ({ctx, cat}) => {
    let catUUID = cat ? cat.UUID : null;

    const classes = useStyles();

    // graphQl mutation definition
    const [addNewTask, _] = useMutation(ADD_NEW_TASK, {
        update(cache, {data: { GET_NOTES_LIST }}) {
            const { categories } = cache.readQuery({query: GET_NOTES_LIST});
            cache.writeQuery({
                query: GET_NOTES_LIST,
                data: {categories: cat.concat([addNewTask])},
            });
        }
    });

    // graphQl mutation definition
    const [addNewCategory, {retCat}] = useMutation(ADD_NEW_CATEGORY);

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [inputText, setInputText] = React.useState('');

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // hander for form submit
    const handleAddButton = e => {
        e.stopPropagation();
        e.preventDefault();
        cleanInput();

        console.log("input add ", inputText, catUUID);

        // weather form refers to Category or Task
        if(ctx === constants.CTX_CATEGORY) {
            addNewCategory({variables: {name: inputText, date: selectedDate}}).then();
        }
        else if(ctx === constants.CTX_TASK) {
            addNewTask({variables: {name: inputText, categoryUUID: catUUID}}).then();
        }
        else {
            // TODO handle error
        }

        //window.location.reload(false);

    };

    const handleInputChange = e => {
        setInputText(e.target.value);
    };

    // input cleaner after submit
    const cleanInput = () => {
        setInputText('');
        setSelectedDate(new Date());
    };

    return (
        <Card>
        <form className='form-edit-input' noValidate autoComplete="off" onSubmit={handleAddButton}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <TextField className={classes.root} id="outlined-basic"
                           label={strings.addNote} variant="outlined"
                           onChange={handleInputChange}
                           value={inputText}
                />
                </Grid>
                {   ctx === constants.CTX_CATEGORY ?
                    <Grid item xs>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Date picker inline"
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    :
                    null
                }
                <Grid item xs className={classes.button}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<SendIcon/>}
                        onClick={handleAddButton}
                    >
                        {strings.addLabel}
                    </Button>
                </Grid>
            </Grid>
        </form>
        </Card>
    )
};
