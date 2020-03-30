const icuData = require('./icu-data.json');

let icuStateData = icuData.reduce((stateData, point) => {
    stateData[point.State] = stateData[point.State] || 0;
    
    stateData[point.State] += Number(point['ICU Beds']);
    return stateData;
}, {});

Object.entries(icuStateData).forEach(([key, val]) => {
    console.log(`${key},${val}`);
})
//console.log(icuStateData);