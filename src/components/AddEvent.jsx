import React, { useContext, useState } from "react";
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
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

import { padNumber } from "../tools/padNumber";
import { userStore } from "../stores/userStore";
import { useAuthState } from "react-firebase-hooks/auth";

const initCalInfo = () => {
  const date = new Date();
  return {
    planname: "",
    start: `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
      date.getDate()
    )}T${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`,
    end: `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
      date.getDate()
    )}T${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`,
    allday: false,
    place: "",
    content: "",
  };
};

const AddEvent = ({ setOpenNewEvent }) => {
  const [auth] = useAuthState(firebase.auth());
  const { state: userDataStore } = useContext(userStore);

  const handleClose = () => {
    setCalInfo(initCalInfo());
    setOpenNewEvent(false);
  };

  const [calendarId, setCalendarId] = useState(`${auth.uid}`);
  const [calInfo, setCalInfo] = useState(() => initCalInfo());

  const classes = useStyles();
  const handleChange1 = e => {
    setCalInfo({ ...calInfo, allday: e.target.checked });
  };
  const changeCalId = (e) => {
    setCalendarId(e.target.value);
  };

  return (
    <Dialog open fullWidth onClose={handleClose}>
      <DialogTitle>
        <EventIcon />
        일정추가
      </DialogTitle>
      <DialogContent>
        <Grid container item justify="center">
          <div className={classes.root} noValidate autoComplete="off">
            <FormControl fullWidth variant="outlined">
              <InputLabel>달력</InputLabel>
              <Select value={calendarId} onChange={changeCalId}>
                {userDataStore.calendars &&
                  userDataStore.calendars
                    .filter((calendar) =>
                      ["owner", "write"].includes(calendar.permission)
                    )
                    .map((calendar) => (
                      <MenuItem
                        key={`${calendar.owner}`}
                        value={`${calendar.owner}`}
                      >
                        {calendar.ownerName}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
            <TextField
              id="outlined-textarea"
              label="일정 이름"
              placeholder="일정 이름을 입력해주세요"
              multiline
              fullWidth
              variant="outlined"
              value={calInfo.planname}
              onChange={e =>
                setCalInfo({
                  ...calInfo,
                  planname: e.target.value,
                })
              }
            />
            {!calInfo.allday ? (
              <div>
                <DateAndTimePickers
                  label="시작 일정"
                  value={calInfo.start}
                  onChange={e => {
                    setCalInfo({ ...calInfo, start: e.target.value });
                  }}
                />
                <DateAndTimePickers
                  label="종료 일정"
                  value={calInfo.end}
                  onChange={e => {
                    setCalInfo({ ...calInfo, end: e.target.value });
                  }}
                />
              </div>
            ) : (
              <div>
                <DatePickers
                  label="시작 일정"
                  value={calInfo.start}
                  onChange={e => {
                    setCalInfo({ ...calInfo, start: e.target.value });
                  }}
                />
                <DatePickers
                  label="종료 일정"
                  value={calInfo.end}
                  onChange={e => {
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
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={calInfo.place}
                onChange={e =>
                  setCalInfo({ ...calInfo, place: e.target.value })
                }
              />
            </div>
            <div>
              <TextField
                id="일정 내용"
                label="일정 내용"
                placeholder="일정 내용을 입력해주세요"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={calInfo.content}
                onChange={e =>
                  setCalInfo({ ...calInfo, content: e.target.value })
                }
              />
            </div>
          </div>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button
          color="primary"
          onClick={() => {
            console.log(calInfo.start);
            firebase
              .auth()
              .currentUser.getIdToken()
              .then((token) => {
                axios.post(
                  `/calendar/${calendarId}/events/add`,
                  {
                    allDay: calInfo.allday,
                    startTime: new Date(calInfo.start).getTime(),
                    endTime: new Date(calInfo.end).getTime(),
                    eventName: calInfo.planname,
                    eventDescription: calInfo.content,
                  },
                  {
                    headers: {
                      authorization: `Bearer ${token}`,
                    },
                  }
                );
              });
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
            handleClose();
          }}
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEvent;

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    // width: 200,
  },
  root: {
    width: "100%",
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      // width: "25ch",
    },
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function DateAndTimePickers({ label, onChange, value }) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        label={label}
        type="datetime-local"
        value={value}
        // defaultValue={`${date.getFullYear()}-${padNumber(
        //   date.getMonth() + 1
        // )}-${padNumber(date.getDate())}T${padNumber(
        //   date.getHours()
        // )}:${padNumber(date.getMinutes())}`}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={onChange}
      />
    </form>
  );
}
function DatePickers({ label, onChange, value }) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        label={label}
        type="date"
        value=""
        // defaultValue={`${date.getFullYear()}-${padNumber(
        //   date.getMonth() + 1
        // )}-${padNumber(date.getDate())}`}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={onChange}
      />
    </form>
  );
}
