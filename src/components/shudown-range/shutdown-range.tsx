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
import Tooltip from '@material-ui/core/Tooltip';


export interface Range {
    start: Date,
    end: Date
};

export type ShutdownRangeState = {
    shutdownWeeks: boolean[];
    ranges: Range[]
};

interface Props {
    onChange: (ranges: ShutdownRangeState) => void;
    computeOptimalWeeks: () => void;
    shutdownWeeks?: boolean[];
    startDate?: Date;
    onDoNotOptimizeToggle?: (optimize: boolean) => void;
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

export const ShutdownRange: React.FC<Props> = ({ shutdownWeeks, startDate, computeOptimalWeeks, onChange, onDoNotOptimizeToggle }) => {
    const classes = useStyles();
    const [state, setState] = React.useState({ shutdownWeeks: [], ranges: []})
    const [isWeekView, setIsWeekView] = React.useState(false);

    const setShutdownState = (ranges: Range[], shutdownWeeks: boolean[]) => {
        if(!shutdownWeeks) {
            shutdownWeeks = getShutdownWeeks(ranges, startDate);
        }

        if(!ranges) {
            ranges = getShutdownRanges(startDate, shutdownWeeks);
        }

        setState({ranges, shutdownWeeks});
    }

    React.useEffect(() => {
        onChange(state);
    }, [state]);

    React.useEffect(() => {
        if((!shutdownWeeks || !startDate)) {
            return;
        }
        setShutdownState(null, shutdownWeeks);
    }, [shutdownWeeks, startDate]);

    const addRange = () => {
        let rangeStart = state.ranges[state.ranges.length - 1]?.end || new Date();
        const range = {
            start: rangeStart,
            end: rangeStart
        }
        setShutdownState([
            ...state.ranges,
            range
        ], null);
    }

    const removeRange = (idx: number) => () => {
        state.ranges.splice(idx, 1);
        setShutdownState([...state.ranges], null);
    }

    const changeRange = range => type => date => {
        range[type] = date;
        if(type === 'start' && range.end < date) {
            range.end = date;
        }
        setShutdownState([...state.ranges], null);
    }

    const onWeekViewToggle = (evt) => {
        setIsWeekView(evt.target.checked);
    }

    const onWeekToggle = (evt) => {
        state.shutdownWeeks[Number(evt.target.id)] = evt.target.checked;
        setShutdownState(null, [...state.shutdownWeeks]);
    }

    const onDoNotOptimize = (evt) => {
        onDoNotOptimizeToggle(evt.target.checked);
    }

    const onOptimizeClick = () => {
        onDoNotOptimizeToggle(false);
        computeOptimalWeeks();
    }

    const onCustomizeClick = () => {
        onDoNotOptimizeToggle(false);
        setShutdownState([], null);
    }

    const renderRanges = () => state.ranges.map((range, idx) => <Grid container item direction="row" spacing={4} alignItems="center">
        <Grid item><KeyboardDatePicker variant="inline" onChange={changeRange(range)('start')}  value={range.start} label='Start'></KeyboardDatePicker></Grid>
        <Grid item><KeyboardDatePicker variant="inline" onChange={changeRange(range)('end')}  value={range.end} label='End'></KeyboardDatePicker></Grid>
        <Grid item>
            <IconButton onClick={removeRange(idx)} aria-label="delete">
                <DeleteIcon />
            </IconButton>
        </Grid>
    </Grid>);

    const renderWeeks = () => <Grid item container direction="row">
        {state.shutdownWeeks.map((week, idx) => 
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
                    <Grid item>
                        <Grid container direction="row" alignItems="center">
                            <Tooltip title="Weeks when we will have a shutdown.">
                                <Typography>Optimal Shutdown Dates</Typography>
                            </Tooltip>
                            <IconButton onClick={addRange} size="small" style={{ marginLeft: 10}}> <AddIcon/> </IconButton>    
                        </Grid>
                        
                    </Grid>
                    
                    <Grid item>
                        <Grid container alignItems="center">
                            {/* <Checkbox color="primary" onChange={onDoNotOptimize}></Checkbox>
                            <Typography variant="body2">Do not optimize</Typography> */}
                            <Checkbox color="primary" onChange={onWeekViewToggle}></Checkbox>
                            <Typography variant="body2">Week view</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item spacing={2} style={{ maxHeight: 400, overflowY: `auto`, overflowX: 'hidden' }}>
                    {(isWeekView) ? renderWeeks() : renderRanges()}
                </Grid>
                <Grid container item className={classes.marginTop} spacing={2} alignItems="center">                    
                    {/* <Button variant="contained" color="primary"
                        startIcon={<RotateLeftIcon />} onClick={onCustomizeClick}>Customize</Button> */}
                    <Button 
                        variant="contained" startIcon={<DateRangeIcon />} onClick={onOptimizeClick} color="secondary">Flatten the curve</Button>    
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
        for(let i = start; i < end; i++) {
            shutdown[i] = true;
        }
        return shutdown;
    }, Array(104).fill(false));
}

export function getNumShutdownWeeks(shutdownWeeks: boolean[]) {
    return shutdownWeeks.reduce((numWeeks, shutdown) => {
        return numWeeks + ((shutdown) ? 1 : 0);
    }, 0)
}