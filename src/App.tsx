import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import GitHubIcon from '@material-ui/icons/GitHub';
import Tooltip from '@material-ui/core/Tooltip';
import qs from 'query-string';
import './App.css';

import {Simulator} from './components/simulator/simulator';
import { Container } from '@material-ui/core';
import {useInitCovidData} from "./api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    container: {
      paddingTop: theme.spacing(2)
    }
  }),
);
const urlParams = qs.parse(window.location.search);

function App() {
  const classes = useStyles();
  const covidDataLoaded = useInitCovidData();
  const isEmbed = !!urlParams.embed;

  return (
    <div className="App">
      {!isEmbed && <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            COVID Simulator
          </Typography>
          <Tooltip title="Source code">
            <IconButton edge="end" className={classes.menuButton} 
              onClick={()=> window.open("https://github.com/thoughtspot/sars-cov2-simulator", "_blank")}
              color="inherit" aria-label="code">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
          
        </Toolbar>
      </AppBar>}
      <Container maxWidth='lg' className={classes.container}>
          {(covidDataLoaded) ? <Simulator /> : <div>Loading ...</div>}
      </Container>
    </div>
  );
}

export default App;
