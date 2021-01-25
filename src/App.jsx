import React from "react";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import AddPlan from "./components/AddPlan";
import HisnetLogin from "./components/HisnetLogin";
import AddGroup from "./components/AddGroup";
import SearchGroup from "./components/SearchGroup";

const AuthOkay = ({ children }) => {
  const [auth, loading, error] = useAuthState(firebase.auth());
  auth && auth.getIdToken().then((token) => console.log(token));

  if (loading) return <div className="loading">Auth is Loading</div>;
  if (error) return <div className="error">Auth is Error</div>;
  if (!auth) return <Login />;
  return children;
};
const App = () => {
  return (
    <div className="App">
      <CssBaseline />
      <AuthOkay>
        <Router>
          <Switch>
            {/* <Route path="/pho" exact component={PhoneAuth} />
              <Route path="/add" exact component={EditPurchase} />
              <Route path="/data" exact component={ViewData} />
              <Route path="/:engName" exact component={LookUpForm} />
              <Route path="/:engName/edit" exact component={EditPurchase} /> */}
            <Route path="/" exact component={HomePage} />
            <Route path="/addplan" exact component={AddPlan} />
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
