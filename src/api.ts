import React from 'react';
import {default as countryStateData} from "./generated-data/country-state-data.json";
import {default as stateCodeMapping} from "./generated-data/us-country-code-data.json";

let USStateInfectedData = new Map();
let countryInfectedData = new Map();
export let USStatePopulationData = new Map();
export let countryPopulationData = new Map();
let stateCodeMap = new Map();
export const UnitedStates= "USA";

export const useInitCovidData = () => {
    let [loaded, setLoaded] = React.useState(false);
    if(loaded) {
        return loaded;
    }
    initPopulationData();
    initStateMappingCode();
    initCovidData()
        .then(() => {
            setLoaded(true);
        });
    return loaded;
};

export const getCovidData = (placeName: string) => {
    return parseInt(USStateInfectedData.get(placeName) || countryInfectedData.get(placeName) || 0);
};

export const getPopulationData = (placeName: string) => {
    return parseInt(countryPopulationData.get(placeName) || USStatePopulationData.get(placeName));
};

function initPopulationData() {
    countryStateData.forEach(value => {
         value.country != value.state
             ? USStatePopulationData.set(value.state, value.population)
             : countryPopulationData.set(value.country,value.population);
    });
}

function initStateMappingCode() {
    stateCodeMapping.forEach((value) => {
        stateCodeMap.set(value.Code, value.State);
    })

}

function initCovidData() {
    return fetch("https://cors-anywhere.herokuapp.com/https://corona-api.com/countries")
        .then(response => {
            return response.json();
        }).then(responseData => {
            console.log('covid data', responseData.data);
            let allCountryData = responseData.data;
            for(let countryData of allCountryData) {
                let latest_data = countryData.latest_data;
                countryInfectedData.set(countryData.name, latest_data.confirmed - latest_data.recovered - latest_data.deaths )
            }
            fetch("https://cors-anywhere.herokuapp.com/https://covidtracking.com/api/states")
                .then(response => {
                    return response.json();
                }).then(responseData => {
                for(let stateData of responseData) {
                    USStateInfectedData.set(stateCodeMap.get(stateData.state), stateData.positive - stateData.deaths);
                }

            });
        console.log('Done');
    }).catch(()=> {
        console.log("Error while fetching data");
    });

}
