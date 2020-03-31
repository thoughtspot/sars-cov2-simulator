import React from 'react';
import {stateData} from "./components/grouped-select/usa-state-population-data";
import {countryData} from "./components/grouped-select/country-population-data";

let USStateInfectedData = new Map();
let countryInfectedData = new Map();
let USStatePopulationData = new Map();
let countryPopulationData = new Map();

export const useInitCovidData = () => {
    let [loaded, setLoaded] = React.useState(false);
    if(loaded) {
        return loaded;
    }
    initPopulationData();
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
    stateData.forEach(value => USStatePopulationData.set(value.State, value.Population));
    countryData.forEach(value => countryPopulationData.set(value.Country,value.Population));
}

function initCovidData() {
    return fetch("https://cors-anywhere.herokuapp.com/https://bing.com/covid/data")
        .then(response => {
            return response.json();
        }).then(data => {
        console.log('covid data', data);
        let areas = data.areas;
        let USData;
        // This will get me the countries
        for(let area of areas){
            if(area.displayName == "United States"){
                USData = area.areas;
            }
            countryInfectedData.set(area.displayName, (area.totalConfirmed - area.totalDeaths - area.totalRecovered))
        }
        console.log('Country data', countryInfectedData.toString());
        for(let stateData of USData){
            USStateInfectedData.set(stateData.displayName, (stateData.totalConfirmed - stateData.totalDeaths - stateData.totalRecovered))
        }
        console.log('Done');
    }).catch(()=> {
        console.log("Error while fetching data");
    });

}
