import React, { useReducer, useEffect } from 'react';
import shortNum from 'short-number';
import { format, differenceInCalendarWeeks } from 'date-fns';
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

export const useGenerateConfig = (): [SimulatorInputState, any, any, any] => {
    const [state, dispatch] = useReducer(reducer, {
        controls: {},
        shutdowns: []
    });
    return [
        state,
        generateChartConfig(state),
        (controls) => dispatch({type: Actions.CHANGE_CONTROL, controls}),
        (shutdowns) => dispatch({type: Actions.CHANGE_SHUTDOWN, shutdowns})
    ];
}




function generateChartConfig(state: SimulatorInputState) { 
    // TODO: Generate chart config here.
    let {weeks, lastWeekNum} = generateData(state);
    let weeksToGo = getWeeksToGo(lastWeekNum, state.controls.infectionStartDate);
    let series = createSeries(weeks);
    const options = {
        subtitle: {
            text: ''
        },
        title: {
          text: ``,
        },
        yAxis: {
            type: 'logarithmic',
            title: {
                text: 'Number of people'
            },
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date'
            },
            gridLineWidth: 1,
            plotBands: createShutdownBands(state.shutdowns),
            plotLines: [{
                value: weeks[lastWeekNum]?.weekStartDate,
                color: '#013220'
            }]
        },
        plotOptions: {
            line: {
                lineWidth: 7
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
    return {
        config: options,
        weeks,
        weeksToGo
    };
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
                x: obj.weekStartDate,
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

function getWeeksToGo(lastWeekNum, startDate) {
    const currentWeekNum = differenceInCalendarWeeks(new Date(), startDate);
    return lastWeekNum - currentWeekNum;
}