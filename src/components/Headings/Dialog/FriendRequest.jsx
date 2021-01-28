import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  MenuItem,
} from "@material-ui/core";
import firebase from "firebase";
import axios from "axios";
import React, { useState } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  // BackDrop
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const FriendRequest = ({ notification }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [sendResult, setSendResult] = useState({});
  const changeOpen = (open) => {
    // Reset State
    setSendResult({});
    setOpen(open);
  };
  return (
    <>
      <Dialog open={open} onClose={() => changeOpen(false)}>
        <Backdrop className={classes.backdrop} open={sendResult === undefined}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle>친구요청</DialogTitle>
        <DialogContent>
          <DialogContentText>{notification.message}</DialogContentText>
          {sendResult && sendResult.status && (
            <Alert severity="error">
              <AlertTitle>{sendResult.status}</AlertTitle>
              <pre>{sendResult.data}</pre>
            </Alert>
          )}
          {sendResult && sendResult.from && sendResult.to && (
            <Alert severity="success">
              <AlertTitle>친구추가 승인</AlertTitle>
              <p>당신은 이제 친구입니다.</p>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => changeOpen(false)}>닫기</Button>
          <Button
            color="primary"
            onClick={async () => {
              setSendResult(undefined);
              const token = await firebase.auth().currentUser.getIdToken();
              const result = await axios
                .post(
                  "/user/request/approve",
                  {
                    from: notification.from,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((doc) => doc.data)
                .catch((e) => ({
                  status: e.response.status,
                  data: JSON.stringify(e.response.data, true, 2),
                }));
              console.log(result);
              setSendResult(result);
            }}
          >
            수락
          </Button>
        </DialogActions>
      </Dialog>
      <MenuItem
        onClick={() => changeOpen(true)}
        key={notification.created.seconds}
      >
        {notification.message}
      </MenuItem>
    </>
  );
};

export default FriendRequest;
