import React, { useContext, useEffect } from "react";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline, makeStyles } from "@material-ui/core";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import HisnetLogin from "./components/HisnetLogin";
import AddGroup from "./components/AddGroup";
import SearchGroup from "./components/SearchGroup";
import AddNotif from "./components/AddNotif";
import Heading from "./components/Headings";
import SearchFriends from "./components/SearchFriends";
import ExamplePage from "./pages/ExamplePage";
import { userStore } from "./stores/userStore";
import Status from "./components/Status";
import AddPlan from "./components/AddPlan";
import HisnetLogin from "./components/HisnetLogin";
import UserInfo from "./components/UserInfo";

const AuthOkay = ({ children }) => {
  const [auth, loading, error] = useAuthState(firebase.auth());
  auth && auth.getIdToken().then((token) => console.log(token));

  // Auth Use Context
  const { dispatch, state } = useContext(userStore);
  useEffect(() => {
    if (!auth || loading) {
      console.log("loading");
      dispatch({
        type: "update",
        payload: {
          loading: true,
        },
      });
      return;
    }
    const unsub = firebase
      .firestore()
      .collection("users")
      .doc(auth.uid)
      .onSnapshot((docSnapshot) => {
        console.log("Snapshot Triggered");
        dispatch({
          type: "update",
          payload: { loading: false, ...docSnapshot.data() },
        });
      });
    return () => unsub();
  }, [dispatch, auth, loading]);

  auth && auth.getIdToken(false).then((token) => console.log(token));

  if (loading) return <div className="loading">Auth is Loading</div>;
  if (error) return <div className="error">Auth is Error</div>;
  if (!auth) return <Login />;
  if (Object.keys(state).length == 0) return <Status />;
  return children;
};

// Heading CSS Setting

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  // root: {
  //   display: 'flex',
  // },
  content: {
    // flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <div className="App">
      <CssBaseline />
      <AuthOkay>
        <Router>
          <Route
            render={(props) => (
              <Heading {...props} drawerWidth={drawerWidth} classes={classes} />
            )}
          />
          <Switch>
            <Route path="/mypage" exact component={UserInfo} />
            <Route path="/" exact component={HomePage} />
            <Route path="/sf" exact component={SearchFriends} />
            <Route path="/hisnetlogin" exact component={HisnetLogin} />
            <Route path="/example" exact component={ExamplePage} />
            <Route path="/addgroup" exact component={AddGroup} />
            <Route path="/group/:id" component={SearchGroup} />
            <Route path="/addnotif" exact component={AddNotif} />
          </Switch>
        </Router>
      </AuthOkay>
      <br />
      {/* <AddPlan /> */}
      {/* <HisnetLogin /> */}
    </div>
  );
};

export default App;
