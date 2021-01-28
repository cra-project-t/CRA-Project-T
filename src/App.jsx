import React from "react";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline, makeStyles } from "@material-ui/core";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import HisnetLogin from "./components/HisnetLogin";
import AddGroup from "./components/AddGroup";
import SearchGroup from "./components/SearchGroup";
import Heading from "./components/Headings";

const AuthOkay = ({ children }) => {
  const [auth, loading, error] = useAuthState(firebase.auth());

  if (loading) return <div className="loading">Auth is Loading</div>;
  if (error) return <div className="error">Auth is Error</div>;
  if (!auth) return <Login />;
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
            <Route path="/" exact component={HomePage} />
            <Route path="/hisnetlogin" exact component={HisnetLogin} />
            <Route path="/addgroup" exact component={AddGroup} />
            <Route path="/group/:id" component={SearchGroup} />
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
