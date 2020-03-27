import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Slider as MaterialSlider, SliderProps as MaterialSliderProps} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import { Grid } from '@material-ui/core';
import './slider.css';

interface SliderProps {
    title: string;
    percent?: boolean;
    onChange: (name: string, value: number) => void;
    tooltip?: string;
}

const useStyles = makeStyles({
    slider: {
      width: 150,
    },
  });
  

export const Slider: React.FC<SliderProps & Omit<MaterialSliderProps, 'onChange'>> = ({title, onChange, percent = false, tooltip, ...props}) => {
    const classes = useStyles()

    const getValue = (value: number | undefined) => {
        if(value === undefined) {
            return '';
        }

        if(percent) {
            return `${value}%`;
        }
        return value;
    }

    const onSliderChange = (event, value?) => {
        onChange(props.name, value);
    }

    return (
        <Grid container direction="column" alignItems="flex-start" spacing={0}>
            <Tooltip title={tooltip} placement="right">
                <Grid item container direction="row" spacing={1} alignItems="center">
                    <Grid item>
                        <Typography>
                            {getValue(props.min)}
                        </Typography>
                    </Grid>
                    <Grid item className={classes.slider}>
                        <MaterialSlider
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="on"
                            valueLabelFormat={getValue}
                            onChangeCommitted={onSliderChange}
                            {...props}
                        />
                    </Grid>
                    <Grid>
                        <Typography>
                            {getValue(props.max)}
                        </Typography>
                    </Grid>
                    
                </Grid>
            </Tooltip>

            <Grid item>
                <Typography id="discrete-slider" variant="caption">
                    {title}
                </Typography>
            </Grid>
        </Grid>
    )
}