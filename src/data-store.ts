import React from 'react';
import {default as countryStateData} from "./generated-data/country-state-data.json";
import {default as stateCodeMapping} from "./generated-data/us-country-code-data.json";
import {default as countryApiMapping} from "./generated-data/country-api-mapping.json"

let USStateInfectedData = new Map();
let countryInfectedData = new Map();
export let USStateData = new Map();
export let countryData = new Map();
let timeLineData = new Map();
let stateCodeMap = new Map();
let countryNameApiMapping = new Map();
let countryCodeMapping = new Map();
export const UnitedStates= "USA";

export const useInitCovidData = () => {
    let [loaded, setLoaded] = React.useState(false);
    if(loaded) {
        return loaded;
    }
    initData();
    initStateMappingCode();
    initCountryNameApiMapping();
    initCovidData()
        .then(() => {
            setLoaded(true);
        });
    return loaded;
};

export const getCovidData = (placeName: string) => {
    let newPlaceName = countryNameApiMapping.has(placeName)
        ? countryNameApiMapping.get(placeName)
        : placeName;
    if(!timeLineData.has(newPlaceName)) {
        countryTimeLineCB(newPlaceName);
    }
    return parseInt(USStateInfectedData.get(newPlaceName)
        || countryInfectedData.get(newPlaceName)
        || 0);
};

export const getDemographicsData = (placeName: string) => {
    return countryData.get(placeName) || USStateData.get(placeName);
};

export const getCovidDataForDate = (placeName: string,
                                    date: string) => {
    return timeLineData.has(placeName)
        ? timeLineData.get(placeName).date
        : {};
};

export const countryTimeLineCB  = (countryName) => {
    getCountrySpecificData(countryCodeMapping.get(countryName))
        .catch(() => console.log(`Error while getting data for ${countryName}`));
};

function initData() {
    countryStateData.forEach(value => {
         value.country != value.state
             ? USStateData.set(value.state, {
                 population: value.population,
                 hospitalBeds: value.hospitalBeds,
                 icuBeds: value.icuBeds
             })
             : countryData.set(value.country,{
                 population: value.population,
                 hospitalBeds: value.hospitalBeds,
                 icuBeds: value.icuBeds
             });
    });
}

function initStateMappingCode() {
    stateCodeMapping.forEach((value) => {
        stateCodeMap.set(value.Code, value.State);
        timeLineData.set(value.State, {});
    })
}

function initCountryNameApiMapping () {
    countryApiMapping.forEach(value => countryNameApiMapping.set(value.Country_Name, value.Api_Mapping));
}

async function initStateCovidData() {
    let resp = await fetch("https://cors-anywhere.herokuapp.com/https://covidtracking.com/api/states/daily");
    let responseData = await resp.json();
    let today = responseData[0].dateChecked.split('T')[0];
    let stateName;
    let timeLine;
    for(let stateData of responseData) {
        stateName = stateCodeMap.get(stateData.state);
        if(stateName) {
            stateData.death = stateData.death==null? 0: stateData.death;
            stateData.dateChecked = stateData.dateChecked.split('T')[0];

            if (stateData.dateChecked ==  today) {
                USStateInfectedData.set(stateName, stateData.positive - stateData.death);
            } else if(stateData.dateChecked > today) {
                today = stateData.dateChecked;
                USStateInfectedData = new Map();
                USStateInfectedData.set(stateName, stateData.positive - stateData.death);
            }
            timeLine = timeLineData.get(stateName);
            timeLine[stateData.dateChecked] = {
                active: stateData.positive,
                deaths: stateData.death
            };
            timeLineData.set(stateName, timeLine);
        }
    }
}

async function initCountryCovidData() {
    let resp = await fetch('https://cors-anywhere.herokuapp.com/https://corona-api.com/countries');
    let responseData = await resp.json();
    let allCountryData = responseData.data;
    for(let countryData of allCountryData) {
        let latest_data = countryData.latest_data;
        countryInfectedData.set(countryData.name, latest_data.confirmed - latest_data.recovered - latest_data.deaths );
        countryCodeMapping.set(countryData.name, countryData.code);
    }
}

async function getCountrySpecificData(countryCode :string) {
    let resp = await fetch(`https://cors-anywhere.herokuapp.com/https://corona-api.com/countries/${countryCode}`);
    let responseData = await resp.json();
    let countryName = responseData.data.name;
    let countryTimelineData = responseData.data.timeline;
    let timeLine ={};

    for(let dailyData of countryTimelineData) {
        timeLine[dailyData.date] = {
            active: dailyData.active,
            deaths: dailyData.deaths
        }
    }
    timeLineData.set(countryName, timeLine);
}


function initCovidData() {
    return Promise.all([
        initStateCovidData(),
        initCountryCovidData(),
        getCountrySpecificData("US")
    ]).then(() => {
        console.log('Done');
    }).catch((error)=> {
        console.log("Error while fetching data");
    });

}
