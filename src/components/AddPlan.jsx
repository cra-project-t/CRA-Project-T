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
  const [date] = useState("");
  const [allday, setAllday] = useState({
    checkedA: false,
  });
  const [starttime] = useState("");
  const [finishtime] = useState("");
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
          <DatePickers value={date} />
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
          {!allday.checkedA && (
            <div>
              <TimePickers
                label="시작 시간"
                defaultValue="7:30"
                value={starttime}
              />
              <TimePickers
                label="종료 시간"
                defaultValue="9:30"
                value={finishtime}
              />
            </div>
          )}
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
function TimePickers({ label, defaultValue }) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        label={label}
        type="time"
        defaultValue={defaultValue}
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
