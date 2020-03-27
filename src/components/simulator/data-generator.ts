import { addWeeks, isWithinInterval } from 'date-fns';
import { ControlState } from '../controls/controls';
import { ShutdownRangeState } from '../shudown-range/shutdown-range';

export interface SimulatorInputState {
    controls: ControlState;
    shutdowns: ShutdownRangeState;
}

export class Week {
    weekStartDate: Date;
    weekNum: number;
    healthy: number = 0;
    newInfected: number = 0;
    totalInfected: number = 0;
    currentlyInfected = 0;
    recovered = 0;
    dead = 0;
    hospitalized = 0;
    isShutdown: boolean = false;

    constructor(params = {}) {
        Object.assign(this, params);
    }
}

export function generateData(state: SimulatorInputState) {
    let {
        totalPopulation,
        infectionStartDate,
        R0,
        shutdownR0,
        mortalityRate,
        mortalityRateOverflow,
        initialNumberOfCases,
        hospitalizationRate,
        totalHospitalBeds,
        hospitalStayInWeeks } = state.controls;
    mortalityRate = mortalityRate / 100;
    mortalityRateOverflow = mortalityRateOverflow / 100;
    hospitalizationRate = hospitalizationRate / 100;

    let weeks = [new Week({
        weekStartDate: infectionStartDate,
        weekNum: 0,
        healthy: totalPopulation - initialNumberOfCases,
        newInfected: initialNumberOfCases,
        totalInfected: initialNumberOfCases,
        currentlyInfected: initialNumberOfCases,
        recovered: 0,
        dead: 0,
        hospitalized: 0
    })];
    let lastWeekNum;

    for(let i=1; i<104; i++) {
        weeks[i] = new Week();
        weeks[i].weekStartDate = addWeeks(infectionStartDate, i);
        weeks[i].weekNum = i;
        weeks[i].isShutdown = state.shutdowns.shutdownWeeks[i];
        let r = (weeks[i].isShutdown)
            ? shutdownR0 
            : R0;

        let fractionHealthy = (weeks[i-1].healthy) / totalPopulation;
        let mortality = (weeks[i-1].hospitalized < totalHospitalBeds)
            ? mortalityRate
            : weightedAverage(mortalityRate, mortalityRateOverflow,
                totalHospitalBeds, weeks[i-1].hospitalized - totalHospitalBeds);

        weeks[i].newInfected = Math.floor(weeks[i-1].newInfected * r * fractionHealthy);
        weeks[i].currentlyInfected = Math.floor(weeks[i].newInfected + weeks[i-1].newInfected
                + ((i >= 2) ? weeks[i-2].newInfected : 0));
        weeks[i].totalInfected = weeks[i-1].totalInfected + weeks[i].newInfected;

        // 3 weeks later patients either die or recover.
        if(i >= 3) {
            weeks[i].dead = Math.floor(weeks[i-1].dead + weeks[i - 3].newInfected * mortality);
            weeks[i].recovered = Math.floor(weeks[i-1].recovered + (weeks[i -3].newInfected *  ( 1 - mortality)));
        }
        if(i > 2) {
            weeks[i].hospitalized =  Math.floor(weeks[i -2].newInfected * hospitalizationRate * hospitalStayInWeeks);
        }
        weeks[i].healthy = totalPopulation - (weeks[i].currentlyInfected + weeks[i].recovered + weeks[i].dead); 

        if(weeks[i].currentlyInfected === 0 && !lastWeekNum) {
            lastWeekNum = i;
        }
    }

    return {
        lastWeekNum,
        weeks
    };
}

export function weightedAverage(p0: number, p1: number, w0: number, w1: number) {
    return ((p0 * w0) + (p1 * w1)) / (w0 + w1);
}

function isShutdown(week, shutdowns) {
    try {
        return  shutdowns.some(shutdown => isWithinInterval(week, shutdown));
    } catch {
        return false;
    }
}