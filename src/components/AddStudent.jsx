// import React from 'react'
import firebase from "firebase";

function AddStudent(params) {
    console.log(params);
    // console.log(firebase.auth().currentUser.uid);
    if(params.nickname.length === 0){
        alert('거절');
    }
    else firebase.firestore().collection('user').doc(params.uid).set(params);
    return false;
}

export default AddStudent
