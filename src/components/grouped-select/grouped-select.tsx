import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {stateData} from "./usa-state-population-data";
import {countryData} from "./country-population-data";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            minWidth: 120,
        },
    }),
);

export default function GroupedSelect(props) {
    const classes = useStyles();

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel>{props.label}</InputLabel>
                <Select native defaultValue={countryData[0].Country} onChange={props.onChange}>
                    <option value={countryData[0].Country}>{countryData[0].Country}</option>
                    <optgroup label="States in USA">
                        {
                            stateData.map((data, index) => {
                               return <option value={data.State}>{data.State}</option>
                            })
                        }
                    </optgroup>
                    <optgroup label="Countries">
                        {
                            countryData.map((data, index) => {
                                return <option value={data.Country}>{data.Country}</option>
                            })
                        }
                    </optgroup>
                </Select>
            </FormControl>
        </div>
    );
}
