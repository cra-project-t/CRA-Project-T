import React from 'react'
import { Link } from 'react-router-dom';
import firebase from "firebase";
import { Button } from '@material-ui/core'

const Test = () => {
    const path = "/user/" + firebase.auth().currentUser.uid;
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

export default Test
