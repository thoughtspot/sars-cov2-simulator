import React from 'react';
import 'date-fns';
import { Grid } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {Controls} from '../controls/controls';
import {Chart} from '../chart/chart';
import {ShutdownRange} from '../shudown-range/shutdown-range';
import {useGenerateConfig} from './use-generate-config';
import {
    MuiPickersUtilsProvider,
 } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
        flexGrow: 1,
        flexBasis: 'auto',
        display: 'flex'
    },
    header: {
        marginBottom: theme.spacing(2)
    }
  }),
);

export const Simulator: React.FC = () => {
    const classes = useStyles();
    const [config, onControlChange, onShutdownChange] = useGenerateConfig();

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2} direction='row'>
                <Grid item>
                    <Controls onChange={onControlChange}></Controls>
                </Grid>
                <Grid item direction="column" className={classes.content} spacing={2}>
                    <Grid item className={classes.header}>
                        <ShutdownRange onChange={onShutdownChange}></ShutdownRange>
                    </Grid>
                    <Grid item className={classes.content}>
                        <Chart config={config}></Chart>
                    </Grid>
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
    )
}