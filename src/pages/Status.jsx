import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import firebase from "firebase";
import { Link } from 'react-router-dom';
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
    const [state, setState] = React.useState({
        hakbun: firebase.auth().currentUser.email.substr(0, 8),
        studentname: firebase.auth().currentUser.displayName,
        openfriend: false,
        information: false,
        service: false,
        nicname: "",
        major: "",
        home: "",
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
    console.log(state);
    return (
        <div className={classes.title}>
            <div>
                <h1>안녕하세요.<br />
                 {state.hakbun}학번<br />
                 {state.studentname}님</h1><br />
                <FormControl className={classes.root} noValidate autoComplete="off">
                    <TextField id="nicname" name="nicname" label="닉네임" variant="outlined" onKeyPress={keyChange} /><br />
                    <FormControl>
                        <InputLabel id="major">전공</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="major"
                                value={state.major}
                                onChange={majorChange}
                            >
                                <MenuItem value={"글로벌 리더쉽 학부"}>글로벌 리더쉽 학부</MenuItem>
                                <MenuItem value={"국제 어문 학부"}>국제 어문 학부</MenuItem>
                                <MenuItem value={"경영 경제 학부"}>경영 경제 학부</MenuItem>
                                <MenuItem value={"법학부"}>법학부</MenuItem>
                                <MenuItem value={"커뮤니케이션 학부"}>커뮤니케이션 학부</MenuItem>
                                <MenuItem value={"상담심리사회복지학부"}>상담심리사회복지학부</MenuItem>
                                <MenuItem value={"생명 과학부"}>생명 과학부</MenuItem>
                                <MenuItem value={"공간 환경 시스템 공학부"}>공간 환경 시스템 공학부</MenuItem>
                                <MenuItem value={"전산 전자 공학부"}>전산 전자 공학부</MenuItem>
                                <MenuItem value={"콘텐츠 융합 디자인 학부"}>콘텐츠 융합 디자인 학부</MenuItem>
                                <MenuItem value={"게계 제어 공학부"}>게계 제어 공학부</MenuItem>
                                <MenuItem value={"ICT 창업 학부"}>ICT 창업 학부</MenuItem>
                            </Select>
                    </FormControl><br />
                    <TextField id="home" name="home" label="거주상태" variant="outlined" onKeyPress={keyChange} /><br />
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={state.openfriend}
                            onChange={checkChange}
                            name="openfriend"
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
                <Link to="/"><button>홈페이지</button></Link>
            </div>
        
        </div>
    )
}

export default Status
