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
import Switch from '@material-ui/core/Switch';
import { Paper, Typography } from '@material-ui/core';

import DateFnsUtils from '@date-io/date-fns';
import { Headline } from '../headline/headline';
import { isMobile } from '../../services/viewport-service';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    leftPanel: {
        flex: (isMobile()) ? `1 1 300px` : `0 0 300px`
    },
    grow: {
        flexGrow: 1,
        flexBasis: 0,
        minHeight: 0
    },
    contentContainer: {
        flex: '1 0 0',
        height: (isMobile()) ? 390 : 824,
    },
    content: {
        padding: (isMobile()) ? 0 : theme.spacing(4),
        flex: '1 1 0',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column'
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    },
    noMobile: {
        display: (isMobile()) ? `none`: 'initial'
    }
  }),
);

const TABLE_COLUMNS = ['weekNum', 'healthy', 'newInfected', 'totalInfected', 'currentlyInfected', 'dead', 'hospitalized'];
const initialShutdownWeeks = Array(104).fill(false);
for(let i = 0;i<16;i++) {
    initialShutdownWeeks[i] = true;
}

export const Simulator: React.FC = () => {
    const classes = useStyles();
    const [
        state, 
        {config, weeks, weeksToGo, maxICUBeds},
        onControlChange, 
        onShutdownChange] = useGenerateConfig();
    const [optimalWeeks, setOptimalWeeks] = React.useState<boolean[]>(initialShutdownWeeks);
    const [isTableView, setIsTableView] = React.useState(false);
    const [doNotOptimize, setDoNotOptimize] = React.useState(true);

    const computeOptimalWeeks = () => {
        setOptimalWeeks(getOptimalWeeks(state.controls));
    }

    React.useEffect(() => {
        if(doNotOptimize) {
            return;
        }

        setOptimalWeeks(getOptimalWeeks(state.controls));
    }, [state.controls])

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2} direction='row'>
                <Grid item className={classes.leftPanel}>
                    <Controls onChange={onControlChange}></Controls>
                </Grid>
                <Grid container item direction="column" className={classes.grow} spacing={2}>
                    <Grid item className={classes.noMobile}>
                        <ShutdownRange
                            shutdownWeeks={optimalWeeks}
                            startDate={state.controls.infectionStartDate}
                            computeOptimalWeeks={computeOptimalWeeks}
                            onDoNotOptimizeToggle={setDoNotOptimize}
                            onChange={onShutdownChange}></ShutdownRange>
                    </Grid>
                    <Grid item container
                        direction="row"  spacing={2}>
                        <Grid item className={classes.grow}> 
                            <Headline title="Total Shutdown"
                                tooltip="Total number of weeks of shutdown"
                                value={`${getNumShutdownWeeks(state.shutdowns.shutdownWeeks)} weeks`}></Headline>
                        </Grid>
                        <Grid item className={classes.grow}> 
                            <Headline 
                                tooltip="Number of weeks to complete irradication of coronavirus."
                                title="Time before the virus dies" value={(!isNaN(weeksToGo)) ? `${weeksToGo} weeks` : `> 2 years`}></Headline>
                        </Grid>
                        <Grid item className={classes.grow}>
                            <Headline title="Approximate Deaths"
                                 tooltip="Number of people expected to die due to the Virus."
                                 value={shortNum(weeks[weeks.length - 1].dead)}></Headline>
                        </Grid>
                        <Grid item className={classes.grow}>
                            <Headline title="ICU Bed shortage"
                                 color="secondary"
                                 tooltip="Number of beds short in the ICU to support the pandemic."
                                 value={shortNum(maxICUBeds - state.controls.totalICUBeds)}></Headline>
                        </Grid>
                    </Grid>
                    <Grid item container direction="column" className={classes.contentContainer}>
                        <Paper elevation={3} className={classes.content}>
                            <Grid container direction="column" wrap="nowrap" className={classes.grow}>
                                <Grid item style={{ marginLeft: 'auto'}}>
                                    <Typography variant="caption">Table View</Typography>
                                    <Switch color="primary" id='switcher' checked={isTableView} onChange={() => setIsTableView(!isTableView)}></Switch>
                                </Grid>
                                <Grid item className={classes.grow} style={{ display: 'flex', flexDirection: 'column', maxWidth: '100vw'}}>
                                    {(isTableView) ? <Table
                                        columns={TABLE_COLUMNS} 
                                        data={weeks}></Table>
                                        : <Chart config={config}></Chart>}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </MuiPickersUtilsProvider>
    )
}