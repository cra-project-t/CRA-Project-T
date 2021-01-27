import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button, Container, Grid, makeStyles, Paper } from "@material-ui/core";
import firebase from "firebase";
import React from "react";
import HomeAddActionIcon from "../components/HomeAddActionIcon";
import HomeAnnouncements from "../components/HomeAnnouncements";
import HomeFriends from "../components/HomeFriends";
import HomeSchoolInfo from "../components/HomeSchoolInfo";
import QuickView from "../components/QuickView";
import "../tools/weekNumber";

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
      <HomeAddActionIcon />
      <Grid className={classes.root} container spacing={2}>
        <Grid item sm={6} xs={12}>
          <div className={classes.paper}>
            <QuickView />
            <HomeSchoolInfo />
            <HomeAnnouncements />
            <HomeFriends />
          </div>
        </Grid>
        <Grid item sm={6} xs={12}>
          <div className={classes.paper}>
            <FullCalendar
              height="80vh"
              time
              plugins={[timeGridPlugin]}
              nowIndicator
              weekNumbers
              weekNumberCalculation={(date) => {
                return date.getWeek() - 8;
              }}
              initialView={"timeGridThreeDay"}
              views={{
                timeGridThreeDay: {
                  type: "timeGrid",
                  duration: { days: 3 },
                  buttonText: "3 day",
                },
              }}
              // initialView="dayGridMonth"
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomePage;
