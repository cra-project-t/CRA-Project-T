import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import GroupIcon from "@material-ui/icons/Group";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

const AddGroup = () => {
  const [groupname, setGroupname] = useState("");
  const [groupcategory, setGroupcategory] = useState("");
  const [groupcontent, setGroupcontent] = useState("");
  const [groupmembernumber, setGroupmembernumber] = useState("");
  const handleSliderChange = (e, newValue) => {
    setGroupmembernumber(newValue);
  };

  const handleInputChange = e => {
    setGroupmembernumber(e.target.value === "" ? "" : Number(e.target.value));
  };

  const handleBlur = () => {
    if (groupmembernumber < 0) {
      setGroupmembernumber(0);
    } else if (groupmembernumber > 100) {
      setGroupmembernumber(100);
    }
  };

  const classes = useStyles();
  return (
    <div>
      <Grid container item justify="center">
        <div className={classes.root}>
          <h1>
            GROUP 추가
            <GroupAddIcon />
          </h1>
          <br />
          <div>
            <TextField
              id="groupname"
              label="GROUP 이름"
              variant="outlined"
              value={groupname}
              onChange={e => setGroupname(e.target.value)}
            />
          </div>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="groupcategory">GROUP 카테고리</InputLabel>
            <NativeSelect
              value={groupcategory}
              onChange={e => setGroupcategory(e.target.value)}
              inputProps={{
                name: "age",
                id: "groupcategory",
              }}
            >
              <option aria-label="None" value="" />
              <option value={"club"}>동아리</option>
              <option value={"association"}>학회</option>
              <option value={"others"}>기타</option>
            </NativeSelect>
            <FormHelperText>GROUP 카테고리를 선택해주세요</FormHelperText>
          </FormControl>
          <Typography id="input-slider" gutterBottom>
            GROUP 인원 수
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <GroupIcon />
            </Grid>
            <Grid item xs>
              <Slider
                value={
                  typeof groupmembernumber === "number" ? groupmembernumber : 0
                }
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                className={classes.input}
                value={groupmembernumber}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 100,
                  type: "number",
                  "aria-labelledby": "input-slider",
                }}
              />
            </Grid>
          </Grid>
          <div>
            <TextField
              id="outlined-textarea"
              label="GROUP 설명"
              placeholder="GROUP 설명을 입력해주세요"
              multiline
              variant="outlined"
              value={groupcontent}
              onChange={e => setGroupcontent(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default AddGroup;

const useStyles = makeStyles(theme => ({
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
