import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';


interface Props {
    title: string;
    value: string;
    tooltip: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        padding: theme.spacing(2),
        paddingRight: theme.spacing(4),
        flexGrow: 1
    },
    marginBottom: {
        marginBottom: theme.spacing(2)
    },
    marginTop: {
        marginTop: theme.spacing(2)
    },
    marginLeft: {
        marginLeft: theme.spacing(2)
    },
    marginLeftAuto: {
        marginLeft: 'auto'
    }
  }),
);

export const Headline: React.FC<Props> = ({ title, value, tooltip }) => {
    const classes = useStyles();

    return <Paper className={classes.root} elevation={3}>
        <Tooltip title={tooltip}>
            <Grid container direction="column" alignItems="flex-start" spacing={3}>
                <Grid item>
                    <Typography variant="body1">{title}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h5">{value}</Typography>
                </Grid>
            </Grid>
        </Tooltip>
    </Paper>
}