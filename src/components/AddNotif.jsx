import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import NotificationsTwoToneIcon from "@material-ui/icons/NotificationsTwoTone";
import MailTwoToneIcon from "@material-ui/icons/MailTwoTone";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import firebase from "firebase";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import { userStore } from "../stores/userStore"; //사이트에서 통합적으로 정보 불러올 수 있도록.

const AddNotif = (props) => {
  const classes = useStyles();
  const Button = props.button
    ? (pr) => ({ ...props.button, props: { ...props.button.props, ...pr } })
    : () => null;
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const { state: userDataStore } = useContext(userStore);
  const [notif, setNotif] = useState({
    group: "",
    name: "",
    description: "", //보내고 싶은 회원, 알림 방식추가하기
    wayofannounce: "email",
  });
  const [checked, setChecked] = React.useState([]);
  const [memberList, setMemberList] = React.useState([]);

  const [memberListError, setMemberListError] = useState("");
  const [memberListLoading, setMemberListLoading] = useState(false);

  // Group의 members정보 받아오기
  useEffect(() => {
    setMemberListError("");
    setMemberListLoading(true);
    // Axios post body data 넣는 방법
    notif.group &&
      firebase
        .auth()
        .currentUser.getIdToken()
        .then((token) => {
          axios
            .get(`/group/${notif.group}/members`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => setMemberList(res.data && res.data.data))
            .catch((e) => {
              setMemberListError(e.response.data.error);
              setMemberList([]);
            })
            .finally(() => setMemberListLoading(false));
          console.log(token);
        });
  }, [notif.group]);

  const handleToggle = (value) => () => {
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

  const checkMemberList = (title, members) => (
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
  const saveNotif = async () => {
    const token = await firebase.auth().currentUser.getIdToken();
    axios.post(
      `/group/${notif.group}/add/announce`,
      {
        announceName: notif.name,
        description: notif.description,
        checked: checked.map((item) => item.uid),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(token);
    setNotif({
      group: "",
      name: "",
      description: "", // 알림 방식 수정(추후)
      wayofannounce: "email",
    }); // 공지 내용 초기화
    setChecked([]); // 알림 회원 체크 초기화
    setOpen(false);
  };

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    const group = e.target.name;
    setNotif({
      ...notif,
      [group]: e.target.value,
    });
  };

  return (
    <>
      <Button onClick={handleClickOpen("paper")} />
      <Dialog open={open} onClose={handleClose} scroll={scroll} fullWidth>
        <DialogTitle id="scroll-dialog-title">
          공지 추가
          <NotificationsIcon />
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
            <FormControl className={classes.formControl}>
              <FormLabel component="legend">공지 대상 그룹: </FormLabel>
              <NativeSelect
                onChange={handleChange}
                value={notif.group}
                inputProps={{
                  name: "group",
                  id: "notifgroup",
                }}
              >
                <option aria-label="None" value="" />
                {userDataStore.groups &&
                  userDataStore.groups.map((group) => (
                    <React.Fragment key={group}>
                      <option value={group}>{group}</option>
                    </React.Fragment>
                  ))}
              </NativeSelect>
              <FormHelperText>GROUP TYPE를 선택해주세요</FormHelperText>
            </FormControl>
          </div>
          <FormLabel component="legend">제목: </FormLabel>
          <br />
          <TextField
            id="outlined-textarea"
            placeholder="공지 제목을 입력해주세요"
            fullWidth
            multiline
            variant="outlined"
            value={notif.name}
            onChange={(e) => setNotif({ ...notif, name: e.target.value })}
            rows={1}
          />
          <br />
          <br />
          <div>
            <FormLabel component="legend">내용: </FormLabel>
            <br />
            <TextField
              id="outlined-textarea"
              placeholder="공지 설명을 입력해주세요"
              fullWidth
              multiline
              variant="outlined"
              value={notif.description}
              onChange={(e) =>
                setNotif({ ...notif, description: e.target.value })
              }
              rows={4}
            />
          </div>
          <br />
          <FormLabel component="legend">첨부파일: (추후 추가예정)</FormLabel>
          <br />
          <h3>
            <NotificationsActiveIcon /> 알림
          </h3>
          <FormLabel component="legend">알림 보내고 싶은 회원</FormLabel>
          <br />
          {memberListError && (
            <div>
              <Alert severity="error">{memberListError}</Alert>
            </div>
          )}
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
            className={classes.root}
          >
            <Grid item>{checkMemberList("모든 회원", memberList)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center"></Grid>
            </Grid>
          </Grid>
          <br />
          <FormLabel component="legend">알림 방식</FormLabel>
          <br />
          <NotificationsTwoToneIcon /> <MailTwoToneIcon />
          <br />
          <DialogActions>
            <Button variant="outlined" color="secondary" onClick={saveNotif}>
              저장
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
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
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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
