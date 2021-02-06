import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import firebase from "firebase";
import axios from "axios";
import { userStore } from "../stores/userStore";

const HomeClubNotif = id => {
  const classes = useStyles();
  const [dense, setDense] = useState(false);
  const { state: userDataStore } = useContext(userStore);
  const [notif, setNotif] = useState([]);
  const [notifListError, setNotifListError] = useState("");
  const [notifListLoading, setNotifListLoading] = useState(false);

  useEffect(() => {
    setNotifListError("");
    setNotifListLoading(true);
    const fetchData = async () => {
      const token = await firebase.auth().currentUser.getIdToken();
      console.log(token);
      firebase
        .auth()
        .currentUser.getIdToken()
        .then(token => {
          userDataStore.groups.map(group => {
            axios
              .get(`/notif/${group}/show/announce`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then(res => setNotif([...notif, res.data.data]))
              .catch(e =>
                setNotifListError(e.response && e.response.data.error)
              )
              .finally(() => setNotifListLoading(false));
          });
        });
    };
    fetchData();
  }, [userDataStore.groups]);

  console.log(userDataStore.groups);
  console.log(notifListError);
  console.log(notif);
  return (
    <div className={classes.root}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={dense}
              onChange={event => setDense(event.target.checked)}
            />
          }
          label="Enable dense"
        />
      </FormGroup>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={classes.demo}>
            <List dense={dense}>
              {generate(
                <ListItem>
                  {userDataStore.groups.map(group => (
                    <React.Fragment key={group}>
                      {notif.map(data => (
                        <React.Fragment key={data._id}>
                          {console.log(data.announceName)}
                          <ListItemText
                            primary={(data.announceName, data.created)} //undefined=>출력 모름(애초에 map 중복 가능?)
                          />
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </ListItem>
              )}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomeClubNotif;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    })
  );
}
