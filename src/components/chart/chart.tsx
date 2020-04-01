import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { isMobile } from '../../services/viewport-service';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    chartContainer: {
        height: (isMobile()) ? 400 : 700,
        zoom: (isMobile()) ? 0.8 : 1,
    }
  }),
);

interface Props {
    config: any;
}

export const Chart: React.FC<Props> = ({ config }) => {
    const classes = useStyles();

    return <HighchartsReact
            containerProps = {{ className: classes.chartContainer }}
            highcharts={Highcharts}
            options={config}
      />;
}