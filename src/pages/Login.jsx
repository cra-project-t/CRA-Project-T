import { Button } from "@material-ui/core";
// import { ChangeHistory } from "@material-ui/icons";
import firebase from "firebase";
import React from "react";
// import Router from "react-router-dom";
// import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          Check()
        }
      >
        구글로 로그인
      </Button>
    </div>
  );
};

function Check(){
  firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider());
  // history.push('/status');
}

export default Login;
