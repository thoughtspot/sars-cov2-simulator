import React from 'react';
import 'date-fns';
import { Grid } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {Controls} from '../controls/controls';
import {Chart} from '../chart/chart';
import { Table } from '../table/table';
import {ShutdownRange, getNumShutdownWeeks} from '../shudown-range/shutdown-range';
import {useGenerateConfig} from './use-generate-config';
import {getOptimalWeeks} from './optimal-weeks-generator';
import {
    MuiPickersUtilsProvider,
 } from '@material-ui/pickers';
import shortNum from 'short-number';
import DateFnsUtils from '@date-io/date-fns';
import { Headline } from '../headline/headline';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
        flexGrow: 1,
        flexBasis: 0,
        display: 'flex'
    },
    content: {
        flex: '0 0 700px',
        minHeight: 0,
        display: 'flex',
        marginBottom: theme.spacing(2)
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    }
  }),
);

const TABLE_COLUMNS = ['weekNum', 'healthy', 'newInfected', 'totalInfected', 'currentlyInfected', 'dead', 'hospitalized'];

export const Simulator: React.FC = () => {
    const classes = useStyles();
    const [
        state, 
        {config, weeks, weeksToGo},
        onControlChange, 
        onShutdownChange] = useGenerateConfig();
    const [optimalWeeks, setOptimalWeeks] = React.useState<boolean[]>();

    const computeOptimalWeeks = () => {
        setOptimalWeeks(getOptimalWeeks(state.controls));
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2} direction='row'>
                <Grid item>
                    <Controls onChange={onControlChange}></Controls>
                </Grid>
                <Grid item direction="column" className={classes.grow} spacing={2}>
                    <Grid item className={classes.marginBottom}>
                        <ShutdownRange
                            shutdownWeeks={optimalWeeks}
                            startDate={state.controls.infectionStartDate}
                            computeOptimalWeeks={computeOptimalWeeks}
                            onChange={onShutdownChange}></ShutdownRange>
                    </Grid>
                    <Grid item container
                        direction="row" className={classes.marginBottom} spacing={2}>
                        <Grid item className={classes.grow}> 
                            <Headline title="Total Shutdown" value={`${getNumShutdownWeeks(state.shutdowns)} weeks`}></Headline>
                        </Grid>
                        <Grid item className={classes.grow}> 
                            <Headline title="Time before we play" value={`${weeksToGo} weeks`}></Headline>
                        </Grid>
                        <Grid item className={classes.grow}>
                            <Headline title="Deaths" value={shortNum(weeks[weeks.length - 1].dead)}></Headline>
                        </Grid>
                    </Grid>
                    <Grid item className={classes.content}>
                        <Chart config={config}></Chart>
                    </Grid>
                    <Grid item className={classes.content}>
                        <Table
                            columns={TABLE_COLUMNS} 
                            data={weeks}></Table>
                    </Grid>
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
    )
}