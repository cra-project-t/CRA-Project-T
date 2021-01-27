import React from 'react'
import { Link } from 'react-router-dom';
import firebase from "firebase";
import { Button } from '@material-ui/core'
import { useEffect, useState } from 'react';
import Status from './Status';

const Test = () => {
  const user = firebase.auth().currentUser.uid;
  const path = "/user/" + user;
  const [users, setusers] = useState([]);
  useEffect(() => {
    firebase.firestore().collection('users').doc(user).get().then(doc => setusers(doc.data()));
  }, [user])
  console.log(users)
  if(!users){
    return (
      <div>
        <Status />
      </div>
    )
  }
  else {
    return (
      <div>
        <Link to={path} >
          <Button
            variant="contained"
            color="secondary"
          >
          User 정보
          </Button>
        </Link>
      </div>
    )
  }
}

export default Test
