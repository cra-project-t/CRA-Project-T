import React from 'react'
import firebase from "firebase";
import { useEffect, useState } from 'react';

const UserInfo = ({match}) => {
    const listed = firebase.firestore().collection('users').doc(match.params.uid);
    const [state, setState] = useState([]);
    useEffect(() => {
        listed.get().then(doc => setState(doc.data()));
    }, [listed])
    return (
        <div>
            {state.studentname}
        </div>
    )
}

export default UserInfo
