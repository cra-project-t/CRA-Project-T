import { Menu, MenuItem } from "@material-ui/core";
import React from "react";
import FriendRequest from "./Dialog/FriendRequest";

const Notifications = ({
  anchorEl: notificationEl,
  open: isNotificationOpen,
  onClose,
  userDataStore,
}) => {
  return (
    <Menu
      id="simple-menu"
      anchorEl={notificationEl}
      keepMounted
      open={isNotificationOpen}
      onClose={onClose}
    >
      {userDataStore.notifications &&
        userDataStore.notifications.map((notification) => (
          <FriendRequest notification={notification} />
        ))}
    </Menu>
  );
};

export default Notifications;
