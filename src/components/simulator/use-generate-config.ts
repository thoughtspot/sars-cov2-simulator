import React, { useReducer, useEffect } from 'react';
import { addWeeks } from 'date-fns';
import { ControlState } from '../controls/controls';
import { ShutdownRangeState } from '../shudown-range/shutdown-range';

interface SimulatorInputState {
    controls: ControlState;
    shutdowns: ShutdownRangeState;
}

enum Actions {
    CHANGE_CONTROL,
    CHANGE_SHUTDOWN
}

const reducer = (state: SimulatorInputState, action) => {
    switch(action.type) {
        case Actions.CHANGE_CONTROL:
            return {
                ...state,
                controls: action.controls
            }
        case Actions.CHANGE_SHUTDOWN:
            return {
                ...state,
                shutdowns: action.shutdowns
            }
        
        default:
            return state;
    }
}

export const useGenerateConfig = (): any[] => {
    const [state, dispatch] = useReducer(reducer, {
        controls: {},
        shutdowns: []
    });
    return [
        generateChartConfig(state),
        (controls) => dispatch({type: Actions.CHANGE_CONTROL, controls}),
        (shutdowns) => dispatch({type: Actions.CHANGE_SHUTDOWN, shutdowns})
    ];
}

function generateChartConfig(state: SimulatorInputState) { 
    // TODO: Generate chart config here.
    let totalInfected = [{
        x: state.controls.infectionStartDate,
        y: 1
    }];

    let newInfected = [{
        x: state.controls.infectionStartDate,
        y: 1
    }];

    let totalDead = [{
        x: state.controls.infectionStartDate,
        y: 0
    }]

    for(let i=1;i<50;i++) {
        totalInfected[i] = {
            y: Math.ceil(totalInfected[i-1].y * state.controls.R0),
            x: addWeeks(totalInfected[i-1].x, 1)
        };

        newInfected[i] = {
            x: addWeeks(newInfected[i-1].x, 1),
            y: totalInfected[i].y - (totalInfected[i-3]?.y || 0)
        }

        totalDead[i] = {
            x: addWeeks(newInfected[i-1].x, 1),
            y: Math.floor((totalInfected[i-3]?.y || 0) * state.controls.mortalityRate / 100)
        }

    }
    const options = {
        title: {
          text: ''
        },
        yAxis: {
            type: 'logarithmic',
            title: 'Number of people'
            
        },
        xAxis: {
            type: 'datetime',
            title: 'Date'
        },
        series: [{
          name: 'Total infected',
          data: totalInfected
        }, {
            name: 'New Infected',
            data: newInfected
        }, {
            name: 'Total Dead',
            data: totalDead
        }]
    }

    return options;
}