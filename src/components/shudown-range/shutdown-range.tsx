import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { addWeeks } from 'date-fns';
import Grid from '@material-ui/core/Grid';
import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';


export interface Range {
    start: Date,
    end: Date
};

export type ShutdownRangeState = Range[];

interface Props {
    onChange: (ranges: Range[]) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        padding: theme.spacing(4)
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    },
    marginTop: {
        marginTop: theme.spacing(2)
    }
  }),
);

export const ShutdownRange: React.FC<Props> = ({ onChange }) => {
    const classes = useStyles();
    const [ranges, setRanges] = React.useState<ShutdownRangeState>([{
        start: new Date(),
        end: addWeeks(new Date(), 12)
    }]);
    React.useEffect(() => {
        onChange(ranges);
    }, [ranges]);

    const addRange = () => {
        let rangeStart = ranges[ranges.length - 1]?.end || new Date();
        const range = {
            start: rangeStart,
            end: rangeStart
        }
        setRanges([
            ...ranges,
            range
        ]);
    }

    const removeRange = (idx: number) => () => {
        ranges.splice(idx, 1);
        setRanges([...ranges]);
    }

    const changeRange = range => type => date => {
        range[type] = date;
        if(type === 'start') {
            range.end = date;
        }
        setRanges([...ranges]);
    }

    return (
        <Paper elevation={3} className={classes.root}>
            <Grid container direction="column" alignItems="flex-start" spacing={2}>
                <Typography className={classes.marginBottom}>Shutdown Dates</Typography>
                {ranges.map((range, idx) => <Grid container item direction="row" spacing={4} alignItems="center">
                    <Grid item><KeyboardDatePicker variant="inline" onChange={changeRange(range)('start')}  value={range.start} label='Start'></KeyboardDatePicker></Grid>
                    <Grid item><KeyboardDatePicker variant="inline" onChange={changeRange(range)('end')}  value={range.end} label='End'></KeyboardDatePicker></Grid>
                    <Grid item>
                        <IconButton onClick={removeRange(idx)} aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>)}
                <Grid item className={classes.marginTop}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={addRange}>Add</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}