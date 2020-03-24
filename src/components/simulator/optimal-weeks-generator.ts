import { ControlState } from '../controls/controls';
import { Week, weightedAverage} from './data-generator';
import { differenceInCalendarWeeks } from 'date-fns';

export function getOptimalWeeks(state: ControlState) {
    const {
        totalPopulation,
        totalHospitalBeds,
        shutdownR0,
        infectionStartDate
    } = state;

    let weeks = [new Week({
        newInfected: 1,
        totalInfected: 1,
        currentlyInfected: 1,
        healthy: totalPopulation - 1
    })];

    let shutdown = Array(104).fill(false);

    let currentWeekNum = differenceInCalendarWeeks(new Date(), infectionStartDate);

    for(let i = 1; i< 104; i++) {
        let current: Week, next: Week, next2: Week;
        current = computeNextWeek(state, false,
            weeks[i - 1], (i >= 2) ? weeks[i-2] : null, (i >= 3) ? weeks[i - 3] : null);
        next = computeNextWeek(state, true,
            current, weeks[i-1], (i >= 2) ? weeks[i-2] : null);
        next2 = computeNextWeek(state, true,
            next, current, weeks[i-1]);

        if(current.hospitalized > totalHospitalBeds ||
            next.hospitalized > totalHospitalBeds ||
            next2.hospitalized > totalHospitalBeds) {
                shutdown[i] = true;
                weeks[i] = computeNextWeek(state, shutdown[i],
                    weeks[i - 1], (i >= 2) ? weeks[i -2] : null, (i >= 3) ? weeks[i - 3] : null);
        } else {
            shutdown[i] = false;
            weeks[i] = current;
        }

        if(i === currentWeekNum && shutdownR0 <= 0.9) {
            
        }
    }

    return shutdown;
}

function computeNextWeek(state: ControlState, shutdown: boolean, prev: Week, prev2: Week, prev3: Week): Week {
    let {
        R0,
        shutdownR0,
        totalPopulation,
        totalHospitalBeds,
        mortalityRate,
        mortalityRateOverflow,
        hospitalizationRate
    } = state;
    mortalityRate = mortalityRate / 100;
    mortalityRateOverflow = mortalityRateOverflow / 100;
    hospitalizationRate = hospitalizationRate / 100;

    let result: Week = new Week();
    const r = (shutdown) ? shutdownR0 : R0;
    const fractionHealthy = prev.healthy / totalPopulation;

    // Mortality depends on how much overflow there is in the hospitals compared capacity
    let mortality = (prev.hospitalized < totalHospitalBeds) ? mortalityRate :
        weightedAverage(mortalityRate, mortalityRateOverflow,
        totalHospitalBeds, prev.hospitalized - totalHospitalBeds);
    
    result.newInfected = Math.round(prev.newInfected * r * fractionHealthy);
    // Last 2 week + current week's newly infected are still infected. 
    result.currentlyInfected = result.newInfected + prev.newInfected + ((prev2 != null) ? prev2.newInfected : 0);
    result.totalInfected = prev.totalInfected + result.newInfected;
    // 3 weeks later patients either die or recover.
    if (prev3 != null) {
        result.dead = prev.dead + prev3.newInfected * mortality;
        result.recovered = prev.recovered + (prev3.newInfected *  ( 1 - mortality));
    }
    // We are considering that patients are in hopsital in their third week.
    if (prev2 != null) {
        result.hospitalized =  prev2.newInfected * hospitalizationRate;
    } 
    result.healthy = totalPopulation - (result.currentlyInfected + result.recovered + result.dead);
    return result; 
}