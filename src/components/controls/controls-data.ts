export const sliders = [
    {
        title: 'Average spread (R0)',
        name: 'R0',
        min: 0,
        max: 3.0,
        step: 0.1,
        defaultValue: 2.2,
        tooltip: 'Average number of people a single person infects.'
    },
    {
        title: 'Average spread shutdown (R0)',
        name: 'shutdownR0',
        min: 0,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.05,
        tooltip: 'Average number of people a single person infects\n when we are in a shutdown.'
    },
    {
        title: 'Mortality Rate',
        name: 'mortalityRate',
        min: 0,
        max: 5.0,
        step: 0.1,
        defaultValue: 0.5,
        percent: true,
        tooltip: 'Percentage of people who die due to the disease.'
    },
    {
        title: 'Mortality Rate Overflow',
        name: 'mortalityRateOverflow',
        min: 0,
        max: 7.0,
        step: 0.5,
        defaultValue: 3.0,
        percent: true,
        tooltip: 'Percentage of people who die due to the disease, when the medical system is over stressed.'
    },
    {
        title: 'Hospitalization Rate',
        name: 'hospitalizationRate',
        min: 0,
        max: 25,
        step: 1,
        defaultValue: 15,
        percent: true,
        tooltip: 'Percentage of people who need hospitalization.'
    },
    {
        title: 'Hospital stay in weeks',
        name: 'hospitalStayInWeeks',
        min: 0,
        max: 2,
        step: 0.1,
        defaultValue: 0.3,
        tooltip: 'Number of weeks a patient needs to stay in the hospital for.'
    }
];