import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const HisnetLogin = () => {
    const[hisnetID, setHisnetID]=useState("");
    const[hisnetPW, setHisnetPW]=useState("");
    const classes = useStyles();
    return (
        <div className={classes.button}>
            <div align="left">
            <br/>
            <h2>히즈넷로그인정보</h2>
            <input onChange={(e)=>{setHisnetID(e.target.value)}} value={hisnetID} placeholder="히즈넷 ID"/><br />
            <input type="password" onChange={(e)=>{setHisnetPW(e.target.value)}} value={hisnetPW} placeholder="히즈넷 PW"/>
            </div>
            <div>
              <Button onClick={() => {
                  setHisnetID("");
                  setHisnetPW("");
                  }}
                  variant="contained" color="primary" size="large">
                  확인
              </Button>
              <h5>해당 히즈넷 로그인 정보는 저장되지 않으며, 히즈넷에서 수강중인 시간표를 다운로드 받는데 사용됩니다.</h5>
            </div>
        </div>
    )
}

export default HisnetLogin

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        justifyContent: 'center'
      },
    },
  }));
