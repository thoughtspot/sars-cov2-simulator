import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { addWeeks, eachWeekOfInterval, differenceInWeeks } from 'date-fns';
import Grid from '@material-ui/core/Grid';
import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DateRangeIcon from '@material-ui/icons/DateRange';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';


export interface Range {
    start: Date,
    end: Date
};

export type ShutdownRangeState = Range[];

interface Props {
    onChange: (ranges: Range[]) => void;
    computeOptimalWeeks: () => void;
    shutdownWeeks?: boolean[];
    startDate?: Date;
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
    },
    marginLeft: {
        marginLeft: theme.spacing(2)
    },
    marginLeftAuto: {
        marginLeft: 'auto'
    }
  }),
);

export const ShutdownRange: React.FC<Props> = ({ shutdownWeeks, startDate, computeOptimalWeeks, onChange }) => {
    const classes = useStyles();
    
    const [ranges, setRanges] = React.useState<ShutdownRangeState>([{
        start: new Date(),
        end: addWeeks(new Date(), 12)
    }]);
    const [_shutdownWeeks, setShutdownWeeks] = React.useState([]);
    const [isWeekView, setIsWeekView] = React.useState(false);

    React.useEffect(() => {
        onChange(ranges);
    }, [ranges]);

    React.useEffect(() => {
        setShutdownWeeks(getShutdownWeeks(ranges, startDate));
    }, [isWeekView])

    React.useEffect(() => {
        if((!shutdownWeeks || !startDate)) {
            return;
        }
        const shutdownRanges = getShutdownRanges(startDate, shutdownWeeks);
        setRanges(shutdownRanges);
        setShutdownWeeks(shutdownWeeks);
    }, [shutdownWeeks, startDate]);

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
        if(type === 'start' && range.end < date) {
            range.end = date;
        }
        setRanges([...ranges]);
    }

    const onWeekViewToggle = (evt) => {
        setIsWeekView(evt.target.checked);
    }

    const onWeekToggle = (evt) => {
        _shutdownWeeks[Number(evt.target.id)] = evt.target.checked;
        let ranges = getShutdownRanges(startDate, _shutdownWeeks);
        setShutdownWeeks(_shutdownWeeks);
        setRanges(ranges);
    }

    const renderRanges = () => ranges.map((range, idx) => <Grid container item direction="row" spacing={4} alignItems="center">
        <Grid item><KeyboardDatePicker variant="inline" onChange={changeRange(range)('start')}  value={range.start} label='Start'></KeyboardDatePicker></Grid>
        <Grid item><KeyboardDatePicker variant="inline" onChange={changeRange(range)('end')}  value={range.end} label='End'></KeyboardDatePicker></Grid>
        <Grid item>
            <IconButton onClick={removeRange(idx)} aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </Grid>
    </Grid>);

    const renderWeeks = () => <Grid item container direction="row">
        {_shutdownWeeks.map((week, idx) => 
            <Grid item>
                <Grid container alignItems="center">
                    <Switch color="primary" id={idx + ''} checked={week} onChange={onWeekToggle}></Switch>
                    <Typography variant="caption">{`Week ${idx + 1}`}</Typography>
                </Grid>
            </Grid>
        )}
    </Grid>

    return (
        <Paper elevation={3} className={classes.root}>
            <Grid container direction="column" alignItems="flex-start" spacing={2}>
                <Grid container alignItems="center" justify="space-between">
                    <Typography className={classes.marginBottom}>Shutdown Dates</Typography>
                    <Grid item>
                        <Grid container alignItems="center">
                            <Checkbox color="primary" onChange={onWeekViewToggle}></Checkbox>
                            <Typography variant="body2">Week view</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {(isWeekView) ? renderWeeks() : renderRanges()}
                <Grid container item className={classes.marginTop} spacing={2} alignItems="center">
                    <Button variant="contained" startIcon={<AddIcon />} onClick={addRange}>Add</Button>
                    <Button variant="contained" className={classes.marginLeft}
                        startIcon={<RotateLeftIcon />} onClick={_ => setRanges([])}>Reset</Button>
                    <Button className={classes.marginLeft}
                        variant="contained" startIcon={<DateRangeIcon />} onClick={computeOptimalWeeks}>Optimize Shutdowns</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}


function getShutdownRanges(startDate: Date, shutdownWeeks: boolean[]): Range[] {
    let ranges = [];
    let currentRange = null;
    for(let i = 0; i<shutdownWeeks.length; i++) {
        if(!shutdownWeeks[i] && currentRange) {
            ranges.push(currentRange);
            currentRange = null;
        }

        if(shutdownWeeks[i]) {
            if(currentRange) {
                currentRange.end = addWeeks(currentRange.end, 1);
            } else {
                currentRange = {
                    start: addWeeks(startDate, i),
                    end: addWeeks(startDate, i+1)
                }
            }
        }
    }
    if(currentRange) {
        ranges.push(currentRange);
    }

    return ranges;
}

function getShutdownWeeks(ranges, startDate) {
    return ranges.reduce((shutdown, range) => {
        let start = differenceInWeeks(range.start, startDate);
        let end = differenceInWeeks(range.end, startDate);
        for(let i = start; i <= end; i++) {
            shutdown[i] = true;
        }
        return shutdown;
    }, Array(104).fill(false));
}

export function getNumShutdownWeeks(ranges) {
    return ranges.reduce((numWeeks, range) => {
        return numWeeks + eachWeekOfInterval(range).length;
    }, 0)
}