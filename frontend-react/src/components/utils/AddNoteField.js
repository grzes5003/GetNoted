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

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        textAlign: 'center',
    }
}));

export const AddNoteField = ({ctx}) => {
    const classes = useStyles();

    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <Card>
        <form className='form-edit-input' noValidate autoComplete="off">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <TextField className={classes.root} id="outlined-basic"
                           label={strings.addNote} variant="outlined"/>
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
                    >
                        {strings.addLabel}
                    </Button>
                </Grid>
            </Grid>
        </form>
        </Card>
    )
};
