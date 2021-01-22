import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
const HisnetLogin = () => {
  const [hisnetID, setHisnetID] = useState("");
  const [hisnetPW, setHisnetPW] = useState({
    password: "",
    showPassword: false,
  });
  const classes = useStyles();
  const handleChange = prop => e => {
    setHisnetPW({ ...hisnetPW, [prop]: e.target.value });
  };
  const handleClickShowPassword = () => {
    setHisnetPW({ ...hisnetPW, showPassword: !hisnetPW.showPassword });
  };
  const handleMouseDownPassword = e => {
    e.preventDefault();
  };
  return (
    <div>
      <br />
      <Grid container item justify="center">
        <div className={classes.root}>
          <h2>히즈넷로그인정보</h2>
          <br />
          <TextField
            id="standard-secondary"
            label="HISNET ID"
            color="secondary"
            value={hisnetID}
            onChange={e => {
              setHisnetID(e.target.value);
            }}
          />
          <br />
          <FormControl className={clsx(classes.margin, classes.textField)}>
            <InputLabel htmlFor="standard-adornment-password">
              HISNET Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={hisnetPW.showPassword ? "text" : "password"}
              value={hisnetPW.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {hisnetPW.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            onClick={() => {
              setHisnetID("");
              setHisnetPW({ ...hisnetPW, password: "" });
            }}
            variant="contained"
            color="primary"
            size="large"
          >
            확인
          </Button>
          <h5>
            해당 히즈넷 로그인 정보는 저장되지 않으며, 히즈넷에서 수강중인
            시간표를 다운로드 받는데 사용됩니다.
          </h5>
        </div>
      </Grid>
    </div>
  );
};

export default HisnetLogin;

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
      justifyContent: "center",
    },
    textField: {
      width: "25ch",
    },
  },
}));
