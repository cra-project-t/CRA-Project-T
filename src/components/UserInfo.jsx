import React from "react";
import firebase from "firebase";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import { Dialog, DialogTitle } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      // width: '100%',
      justifyContent: "center",
    },
  },
}));

const UserInfo = (props) => {
  const Button = props.button
    ? (pr) => ({ ...props.button, props: { ...props.button.props, ...pr } })
    : () => null;
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  const [edit, setEdit] = useState(true);
  const [state, setState] = useState([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((doc) => setState(doc.data()));
  }, []);
  const editChange = () => {
    setEdit(false);
  };
  const cancelChange = () => {
    setEdit(true);
  };
  const majorChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const keyChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const checkChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  return (
    <div>
      <Button onClick={handleClickOpen("paper")} />
      <Dialog open={open} onClose={handleClose} scroll={scroll}>
        <DialogTitle className={classes.root}>
          이름 : {state.studentname}
          <br />
          학번 : {state.hakbun}
          <br />
          이메일 : {state.email}
          <br />
          <br />
          닉네임 : {editspace(state.nickname, "nickname", edit)}
          <br />
          1전공 : {editspace(state.major, "major", edit)}
          <br />
          2전공 : {editspace(state.major2, "major2", edit)}
          <br />
          거주 상태 : {editspace(whereHome(state.home), "home", edit)}
          <br />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={check(state.shareWFriend)}
                onChange={checkChange}
                name="shareWFriend"
                color="primary"
                disabled={edit}
              />
            }
            label=""
          />
          친구들과 일정 공유
          <br />
          <button onClick={editChange}>수정</button>
          <button
            onClick={() => {
              AddStudent(state);
            }}
            disabled={edit}
          >
            저장
          </button>
          <button onClick={cancelChange}>취소</button>
        </DialogTitle>
      </Dialog>
    </div>
  );

  function editspace(value, stateName, buttonEdit) {
    if (buttonEdit) {
      if (stateName === "major" || stateName === "major2") {
        return whatMajor(value);
      } else {
        return value;
      }
    } else {
      if (stateName === "major" || stateName === "major2") {
        return (
          <FormControl>
            <Select
              native
              value={value}
              onChange={majorChange}
              inputProps={{
                name: stateName,
                id: "major-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              <option value={"Global leadership"}>글로벌 리더쉽 학부</option>
              <option value={"International Study"}>국제 어문 학부</option>
              <option value={"Management"}>경영 경제 학부</option>
              <option value={"Law"}>법학부</option>
              <option value={"Communication"}>커뮤니케이션 학부</option>
              <option value={"Counseling"}>상담심리사회복지학부</option>
              <option value={"Life Science"}>생명 과학부</option>
              <option value={"Spatial Environment System"}>
                공간 환경 시스템 공학부
              </option>
              <option value={"Computer Science"}>전산 전자 공학부</option>
              <option value={"C&C Design"}>콘텐츠 융합 디자인 학부</option>
              <option value={"Mechanical"}>기계 제어 공학부</option>
              <option value={"ICT"}>ICT 창업 학부</option>
            </Select>
          </FormControl>
        );
      } else {
        return (
          <FormControlLabel
            control={
              <TextField
                size="small"
                variant="outlined"
                value={value}
                onChange={keyChange}
                name={stateName}
              />
            }
          />
        );
      }
    }
  }
};

function whereHome(home) {
  if (home === 1) return "기숙사";
  else if (home === 2) return "자취";
  else return "온라인";
}

function whatMajor(major) {
  if (major === "") return "없음";
  else if (major === "Global leadership") return "글로벌 리더쉽 학부";
  else if (major === "International Study") return "국제 어문 학부";
  else if (major === "Management") return "경영 경제 학부";
  else if (major === "Law") return "법학부";
  else if (major === "Communication") return "커뮤니케이션 학부";
  else if (major === "Counseling") return "상담심리사회복지학부";
  else if (major === "Life Science") return "생명 과학부";
  else if (major === "Spatial Environment System")
    return "공간 환경 시스템 공학부";
  else if (major === "Computer Science") return "전산 전자 공학부";
  else if (major === "C&C Design") return "콘텐츠 융합 디자인 학부";
  else if (major === "Mechanical") return "기계 제어 공학부";
  else return "ICT 창업 학부";
}

function check(checked) {
  if (checked) return true;
  else return false;
}

function AddStudent(params) {
  if (params.nickname.length === 0) {
    alert("거절");
  } else firebase.firestore().collection("users").doc(params.uid).set(params);
}

export default UserInfo;
