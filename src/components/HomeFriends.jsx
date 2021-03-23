import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { useAuthState } from "react-firebase-hooks/auth";
import { Badge, Checkbox, ListItemSecondaryAction } from "@material-ui/core";
import { userStore } from "../stores/userStore";
import axios from "axios";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

export default function HomeFriends() {
  const classes = useStyles();
  const [user] = useAuthState(firebase.auth());
  const { state: userDataStore } = useContext(userStore);
  const [shareStatus, setShareStatus] = useState(false);

  const [groupDetails, setGroupDetails] = useState({});

  useEffect(() => {
    userDataStore.groups
      .filter((groupId) => !Object.keys(groupDetails).includes(groupId))
      .map(async (groupId) => {
        const groupData = (
          await axios.get(`/group/${groupId}`, {
            headers: {
              Authorization: `Bearer ${await firebase
                .auth()
                .currentUser.getIdToken()}`,
            },
          })
        ).data.data;
        setGroupDetails((prevState) => ({
          ...prevState,
          [groupId]: groupData,
        }));
      });
  }, [userDataStore.groups]);

  return (
    <List className={classes.root}>
      <ListItem button>
        <ListItemAvatar>
          <StyledBadge
            overlap="circle"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant={shareStatus ? "dot" : "standard"}
          >
            <Avatar
              alt="Example User"
              src={user.photoURL} // TODO
            />
          </StyledBadge>
        </ListItemAvatar>
        <ListItemText primary={user.displayName.replace("학부생", "")} />
        <ListItemSecondaryAction>
          <Checkbox
            edge="end"
            onChange={() => setShareStatus((status) => !status)}
            checked={shareStatus}
            // inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {userDataStore.groups.map((groupId, index) => (
        <React.Fragment key={groupId}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={groupId} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={
                (groupDetails[groupId] && groupDetails[groupId].name) || groupId
              }
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    동아리
                  </Typography>
                  {" — 2교시 10:00-11:15"}
                </React.Fragment>
              }
            />
          </ListItem>
          {/* {userDataStore.friends.active.list < index && (
            <Divider variant="inset" component="li" />
          )} */}
        </React.Fragment>
      ))}
      {userDataStore.friends && userDataStore.friends.active ? (
        userDataStore.friends.active.map((friend, index) => (
          <React.Fragment key={friend._id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={friend.nickname}
                  src="/static/images/avatar/1.jpg"
                />
              </ListItemAvatar>
              <ListItemText
                primary={friend.nickname}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      경제학 입문
                    </Typography>
                    {" — 2교시 10:00-11:15"}
                  </React.Fragment>
                }
              />
            </ListItem>
            {userDataStore.friends.active.list < index && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))
      ) : (
        <p>친구가 없어요</p>
      )}
      {/* <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Example User"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                경제학 입문
              </Typography>
              {" — 2교시 10:00-11:15"}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Summer BBQ"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                C 프로그래밍
              </Typography>
              {" — 2교시 10:00-11:15"}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Oui Oui"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                알수없음
              </Typography>
              {" — 다음수업: 3교시 기독교세계관"}
            </React.Fragment>
          }
        />
      </ListItem> */}
    </List>
  );
}
