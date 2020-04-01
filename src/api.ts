import React from 'react';
import {default as countryStateData} from "./generated-data/country-state-data.json";
import {default as stateCodeMapping} from "./generated-data/us-country-code-data.json";
import {default as countryApiMapping} from "./generated-data/country-api-mapping.json"

let USStateInfectedData = new Map();
let countryInfectedData = new Map();
export let USStateData = new Map();
export let countryData = new Map();
let stateCodeMap = new Map();
let countryNameApiMapping = new Map();
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
    return parseInt(USStateInfectedData.get(newPlaceName)
        || countryInfectedData.get(newPlaceName)
        || 0);
};

export const getDemographicsData = (placeName: string) => {
    return countryData.get(placeName) || USStateData.get(placeName);
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
    })
}

function initCountryNameApiMapping () {
    countryApiMapping.forEach(value => countryNameApiMapping.set(value.Country_Name, value.Api_Mapping));
}

async function initStateCovidData() {
    let resp = await fetch("https://cors-anywhere.herokuapp.com/https://covidtracking.com/api/states");
    let responseData = await resp.json();
    for(let stateData of responseData) {
        USStateInfectedData.set(stateCodeMap.get(stateData.state), stateData.positive - stateData.death);
    }
}

async function initCountryCovidData() {
    let resp = await fetch('https://cors-anywhere.herokuapp.com/https://corona-api.com/countries');
    let responseData = await resp.json();
    let allCountryData = responseData.data;
    for(let countryData of allCountryData) {
        let latest_data = countryData.latest_data;
        countryInfectedData.set(countryData.name, latest_data.confirmed - latest_data.recovered - latest_data.deaths )
    }
}


function initCovidData() {
    return Promise.all([
        initStateCovidData(),
        initCountryCovidData()
    ]).then(() => {
        console.log('Done');
    }).catch(()=> {
        console.log("Error while fetching data");
    });

}
