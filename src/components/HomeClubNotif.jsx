import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
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
import { Divider } from "@material-ui/core";

const HomeClubNotif = () => {
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
          const dataPromises = []; // promise 비동기라 loop돌릴 때 오류 가끔씩=> Promise.all사용
          userDataStore.groups.map(group => {
            dataPromises.push(
              axios.get(`/notif/${group}/show/announce`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }) //get으로 받은 Promise를 배열안에 다 넣어버린다.
            );
          });
          // 시작할때는 [promise, promise, promise];
          // promise.all 을 해주면 [then 을 한 값, 즉 doc, doc, doc];
          Promise.all(dataPromises).then(datas => {
            // Promise.all이 모여있는 모든 배열에 요청해서(resolve) 결과물을 담아서 넘겨줌
            const allData = datas.reduce(
              // doc.data.data
              (prev, curr) => {
                console.log(prev);
                console.log(curr.data.data);
                return prev.concat(curr.data.data);
              },
              []
            );
            console.log(allData);
            setNotif(allData);
          });
        });
    };
    fetchData();
  }, []);

  console.log(userDataStore.groups);
  console.log(notifListError);
  console.log(notif);
  return (
    <div className={classes.root}>
      {/* <FormGroup row>
        <FormControlLabel
          fullWidth
          control={
            <Checkbox
              checked={dense}
              onChange={event => setDense(event.target.checked)}
            />
          }
          label="Enable dense"
        />
      </FormGroup> */}
      <br />
      {notifListError && (
        <div>
          <Alert severity="error">{notifListError}</Alert>
        </div>
      )}
      <Grid container spacing={2} fullWidth>
        <Grid item fullWidth>
          <div className={classes.demo}>
            <List dense>
              {notif.map(data => (
                <>
                  <ListItem key={data._id}>
                    <ListItemText primary={data.announceName} />
                  </ListItem>
                  <Divider />
                </>
              ))}{" "}
              {/*promise map 사용 잘못된 예시*/}
              {/* //1. 배열풀어주기: data에 map한번 더=>비효율적 */}
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
    //maxWidth: 752,
    width: "100%",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

// function generate(element) {
//   return [0, 1, 2].map(value =>
//     React.cloneElement(element, {
//       key: value,
//     })
//   );
// } //더미 데이터
