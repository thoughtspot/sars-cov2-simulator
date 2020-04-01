import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Button, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import {
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import {Slider} from '../slider/slider';
import {sliders} from './controls-data';
import RegionSelect from "../region-select/region-select";
import {
    getCovidData,
    getDemographicsData,
    UnitedStates
} from "../../api";

export interface ControlState {
    R0?: number;
    shutdownR0?: number;
    mortalityRate?: number;
    mortalityRateOverflow?: number;
    hospitalizationRate?: number;
    hospitalStayInWeeks?: number;
    infectionStartDate?: Date;
    initialNumberOfCases?: number;
    totalPopulation?: number;
    totalHospitalBeds?: number;
    totalICUBeds?: number;
}

interface Props {
    onChange?: (controls: ControlState) => void;
}

enum Actions {
    CHANGE_SLIDER_VALUE,
    CHANGE_START_DATE,
    CHANGE_POPULATION,
    CHANGE_INITIAL_NUMBER_OF_CASES,
    CHANGE_BEDS,
    CHANGE_ICU_BEDS
}

const initialState: ControlState = sliders.reduce((sliderValues, slider) => {
    sliderValues[slider.name] = slider.defaultValue;
    return sliderValues;
}, {});
initialState.infectionStartDate = new Date();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(2)
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    title: {
        paddingBottom: 0
    }
  }),
);

const textItemStyle = { paddingTop: 12, paddingBottom: 12 };


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
                infectionStartDate: action.infectionStartDate
            }
        case Actions.CHANGE_POPULATION:
            return {
                ...state,
                totalPopulation: action.value
            }
        case Actions.CHANGE_BEDS:
            return {
                ...state,
                totalHospitalBeds: Number(action.value)
            }
        case Actions.CHANGE_INITIAL_NUMBER_OF_CASES:
            return {
                ...state,
                initialNumberOfCases: Number(action.value)
            }
        case Actions.CHANGE_ICU_BEDS:
            return {
                ...state,
                totalICUBeds: Number(action.value)
            }
        
        default:
            return state;
    }
}

export const Controls: React.FC<Props> = ({ onChange }) => {
    const classes = useStyles();
    initialState.initialNumberOfCases = getCovidData(UnitedStates);
    let data = getDemographicsData(UnitedStates);
    initialState.totalPopulation = data.population;
    initialState.totalHospitalBeds = data.hospitalBeds;
    initialState.totalICUBeds = data.icuBeds;
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
    };

    const onDateChange = (infectionStartDate: Date) => {
        dispatch({
            type: Actions.CHANGE_START_DATE,
            infectionStartDate
        })
    };

    const onPopulationChange = (event, value?) => {
        dispatch({
            type: Actions.CHANGE_POPULATION,
            value: value||event.target.value
        })
    };

    const onNumberOfCasesChanged = (event, value?) => {
        dispatch({
            type: Actions.CHANGE_INITIAL_NUMBER_OF_CASES,
            value: value === undefined
                ? event.target.value
                : value
        })
    };

    const onBedsChanged = (event, value?) => {
        dispatch({
            type: Actions.CHANGE_BEDS,
            value: value||event.target.value
        })
    };

    const onICUBedsChanged = (event, value?) => {
        dispatch({
            type: Actions.CHANGE_ICU_BEDS,
            value: value||event.target.value
        })
    };

    const onRegionChanged = (event) => {
        let placeName = event.target.value;
        let data = getDemographicsData(placeName);
        onPopulationChange(undefined, data.population);
        onBedsChanged(undefined, data.hospitalBeds);
        onICUBedsChanged(undefined, data.icuBeds);
        onNumberOfCasesChanged(undefined, getCovidData(placeName));
    };

    return (
            <Paper elevation={3} className={classes.root}>
                <Grid container direction="column" alignItems="flex-start" spacing={8}>
                    <Grid item style={{...textItemStyle, paddingTop: 20}}>
                        <RegionSelect onChange={onRegionChanged} label="Country / State"></RegionSelect>
                    </Grid>
                    <Grid item style={textItemStyle}>
                        <TextField label="Total population"
                                   onChange={onPopulationChange}
                                   value={state.totalPopulation}></TextField>
                    </Grid>
                    <Grid item style={textItemStyle}>
                        <KeyboardDatePicker 
                            onChange={onDateChange}
                            variant="inline" value={state.infectionStartDate} label='Start date'></KeyboardDatePicker>
                    </Grid>
                    <Grid item style={textItemStyle}>
                        <TextField label="Active cases"
                            onChange={onNumberOfCasesChanged}
                            value={state.initialNumberOfCases}></TextField>
                    </Grid>
                    <Grid item style={textItemStyle}>
                        <TextField label="Approx. hospital beds"
                            onChange={onBedsChanged}
                            value={state.totalHospitalBeds}></TextField>
                    </Grid>
                    <Grid item >
                        <TextField label="Approx. ICU  beds"
                                   onChange={onICUBedsChanged}
                                   value={state.totalICUBeds}></TextField>
                    </Grid>
                    {sliders.map(slider => <Grid item key={slider.name}>
                        <Slider {...slider} onChange={onSliderChange}></Slider>
                    </Grid>)}
                </Grid>
            </Paper>
               
    )
}
