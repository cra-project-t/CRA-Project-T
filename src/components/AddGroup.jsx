import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import GroupIcon from "@material-ui/icons/Group";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import firebase from "firebase";
import axios from "axios";

const AddGroup = props => {
  const classes = useStyles();
  const Button = props.button
    ? pr => ({ ...props.button, props: { ...props.button.props, ...pr } })
    : () => null;
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const [value, setValue] = React.useState(20);
  const [groupList, setGroupList] = useState({
    name: "",
    id: "",
    type: "",
    description: "", //보내고 싶은 회원, 알림 방식추가하기
    photoURL: "",
  });
  const [groupListError, setGroupListError] = useState("");

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = event => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  const saveGroupList = async () => {
    const token = await firebase.auth().currentUser.getIdToken();
    axios
      .post(
        `/group/add`,
        {
          name: groupList.name,
          englishName: groupList.id,
          type: groupList.type,
          description: groupList.description,
          memberCount: value,
          photoURL: groupList.photoURL,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch(e => {
        setGroupListError(e.response.data.error);
        setGroupList([]);
      });
    console.log(token);
    setGroupList({
      name: "",
      id: "",
      type: "",
      description: "",
      photoURL: "",
    }); // 공지 내용 초기화
    setValue(20);
    setOpen(false);
  };
  const handleClickOpen = scrollType => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClickOpen("paper")} />
      <Dialog open={open} onClose={handleClose} scroll={scroll} fullWidth>
        <DialogTitle id="scroll-dialog-title">
          GROUP 추가
          <GroupAddIcon />
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <div>
            <FormLabel component="legend">GROUP 이름: </FormLabel>
            <br />
            <TextField
              id="groupname"
              label="한글 GROUP이름"
              variant="outlined"
              placeholder="EX) 시간조율"
              fullWidth
              value={groupList.name}
              onChange={e =>
                setGroupList({ ...groupList, name: e.target.value })
              }
            />
            <br />
            <br />
            <FormLabel component="legend">GROUP ID: </FormLabel>
            <br />
            <TextField
              id="groupid"
              label="영어소문자 GROUP이름"
              placeholder="EX) timemanagement"
              variant="outlined"
              fullWidth
              value={groupList.id}
              onChange={e => setGroupList({ ...groupList, id: e.target.value })}
            />
            <br />
            <br />
            <FormLabel component="legend">GROUP 이미지: </FormLabel>
            <br />
            <TextField
              id="groupphoto"
              label="Photo URL"
              variant="outlined"
              placeholder="EX) https://file.mk.co.kr/meet/neds/2019/01/image_readtop_2019_31665_15475788633604297.jpg"
              fullWidth
              value={groupList.photoURL}
              onChange={e =>
                setGroupList({ ...groupList, photoURL: e.target.value })
              }
            />
            <br />
            <br />
            <FormControl className={classes.formControl}>
              <FormLabel component="legend">GROUP 종류: </FormLabel>
              <NativeSelect
                value={groupList.type}
                onChange={e =>
                  setGroupList({ ...groupList, type: e.target.value })
                }
                inputProps={{
                  name: "group",
                  id: "grouptype",
                }}
              >
                <option aria-label="None" value="" />
                <option value={"club"}>동아리</option>
                <option value={"association"}>학회</option>
                <option value={"others"}>기타</option>
              </NativeSelect>
              <FormHelperText>GROUP TYPE를 선택해주세요</FormHelperText>
            </FormControl>
            {/* <Typography id="input-slider" gutterBottom>
              GROUP 인원 수
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <GroupIcon />
              </Grid>
              <Grid item xs>
                <Slider
                  value={typeof value === "number" ? value : 0}
                  onChange={handleSliderChange}
                  aria-labelledby="input-slider"
                />
              </Grid>
              <Grid item>
                <Input
                  className={classes.input}
                  value={value}
                  margin="dense"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step: 5,
                    min: 0,
                    max: 100,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </Grid>
            </Grid> */}
            <br />
            <br />
            <div>
              <FormLabel component="legend">GROUP 설명: </FormLabel>
              <br />
              <TextField
                id="outlined-textarea"
                label="GROUP 설명"
                placeholder="GROUP 설명을 입력해주세요..."
                multiline
                variant="outlined"
                fullWidth
                value={groupList.description}
                onChange={e =>
                  setGroupList({ ...groupList, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <DialogActions>
              <Button
                variant="outlined"
                color="secondary"
                onClick={saveGroupList} //&& groupListError ? (
                //   <div>
                //     <Alert severity="error">{groupListError}</Alert>
                //   </div>
                // ) : (
                //   handleClose
                // )// 실패인듯
              >
                저장
              </Button>
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));
