import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Link } from "react-router-dom";
import { Grid, CircularProgress } from "@material-ui/core";
import { AlertTitle } from "@material-ui/lab";
import { userStore } from "../stores/userStore";
import "./SearchGroup.css";
import firebase from "firebase";
import axios from "axios";

const SearchGroup = props => {
  const id = props.match.params.id;
  const [user, setUser] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [groupListError, setGroupListError] = useState("");
  const [groupListError2, setGroupListError2] = useState("");
  const [groupListLoading, setGroupListLoading] = useState(false);
  const { state: userDataStore } = useContext(userStore);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setGroupListError("");
    setGroupListLoading(true);
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(token => {
        axios
          .get(`/group/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(res => setGroupList(res.data && res.data.data))
          .catch(e => {
            setGroupListError(e.response.data.error);
            setGroupList([]);
          })
          .finally(() => setGroupListLoading(false));
      });
  }, [id]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const addMember = async () => {
    const token = await firebase.auth().currentUser.getIdToken(); //토큰은 아주 많은 기능 jwt
    axios
      .post(
        `/group/${id}`,
        {
          checkGroup: userDataStore.groups,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => setUser(res.data.data))
      .catch(e => {
        setGroupListError2(e.response.data.error);
      });
    console.log(token);
    setOpen(true);
  };

  return (
    <Grid container item justify="center">
      <div>
        {groupListLoading && <CircularProgress />}
        {/* {groupList.length !== 0 ? (
          <div className={classes.root}>
            <div className="center">
              <img
                src={groupList.photo}
                width="150"
                height="150"
                alt="Avatar"
                className="round"
              />
              <h1>{groupList.name}</h1>
              <h3>{groupList.description}</h3>
              <h5>{groupList.memberCount}명 회원</h5>
              <Button variant="contained">
                <Link to="/">취소</Link>
              </Button>
              <Button variant="contained" color="primary" onClick={addMember}>
                요청
              </Button>
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert onClose={handleClose} severity="success">
                  요청 완료되었습니다.
                </Alert>
              </Snackbar>
            </div>
          </div>
        ) : (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            <strong>
              데이터를 찾을 수가 없습니다. — 주소를 다시 확인해주세요.
            </strong>
          </Alert>
        )} */}
        {groupListError ? (
          <div>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              <strong>{groupListError}</strong>
            </Alert>
          </div>
        ) : (
          <div className={classes.root}>
            <div className="center">
              <img
                src={groupList.photoURL}
                width="150"
                height="150"
                alt="Avatar"
                className="round"
              />
              <h1>{groupList.name}</h1>
              <h3>{groupList.description}</h3>
              <h5>{groupList.memberCount}명 회원</h5>
              <Button variant="contained">
                <Link to="/">취소</Link>
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={groupListLoading}
                onClick={addMember}
              >
                요청
              </Button>
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={
                  <Alert onClose={handleClose} severity="success">
                    요청이 완료되었습니다!
                  </Alert>
                }
              ></Snackbar>
              {/* <Snackbar
                open={false}
                autoHideDuration={6000}
                onClose={handleClose}
              > */}
              {/* <Alert onClose={handleClose} severity="success">
                요청 완료되었습니다.
              </Alert> */}
              {/* </Snackbar> */}
              {/* {groupListError2 ? (
                <div>
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    <strong>{groupListError2}</strong>
                  </Alert>
                </div>
              ) : (
                
              )} */}
            </div>
          </div>
        )}
      </div>
    </Grid>
  );
};

export default SearchGroup;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(4),
      margin: theme.spacing(1),
    },
    button: {
      marginLeft: theme.spacing(1),
    },
  },
}));
