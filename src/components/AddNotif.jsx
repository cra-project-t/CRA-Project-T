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

const AddNotif = () => {
  const classes = useStyles();
  const currentUserId = "uid1"; // 이후 uid7을 이용해 추가확인
  const [notif, setNotif] = useState({
    group: "",
    name: "",
    content: "", //보내고 싶은 회원, 알림 방식추가하기
  });

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [groupname, setGroupname] = React.useState([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection("group")
      .doc("grp3")
      .get()
      .then(doc => {
        setLeft(doc.data().members);
      });
  }, []);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const numberOfChecked = members => intersection(checked, members).length; // members가 어디 정의된 건지 모름;;;;;

  const handleToggleAll = members => () => {
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
        {members.map(value => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItem
              key={value}
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
                primary={`${value}` /* value=collection users에 있는 USERID */}
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );
  useEffect(() => {
    firebase
      .firestore()
      .collection("group")
      .doc("grp3")
      .get()
      .then(doc => {
        setGroupname(doc.data().name);
      });
  }, []);
  return (
    <div>
      <Grid container item justify="center">
        <div className={classes.root}>
          <h1>
            공지 추가
            <NotificationsIcon />
          </h1>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="notifgroup">GROUP TYPE</InputLabel>
              <NativeSelect
                value={notif.group}
                onChange={e => setNotif({ ...notif, group: e.target.value })}
                inputProps={{
                  name: "age",
                  id: "notifgroup",
                }}
              >
                <option aria-label="None" value="" />
                <option value={"groupname"}>{groupname}</option>
                {/* <option value={"club"}>동아리</option>               
                <option value={"others"}>기타</option> 배열로 참고하기 */}
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
            onChange={e => setNotif({ ...notif, name: e.target.value })}
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
              value={notif.content}
              onChange={e => setNotif({ ...notif, content: e.target.value })}
              rows={4}
            />
          </div>
          <FormLabel component="legend">첨부파일: (추후 추가예정)</FormLabel>
          <br />
          <h1>
            <NotificationsActiveIcon /> 알림
          </h1>
          <FormLabel component="legend">알림 보내고 싶은 회원</FormLabel>
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
            onClick={() => {
              console.log(checked);
              //   firebase
              //     .firestore()
              //     .collection("notif")
              //     .add({
              //       ...notif,
              //     });
              // }}
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
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}
