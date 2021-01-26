import { Button, Container, Grid, makeStyles, Paper } from "@material-ui/core";
import firebase from "firebase";
import React from "react";
import HomeAnnouncements from "../components/HomeAnnouncements";
import HomeFriends from "../components/HomeFriends";
import HomeSchoolInfo from "../components/HomeSchoolInfo";
import QuickView from "../components/QuickView";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: "85vh",
    overflow: "auto",
    padding: theme.spacing(2),
    "& > *": {
      border: "1px red solid",
      marginTop: "1em",
    },
  },
  control: {
    padding: theme.spacing(1),
  },
}));

const HomePage = () => {
  const classes = useStyles();
  return (
    <Paper square elevation={1}>
      <Grid className={classes.root} container spacing={2}>
        <Grid item sm={6} xs={12}>
          <div className={classes.paper}>
            <h3>Left</h3>
            <QuickView />
            <HomeSchoolInfo />
            <HomeAnnouncements />
            <HomeFriends />
          </div>
        </Grid>
        <Grid item sm={6} xs={12}>
          <div className={classes.paper}>
            <h3>Right</h3>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomePage;
