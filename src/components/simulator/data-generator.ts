import { addWeeks, isWithinInterval } from 'date-fns';
import { ControlState } from '../controls/controls';
import { ShutdownRangeState } from '../shudown-range/shutdown-range';

export interface SimulatorInputState {
    controls: ControlState;
    shutdowns: ShutdownRangeState;
}

export function generateData(state: SimulatorInputState) {
    let {
        totalPopulation,
        infectionStartDate,
        R0,
        shutdownR0,
        mortalityRate,
        mortalityRateOverflow,
        hospitalizationRate,
        totalHospitalBeds } = state.controls;

    let data = [{
        week: infectionStartDate,
        weekNum: 0,
        healthy: totalPopulation - 1,
        newInfected: 1,
        totalInfected: 1,
        currentlyInfected: 1,
        recovered: 0,
        dead: 0,
        hospitalized: 0,
        movingMortalityRate: mortalityRate
    }];

    for(let i=1;i<100;i++) {
        let week = addWeeks(infectionStartDate, i);
        let multiplier = (isShutdown(week, state.shutdowns))
         ? shutdownR0 
         : R0;
        let previous = data[i-1];
        let previousPrevious = data[i-2];
        let pppNewInfected = data[i-3]?.newInfected || 0;
        let pppcurrentlyInfected = data[i-3]?.currentlyInfected || 0;

        let newInfected = Math.round((previous.healthy/totalPopulation)*previous.newInfected*multiplier);
        let totalInfected = previous.totalInfected + newInfected;
        let currentlyInfected = newInfected + previous.newInfected + (previousPrevious?.newInfected || 0);
        let recovered = Math.round((1 - (previous.movingMortalityRate/100))*pppNewInfected) + previous.recovered;
        let dead = Math.round(pppNewInfected * previous.movingMortalityRate/100) + previous.dead;
        let hospitalized = Math.round(pppcurrentlyInfected * hospitalizationRate/100);
        let movingMortalityRate = (hospitalized < totalHospitalBeds)
            ? mortalityRate
            : (mortalityRateOverflow*(hospitalized - totalHospitalBeds) + mortalityRate*totalHospitalBeds)/hospitalized;
        let healthy = totalPopulation - currentlyInfected - recovered - dead;

        data[i] = {
            week,
            weekNum: i,
            newInfected,
            totalInfected,
            currentlyInfected,
            recovered,
            dead,
            hospitalized,
            movingMortalityRate,
            healthy
        }
    }

    return data;
}

function isShutdown(week, shutdowns) {
    try {
        return  shutdowns.some(shutdown => isWithinInterval(week, shutdown));
    } catch {
        return false;
    }
}