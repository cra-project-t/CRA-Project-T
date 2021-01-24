import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import EventIcon from "@material-ui/icons/Event";

const AddPlan = () => {
  const [planname, setPlanname] = useState("");
  const [start] = useState("");
  const [end] = useState("");
  const [allday, setAllday] = useState({
    checkedA: false,
  });
  // const [starttime] = useState("");
  // const [endtime] = useState("");
  const [place, setPlace] = useState("");
  const [content, setContent] = useState("");

  const classes = useStyles();

  const handleChange1 = e => {
    setAllday({ ...allday, [e.target.name]: e.target.checked });
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
              value={planname}
              onChange={e => setPlanname(e.target.value)}
            />
          </div>
          {!allday.checkedA ? (
            <div>
              <DateAndTimePickers label="시작 일정" value={start} />
              <DateAndTimePickers label="종료 일정" value={end} />
            </div>
          ) : (
            <div>
              <DatePickers label="시작 일정" value={start} />
              <DatePickers label="시작 일정" value={end} />
            </div>
          )}
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allday.checkedA}
                    onChange={handleChange1}
                    name="checkedA"
                    color="primary"
                  />
                }
                label="종일"
                labelPlacement="start"
                value={allday}
              />
            </FormGroup>
          </FormControl>
          <div>
            <TextField
              id="outlined-textarea"
              label="장소"
              placeholder="일정 장소를 입력해주세요"
              multiline
              rows={4}
              variant="outlined"
              value={place}
              onChange={e => setPlace(e.target.value)}
            />
          </div>
          <div>
            <TextField
              id="outlined-textarea"
              label="내용"
              placeholder="일정 내용을 입력해주세요"
              multiline
              rows={4}
              variant="outlined"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default AddPlan;

const useStyles = makeStyles(theme => ({
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
  },
}));

function DateAndTimePickers({ label }) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="datetime-local"
        label={label}
        type="datetime-local"
        defaultValue="2021-03-03T01:00"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
  );
}
function DatePickers({ label }) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="date"
        label={label}
        type="date"
        defaultValue="2021-03-03"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
  );
}
