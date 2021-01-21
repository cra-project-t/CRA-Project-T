import { Button } from '@material-ui/core'
import firebase from "firebase";
import React from 'react'

const HomePage = () => {
  return (
    <div>
      This is Home Page<br/>
      <Button
        variant="contained"
        color="secondary"
        onClick={() =>
          firebase
            .auth().signOut()
        }
      >
        로그아웃
      </Button>
    </div>
  )
}

export default HomePage
