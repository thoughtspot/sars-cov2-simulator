import React, { useReducer, useEffect } from 'react';
import shortNum from 'short-number';
import { format } from 'date-fns';
import { SimulatorInputState, generateData} from './data-generator';
import { ShutdownRangeState } from '../shudown-range/shutdown-range';

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
    let data = generateData(state);
    let series = createSeries(data);
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
            title: 'Date',
            gridLineWidth: 1,
            plotBands: createShutdownBands(state.shutdowns)
        },
        plotOptions: {
            line: {
                lineWidth: 4
            }
        },
        tooltip: {
            formatter: function () {
                return `<b>${this.series.name}</b>:${shortNum(this.y)} <br>` +
                    `${format(this.x, 'do MMM y')}`;
            }
        },
        series
    }

    console.log(options);
    return options;
}

function createShutdownBands(shutdowns: ShutdownRangeState) {
    return shutdowns.map(s => {
        return {
            color: '#ffcccb',
            from: s.start,
            to: s.end
        };
    })
}


function createSeries(data) {
    let series = {};
    data.forEach(obj => {
        Object.keys(obj).forEach(key => {
            series[key] = series[key] || {name: key, data: [], visible: false};
            series[key].data.push({
                x: obj.week,
                y: obj[key]
            });
        });
    });
    delete series['week'];
    delete series['weekNum'];

    series['totalInfected'].visible = true;
    series['dead'].visible = true;
    series['newInfected'].visible = true;
    return Object.values(series);
}