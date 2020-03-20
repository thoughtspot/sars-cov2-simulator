import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Button, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import {
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import {Slider} from '../slider/slider';
import {ShutdownRange, Range} from '../shudown-range/shutdown-range';
import {sliders} from './controls-data';

export interface ControlState {
    R0?: number;
    shutdownR0?: number;
    mortalityRate?: number;
    mortalityRateOverflow?: number;
    hospitalizationRate?: number;
    hospitalStayInWeeks?: number;
    infectionStartDate?: Date;
}

interface Props {
    onChange?: (controls: ControlState) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(2),
      width: 250
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
  }),
);

enum Actions {
    CHANGE_SLIDER_VALUE,
    CHANGE_START_DATE
}

function reducer(state, action) {
    switch(action.type) {
        case Actions.CHANGE_SLIDER_VALUE:
            return {
                ...state,
                [action.sliderName]: action.value
            }
        case Actions.CHANGE_START_DATE:
            return {
                ...state,
                startDate: action.startDate
            }
        default:
            return state;
    }
}

const initialState: ControlState = sliders.reduce((sliderValues, slider) => {
    sliderValues[slider.name] = slider.defaultValue;
    return sliderValues;
}, {});
initialState.infectionStartDate = new Date('1/1/2020');

export const Controls: React.FC<Props> = ({ onChange }) => {
    const classes = useStyles();
    const [state, dispatch] = React.useReducer(reducer, initialState);
    useEffect(() => {
        onChange(state);
    }, [state]);

    const onSliderChange = (sliderName: string, value?) => {
        dispatch({
            type: Actions.CHANGE_SLIDER_VALUE,
            sliderName,
            value
        });
    }

    const onDateChange = (startDate: Date) => {
        dispatch({
            type: Actions.CHANGE_START_DATE,
            startDate
        })
    }

    return (
            <Paper elevation={3} className={classes.root}>
                <Grid container direction="column" alignItems="flex-start" spacing={10}>
                    <Grid item>
                        <Typography>Control Values</Typography>
                    </Grid>
                    <Grid item>
                        <KeyboardDatePicker 
                            onChange={onDateChange}
                            variant="inline" value={state.infectionStartDate} label='Infection Start date'></KeyboardDatePicker>
                    </Grid>
                    {sliders.map(slider => <Grid item key={slider.name}>
                        <Slider {...slider} onChange={onSliderChange}></Slider>
                    </Grid>)}
                </Grid>
            </Paper>
               
    )
}