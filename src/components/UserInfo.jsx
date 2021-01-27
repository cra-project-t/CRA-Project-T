import React from 'react'
import firebase from "firebase";
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      // width: '100%',
      justifyContent: "center",
    },
  },
}));

const UserInfo = ({match}) => {
  const classes = useStyles();
  const [edit, setEdit] = useState(true);
  const [state, setState] = useState([]);
  useEffect(() => {
    firebase.firestore().collection('users').doc(match.params.uid).get().then(doc => setState(doc.data()));
  }, [match])
  const editChange = () => {
    setEdit(false);
  };
  const cancelChange = () => {
    setEdit(true);
  };
  const majorChange = (event) => {
    setState({...state, [event.target.name]: event.target.value});
  };
  const keyChange = (event) => {
    setState({...state, [event.target.name]: event.target.value});
  };
  // const checkChange = (event) => {
  //   setState({ ...state, [event.target.name]: event.target.checked });
  // };
  return (
    <div>
      <h3 className={classes.root}>
        이름 : {state.studentname}<br />
        학번 : {state.hakbun}<br />
        이메일 : {state.email}<br />
        <br />
        닉네임 : {editspace(state.nickname, "nickname", edit)}
        <br />
        1전공 : {editspace(state.major, "major", edit)}
        <br />
        2전공 : {editspace(state.major2, "major2", edit)}
        <br />
        거주 상태 : {editspace(whereHome(state.home), "home", edit)}
        <br />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.information}
              // onChange={checkChange}
              name="information"
              color="primary"
              disabled={edit}
            />
          }
        />친구들과 일정 공유<br />
        <button
          onClick={editChange}
        >수정</button>
        <button
          onClick={() =>{
            AddStudent(state);
          }}
        disabled={edit}>저장</button>
        <button
          onClick={cancelChange}
        >취소</button>
      </h3>
    </div>
  )

  function editspace(a, b, k) {
    if(k) {
      if(b === "major" || b === "major2"){
        return (
          whatMajor(a)
        )
      }
      else {
        return (
          a
        )
      }
    }
    else {
      if(b === "major" || b === "major2"){
        return (
          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name={b}
              value={a}
              onChange={majorChange}
            >
              <MenuItem value=""><em>없음</em></MenuItem>
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
          </FormControl>
        )
      }
      else {
        return (
          <FormControlLabel
            control={
              <TextField
                size="small"
                variant="outlined"
                value={a}
                onChange={keyChange}
                name={b}
              />
            }
          />
        )
      }
    }
  }
}

function whereHome(home) {
  if(home === 1) return "기숙사";
  else if(home === 2) return "자취";
  else return "온라인";
}

function whatMajor(major) {
  if(major === "") return "없음";
  else if(major === "Global leadership") return "글로벌 리더쉽 학부";
  else if(major === "International Study") return "국제 어문 학부";
  else if(major === "Management") return "경영 경제 학부";
  else if(major === "Law") return "법학부";
  else if(major === "Communication") return "커뮤니케이션 학부";
  else if(major === "Counseling") return "상담심리사회복지학부";
  else if(major === "Life Science") return "생명 과학부";
  else if(major === "Spatial Environment System") return "공간 환경 시스템 공학부";
  else if(major === "Computer Science") return "전산 전자 공학부";
  else if(major === "C&C Design") return "콘텐츠 융합 디자인 학부";
  else if(major === "Mechanical") return "기계 제어 공학부";
  else return "ICT 창업 학부";
}

function AddStudent(params) {
  console.log(params);
  // console.log(firebase.auth().currentUser.uid);
  if(params.nickname.length === 0){
    alert('거절');
  }
  else firebase.firestore().collection('users').doc(params.uid).set(params);
}

export default UserInfo
