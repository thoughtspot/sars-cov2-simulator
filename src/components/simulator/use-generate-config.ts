import React, { useReducer, useEffect } from 'react';
import { addWeeks } from 'date-fns';
const reducer = (state, action) => {
    switch(action.type) {
        case 'control':
            return {
                ...state,
                controls: action.controls
            }
        case 'shutdowns':
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
        generateConfig(state),
        (controls) => dispatch({type: 'control', controls}),
        (shutdowns) => dispatch({type: 'shutdowns', shutdowns})
    ];
}

function generateConfig(state) { 
    // TODO: Generate chart config here.
    let totalInfected = [{
        x: state.controls.startDate,
        y: 1
    }];

    for(let i=1;i<20;i++) {
        totalInfected[i] = {
            y: Math.floor(totalInfected[i-1].y * state.controls.R0),
            x: addWeeks(totalInfected[i-1].x, 1)
        };
    }
    console.log(totalInfected);
    const options = {
        title: {
          text: ''
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
          name: 'Total infected',
          data: totalInfected
        }]
    }

    return options;
}