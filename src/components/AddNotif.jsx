import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Grid from "@material-ui/core/Grid";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import NotificationsTwoToneIcon from "@material-ui/icons/NotificationsTwoTone";
import MailTwoToneIcon from "@material-ui/icons/MailTwoTone";
import firebase from "firebase";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";

const groupId = "englishGroup";
const userId = "C62F1D8OsnZtSzFhZMR8EPusrYm1";

const AddNotif = () => {
  const classes = useStyles();
  const currentUserId = "uid1"; // 이후 uid7을 이용해 추가확인
  const today = new Date().toLocaleString();
  const [notif, setNotif] = useState({
    group: "",
    name: "",
    description: "", //보내고 싶은 회원, 알림 방식추가하기
    wayofannounce: "email",
    today: today,
  });

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [groupname, setGroupname] = React.useState([]);

  const [memberListError, setMemberListError] = useState("");
  const [memberListLoading, setMemberListLoading] = useState(false);
  const [userGroupError, setUserGroupError] = useState("");

  // function getCurrentDate(separator = "-") {
  //   let newDate = new Date();
  //   let date = newDate.getDate();
  //   let month = newDate.getMonth() + 1;
  //   let year = newDate.getFullYear();

  //   return `${year}${separator}${
  //     month < 10 ? `0${month}` : `${month}`
  //   }${separator}${date}`;
  // }

  // Group의 members정보 받아오기
  useEffect(() => {
    setMemberListError("");
    setMemberListLoading(true);
    // Axios post body data 넣는 방법
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        axios
          .get(`/group/${groupId}/members`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => setLeft(res.data.data))
          .catch((e) => setMemberListError(e.response.data.error))
          .finally(() => setMemberListLoading(false));
      });
    // firebase
    //   .firestore()
    //   .collection("group")
    //   .doc("grp3")
    //   .get()
    //   .then(doc => {
    //     setLeft(doc.data().members);
    //   });
  }, []);

