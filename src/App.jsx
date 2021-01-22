import React, { useState } from 'react'
import firebase from 'firebase';
import {useAuthState} from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid'
import EventIcon from '@material-ui/icons/Event';

import Login from "./pages/Login";
import HomePage from './pages/HomePage';

const AuthOkay = ({children}) => {
  const [auth, loading, error] = useAuthState(firebase.auth());

  if(loading) return <div className="loading">Auth is Loading</div>
  if(error) return <div className="error">Auth is Error</div>
  if(!auth) return <Login />
  return children;
}
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
            </Switch>
        </Router>
      </AuthOkay>
      <br/>
      <Addplan />
    </div>
  )
}

export default App

const Addplan=()=>{
  const[planname,setPlanname]=useState("");
  const[date]=useState("");
  const[allday,setAllday]=useState({
    checkedA: false,
  });
  const[starttime]=useState("");
  const[finishtime]=useState("");
  const[place,setPlace]=useState("");
  const[content,setContent]=useState("");

  const classes = useStyles();

  const handleChange1 = (e) => {
    setAllday({ ...allday, [e.target.name]: e.target.checked });
  };

  return(
    <div>
    <Grid container item justify="center">
    <form className={classes.root} noValidate autoComplete="off">
      <h1>일정 추가<EventIcon/></h1>
      <br/>
      <div>
      <TextField
          id="outlined-textarea"
          label="일정 이름"
          placeholder="일정 이름을 입력해주세요"
          multiline
          variant="outlined"
          value={planname}
          onChange={(e)=>setPlanname(e.target.value)}
        />
      </div>
      <>
      <DatePickers value={date}/>
      <FormControl component="fieldset">
        <FormGroup aria-label="position" row>
          <FormControlLabel
            control={<Checkbox checked={allday.checkedA} onChange={handleChange1} name="checkedA" color="pimary"/>}
            label="종일"
            labelPlacement="start"
            value={allday}
          />
        </FormGroup>
      </FormControl>
      </>
      {!allday.checkedA&&
      <div>
      <TimePickers value={starttime} label="시작시간"/>
      <TimePickers value={finishtime} label="종료시간"/>
      </div>}
      <div>
      <TextField
          id="outlined-textarea"
          label="장소"
          placeholder="일정 장소를 입력해주세요"
          multiline
          variant="outlined"
          value={place}
          onChange={(e)=>setPlace(e.target.value)}
        />
      </div>
      <div>
      <TextField
          id="outlined-textarea"
          label="내용"
          placeholder="일정 내용을 입력해주세요"
          multiline
          variant="outlined"
          value={content}
          onChange={(e)=>setContent(e.target.value)}
        />
      </div>
    </form>
    </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function DatePickers() {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="date"
        label="일정 날짜"
        type="date"
        defaultValue="2020-01-22"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
  );
}
function TimePickers() {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="time"
        label="시작 시간"
        type="time"
        defaultValue="07:30"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
    </form>
  );
}