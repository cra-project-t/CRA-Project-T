import React from 'react'
// import { Link } from 'react-router-dom';
import firebase from "firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
// import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '90%',
      justifyContent: "center",
    },
  },
  title: {
    display: "flex",
    flexWrap: "wrap",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
}));

const Status = () => {
  const classes = useStyles();
  const [user] = useAuthState(firebase.auth());
  const [state, setState] = React.useState({
    hakbun: user.email.substr(0, 8),
    studentname: user.displayName,
    nickname: "",
    major: "",
    major2: "",
    home: "",
    shareWFriend: false,
    information: false,
    service: false,
  });
  const majorChange = (event) => {
    setState({...state, [event.target.name]: event.target.value});
  };
  const keyChange = (event) => {
    if(event.key === 'Enter'){
      setState({...state, [event.target.name]: event.target.value});
    }
  };
  const checkChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  if(user)
    return (
      <div className={classes.title}>
        <div>
          <h1>안녕하세요.<br />
          {state.hakbun}학번<br />
          {state.studentname}님</h1><br />
          <FormControl className={classes.root} noValidate autoComplete="off">
            <TextField id="nickname" name="nickname" label="닉네임" variant="outlined" onKeyPress={keyChange} /><br />
            <FormControl>
              <InputLabel id="major">전공</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="major"
                  value={state.major}
                  onChange={majorChange}
                >
                  <MenuItem value={"Global leadership"}>글로벌 리더쉽 학부</MenuItem>
                  <MenuItem value={"International Study"}>국제 어문 학부</MenuItem>
                  <MenuItem value={"Management"}>경영 경제 학부</MenuItem>
                  <MenuItem value={"Law"}>법학부</MenuItem>
                  <MenuItem value={"Communication"}>커뮤니케이션 학부</MenuItem>
                  <MenuItem value={"Counseling"}>상담심리사회복지학부</MenuItem>
                  <MenuItem value={"Life Science"}>생명 과학부</MenuItem>
                  <MenuItem value={"Spatial Environment System"}>공간 환경 시스템 공학부</MenuItem>
                  <MenuItem value={"Computer Science"}>전산 전자 공학부</MenuItem>
                  <MenuItem value={"C&C Design"}>콘텐츠 융합 디자인 학부</MenuItem>
                  <MenuItem value={"Mechanical"}>기계 제어 공학부</MenuItem>
                  <MenuItem value={"ICT"}>ICT 창업 학부</MenuItem>
                </Select>
            </FormControl><br />
            <FormControl>
              <InputLabel id="major2">부전공</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="major2"
                  value={state.major2}
                  onChange={majorChange}
                >
                  <MenuItem value={"Global leadership"}>글로벌 리더쉽 학부</MenuItem>
                  <MenuItem value={"International Study"}>국제 어문 학부</MenuItem>
                  <MenuItem value={"Management"}>경영 경제 학부</MenuItem>
                  <MenuItem value={"Law"}>법학부</MenuItem>
                  <MenuItem value={"Communication"}>커뮤니케이션 학부</MenuItem>
                  <MenuItem value={"Counseling"}>상담심리사회복지학부</MenuItem>
                  <MenuItem value={"Life Science"}>생명 과학부</MenuItem>
                  <MenuItem value={"Spatial Environment System"}>공간 환경 시스템 공학부</MenuItem>
                  <MenuItem value={"Computer Science"}>전산 전자 공학부</MenuItem>
                  <MenuItem value={"C&C Design"}>콘텐츠 융합 디자인 학부</MenuItem>
                  <MenuItem value={"Mechanical"}>기계 제어 공학부</MenuItem>
                  <MenuItem value={"ICT"}>ICT 창업 학부</MenuItem>
                </Select>
            </FormControl><br />
            <TextField id="home" name="home" label="거주상태" variant="outlined" onKeyPress={keyChange} /><br />
            <FormControlLabel
              control={
              <Checkbox
                checked={state.shareWFriend}
                onChange={checkChange}
                name="shareWFriend"
                color="primary"
              />
              }
              label="친구들에게 일정 공유"
            />
            <FormControlLabel
              control={
              <Checkbox
                checked={state.information}
                onChange={checkChange}
                name="information"
                color="primary"
              />
              }
              label="개인정보 활용 동의"
            />
            <FormControlLabel
              control={
              <Checkbox
                checked={state.service}
                onChange={checkChange}
                name="service"
                color="primary"
              />
              }
              label="서비스 이용약관 동의"
            />
          </FormControl>
          <br />
          <button>저장</button>
        </div>
      </div>
    )
}

export default Status
