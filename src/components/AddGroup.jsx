import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

const AddGroup = () => {
  const [groupname, setGroupname] = useState("");
  const [groupcategory, setGroupcategory] = useState("");
  const [groupcontent, setGroupcontent] = useState("");

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
            <InputLabel id="groupcategory-label">GROUP 카테고리</InputLabel>
            <Select
              labelId="groupcategory-label"
              id="groupcategory-labelr"
              value={groupcategory}
              onChange={e => setGroupcategory(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>동아리</MenuItem>
              <MenuItem value={20}>학회</MenuItem>
              <MenuItem value={30}>기타</MenuItem>
            </Select>
            <FormHelperText>GROUP 카테고리를 입력해주세요</FormHelperText>
          </FormControl>
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
