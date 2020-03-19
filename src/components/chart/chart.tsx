import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(4),
      width: '100%'
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    chartContainer: {
        height: '100%'
    }
  }),
);

interface Props {
    config: any;
}

export const Chart: React.FC<Props> = ({ config }) => {
    const classes = useStyles();

    return <Paper elevation={3} className={classes.root}>
        <HighchartsReact
            containerProps = {{ className: classes.chartContainer }}
            highcharts={Highcharts}
            options={config}
        />
    </Paper>;
}