import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import EventIcon from "@material-ui/icons/Event";
import firebase from "firebase";

const AddPlan = () => {
  const [calInfo, setCalInfo] = useState({
    planname: "",
    start: "",
    end: "",
    allday: false,
    place: "",
    content: "",
  });

  const classes = useStyles();
  const handleChange1 = (e) => {
    setCalInfo({ ...calInfo, allday: e.target.checked });
  };

  return (
    <div>
      <Grid container item justify="center">
        <div className={classes.root} noValidate autoComplete="off">
          <h1>
            일정 추가
            <EventIcon />
          </h1>
          <br />
          <div>
            <TextField
              id="outlined-textarea"
              label="일정 이름"
              placeholder="일정 이름을 입력해주세요"
              multiline
              variant="outlined"
              value={calInfo.planname}
              onChange={(e) =>
                setCalInfo({
                  ...calInfo,
                  planname: e.target.value,
                })
              }
            />
          </div>
          {!calInfo.allday ? (
            <div>
              <DateAndTimePickers
                label="시작 일정"
                value={calInfo.start}
                onChange={(e) => {
                  setCalInfo({ ...calInfo, start: e.target.value });
                }}
              />
              <DateAndTimePickers
                label="종료 일정"
                value={calInfo.end}
                onChange={(e) => {
                  setCalInfo({ ...calInfo, end: e.target.value });
                }}
              />
            </div>
          ) : (
            <div>
              <DatePickers
                label="시작 일정"
                value={calInfo.start}
                onChange={(e) => {
                  setCalInfo({ ...calInfo, start: e.target.value });
                }}
              />
              <DatePickers
                label="종료 일정"
                value={calInfo.end}
                onChange={(e) => {
                  setCalInfo({ ...calInfo, end: e.target.value });
                }}
              />
            </div>
          )}
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={calInfo.allday}
                    onChange={handleChange1}
                    name="allday"
                    color="primary"
                  />
                }
                label="종일"
                labelPlacement="start"
                value={calInfo.allday}
              />
            </FormGroup>
          </FormControl>
          <div>
            <TextField
              id="일정 장소"
              label="일정 장소"
              placeholder="일정 장소를 입력해주세요"
              multiline
              rows={4}
              variant="outlined"
              value={calInfo.place}
              onChange={(e) =>
                setCalInfo({ ...calInfo, place: e.target.value })
              }
            />
          </div>
          <div>
            <TextField
              id="일정 내용"
              label="일정 내용"
              placeholder="일정 내용을 입력해주세요"
              multiline
              rows={4}
              variant="outlined"
              value={calInfo.content}
              onChange={(e) =>
                setCalInfo({ ...calInfo, content: e.target.value })
              }
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log(calInfo.start);
              firebase
                .firestore()
                .collection("calendars")
                .doc("IQWkcBUvw06jseGNWWoA")
                .collection("events")
                .add({
                  allDay: calInfo.allday,
                  startTime: new Date(calInfo.start),
                  endTime: new Date(calInfo.end),
                  eventName: calInfo.planname,
                  eventDescription: calInfo.content,
                });
            }}
          >
            등록
          </Button>
          <Button variant="contained">취소</Button>
        </div>
      </Grid>
    </div>
  );
};

export default AddPlan;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function DateAndTimePickers({ label, onChange }) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        label={label}
        type="datetime-local"
        defaultValue="2021-03-03T00:00"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={onChange}
      />
    </form>
  );
}
function DatePickers({ label, onChange }) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        label={label}
        type="date"
        defaultValue="2021-03-03"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={onChange}
      />
    </form>
  );
}
