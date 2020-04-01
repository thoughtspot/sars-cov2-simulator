import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {
    countryData,
    UnitedStates,
    USStateData
} from "../../data-store";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            minWidth: 120,
        },
    }),
);

export default function RegionSelect(props) {
    const classes = useStyles();

    const createRegionData = (regionMap) => {
        let regionArray = [];
        regionMap.forEach((value, key) => {
            regionArray.push(<option value={key}>{key}</option>);
        });
        return regionArray;
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel>{props.label}</InputLabel>
                <Select native defaultValue="United States" onChange={props.onChange}>
                    <option value={UnitedStates}>{UnitedStates}</option>
                    <optgroup label="States in USA">
                        {createRegionData(USStateData)}
                    </optgroup>
                    <optgroup label="Countries">
                        {createRegionData(countryData)}
                    </optgroup>
                </Select>
            </FormControl>
        </div>
    );
}