<<<<<<< HEAD
  // User의 Group 정보 받아오기
  useEffect(() => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(token => {
        axios
          .get(`/group/${userId}/groups`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(res => setRight(res.data.data))
          .catch(e => setUserGroupError(e.response.data.error));
      }); //여기서 그룹받아와서 seslet option에 넣어야하느ㄴ데
    // console.log(right);
    // console.log(userGroupError);
  }, []);

  const handleToggle = value => () => {
=======
  const handleToggle = (value) => () => {
>>>>>>> 5013148943dce7e42c76c0923144ad63af5fa4a3
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const numberOfChecked = (members) => intersection(checked, members).length; // members가 뭐야;;;;;

  const handleToggleAll = (members) => () => {
    if (numberOfChecked(members) === members.length) {
      setChecked(not(checked, members));
    } else {
      setChecked(union(checked, members));
    }
  };

  const customList = (title, members) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(members)}
            checked={
              numberOfChecked(members) === members.length &&
              members.length !== 0
            }
            indeterminate={
              numberOfChecked(members) !== members.length &&
              numberOfChecked(members) !== 0
            }
            disabled={members.length === 0}
            inputProps={{ "aria-label": "all members selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(members)}/${members.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {memberListLoading && <CircularProgress />}
        {members.map((value) => {
          const labelId = `transfer-list-all-item-${value.displayName}-label`;
          return (
            <ListItem
              key={value.displayName}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={
                  `${value.displayName}` /* value=collection users에 있는 USERID */
                }
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );
<<<<<<< HEAD
  // useEffect(() => {
  //   setGroupListError("");
  //   firebase
  //     .auth()
  //     .currentUser.getIdToken()
  //     .then(token => {
  //       axios
  //         .get(`/group/${groupId}/groups`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         })
  //         .then(res => setGroupname(res.data.data))
  //         .catch(e => setGroupListError(e.response.data.error));
  //     });
  //   // firebase
  //   //   .firestore()
  //   //   .collection("group")
  //   //   .doc("grp3")
  //   //   .get()
  //   //   .then(doc => {
  //   //     setGroupname(doc.data().name);
  //   //   });
  // }, []);
=======
  useEffect(() => {
    setGroupListError("");
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        axios
          .get(`/group/${groupId}/groups`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => setGroupname(res.data.data))
          .catch((e) => setGroupListError(e.response.data.error));
      });
    // firebase
    //   .firestore()
    //   .collection("group")
    //   .doc("grp3")
    //   .get()
    //   .then(doc => {
    //     setGroupname(doc.data().name);
    //   });
  }, []);
>>>>>>> 5013148943dce7e42c76c0923144ad63af5fa4a3
  return (
    <div>
      <Grid container item justify="center">
        <div className={classes.root}>
          <h1>
            공지 추가
            <NotificationsIcon />
            {/*
              console.log(
                notif.today
              ) -> 이거 공지사항 글 쓸때마다 render됨. 돈 펑펑펑
             */}
          </h1>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="notifgroup">GROUP TYPE</InputLabel>
              <NativeSelect
                value={notif.group}
                onChange={(e) => setNotif({ ...notif, group: e.target.value })}
                inputProps={{
                  name: "age",
                  id: "notifgroup",
                }}
              >
                <option aria-label="None" value="" />
                {right.map(group => (
                  <React.Fragment key={group}>
                    <option value={"groupname"}>{group}</option>
                  </React.Fragment>
                ))}
              </NativeSelect>
              <FormHelperText>GROUP TYPE를 선택해주세요</FormHelperText>
            </FormControl>
          </div>
          <FormLabel component="legend">제목: </FormLabel>
          <TextField
            id="outlined-textarea"
            label="공지 제목"
            multiline
            variant="outlined"
            value={notif.name}
            onChange={(e) => setNotif({ ...notif, name: e.target.value })}
            rows={1}
          />
          <div>
            <FormLabel component="legend">내용: </FormLabel>
            <TextField
              id="outlined-textarea"
              label="공지 설명"
              placeholder="공지 설명을 입력해주세요"
              multiline
              variant="outlined"
              value={notif.description}
              onChange={(e) =>
                setNotif({ ...notif, description: e.target.value })
              }
              rows={4}
            />
          </div>
          <FormLabel component="legend">첨부파일: (추후 추가예정)</FormLabel>
          <br />
          <h1>
            <NotificationsActiveIcon /> 알림
          </h1>
          <FormLabel component="legend">알림 보내고 싶은 회원</FormLabel>
          {memberListError && <div>{memberListError}</div>}
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            className={classes.root}
          >
            <Grid item>{customList("모든 회원", left)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center"></Grid>
            </Grid>
          </Grid>
          <FormLabel component="legend">알림 방식</FormLabel>
          <NotificationsTwoToneIcon /> <MailTwoToneIcon />
          <br />
          <Button
            variant="outlined"
            color="secondary"
            onClick={async () => {
              const token = await firebase.auth().currentUser.getIdToken();
              //console.log(token);
              axios.post(
                "/group/englishgroup/add/announce",
                {
                  announceName: notif.name,
                  description: notif.description,
<<<<<<< HEAD
                  checked: checked.map(item => item.uid),
                  today: notif.today,
=======
                  checked: checked.map((item) => item.uid),
>>>>>>> 5013148943dce7e42c76c0923144ad63af5fa4a3
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              //console.log(checked);
              setNotif({
                group: "",
                name: "",
                description: "", // 알림 방식 수정(추후)
                wayofannounce: "email",
              }); // 공지 내용 초기화
              setChecked([]); // 알림 회원 체크 초기화
            }}
          >
            저장
          </Button>
        </div>
      </Grid>
    </div>
  );
};

export default AddNotif;

const useStyles = makeStyles((theme) => ({
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}
