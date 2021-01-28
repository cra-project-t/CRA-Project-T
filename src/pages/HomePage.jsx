import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Grid, makeStyles, Paper } from "@material-ui/core";
import firebase from "firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import React, { useState } from "react";
import HomeAddActionIcon from "../components/HomeAddActionIcon";
import HomeAnnouncements from "../components/HomeAnnouncements";
import HomeFriends from "../components/HomeFriends";
import HomeSchoolInfo from "../components/HomeSchoolInfo";
import QuickView from "../components/QuickView";
import "../tools/weekNumber";
import AddEvent from "../components/AddEvent";

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
  const [openNewEvent, setOpenNewEvent] = useState(false);
  const [events, loading] = useCollection(
    firebase
      .firestore()
      .collection("calendars")
      .doc("IQWkcBUvw06jseGNWWoA")
      .collection("events"),
    // .where("author", "==", firebaseApp.auth().currentUser.uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  if (loading || !events) {
    return <div>Loading</div>;
  }
  events && console.log(events.docs);
  return (
    <Paper square elevation={1}>
      {openNewEvent && <AddEvent setOpenNewEvent={setOpenNewEvent} />}
      <HomeAddActionIcon setOpenNewEvent={setOpenNewEvent} />
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
              events={
                events.docs.map((doc) => {
                  return {
                    title: doc.data().eventName,
                    start: doc.data().startTime.toDate(),
                    end: doc.data().endTime.toDate(),
                    allDay: doc.data().allDay,
                  };
                })
                //   [
                //   {
                //     title: "IT 캠프",
                //     start: "2021-01-28T10:00:00",
                //     allDay: false, // will make the time show
                //   },
                // ]
              }
              // eventSources={[
              //   {
              //     events: {
              //       title: "event1",
              //       start: "2021-01-28",
              //     },
              //   },
              // ]}
              // initialView="dayGridMonth"
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HomePage;
