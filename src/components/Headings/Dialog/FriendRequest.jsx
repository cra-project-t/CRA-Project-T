import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from "@material-ui/core";
import React, { useState } from "react";

const FriendRequest = ({ notification }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>친구요청</DialogTitle>
        <DialogContent>
          <DialogContentText>{notification.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>닫기</Button>
          <Button color="primary">수락</Button>
        </DialogActions>
      </Dialog>
      <MenuItem
        onClick={() => setOpen(true)}
        key={notification.created.seconds}
      >
        {notification.message}
      </MenuItem>
    </>
  );
};

export default FriendRequest;
