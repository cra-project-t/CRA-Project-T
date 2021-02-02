import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  TextField,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import axios from "axios";
import firebase from "firebase";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  searchField: {
    flexGrow: 1,
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  // List
  list: {
    width: "100%",
    // maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  // BackDrop
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  // Dialogue
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const SearchFriends = (props) => {
  const Button = props.button
    ? (pr) => ({ ...props.button, props: { ...props.button.props, ...pr } })
    : () => null;
  const [open, setOpen] = useState(!Button());
  const [searchResult, setSearchResult] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [sendResult, setSendResult] = useState({});
  const classes = useStyles();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    const token = await firebase.auth().currentUser.getIdToken();
    setSearchResult(undefined);
    axios
      .post(
        "/user/search",
        {
          niddle: searchInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => setSearchResult(res.data));
  };

  const sendFriendRequest = async (to) => {
    setSendResult(undefined);
    const token = await firebase.auth().currentUser.getIdToken();
    const result = await axios
      .post(
        "/user/request",
        {
          to,
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
  };

  const changeOpen = (open) => {
    // Reset State
    setSearchResult(null);
    setSearchInput("");
    setSendResult({});
    setOpen(open);
  };
  return (
    <>
      <Button onClick={() => changeOpen(true)} />
      <Dialog open={open} onClose={() => changeOpen(false)} fullWidth>
        <Backdrop className={classes.backdrop} open={sendResult === undefined}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog
          open={
            open && sendResult && sendResult.to && sendResult.from
              ? true
              : false
          }
        >
          <DialogTitle>친구 요청을 보냈습니다</DialogTitle>
          <DialogContent>
            <DialogContentText>
              친구의 요청 승인을 기다리고 있습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => changeOpen(false)}>확인</Button>
          </DialogActions>
        </Dialog>
        <DialogTitle>
          친구 검색하기{" "}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => changeOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div>
            <Grid container>
              <Grid item className={classes.searchField}>
                <TextField
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  fullWidth
                  placeholder="닉네임만 검색 가능"
                  onKeyDown={handleKeyDown}
                />
              </Grid>
              <Grid item className={classes.button}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                >
                  검색
                </Button>
              </Grid>
            </Grid>
          </div>
          <div>
            {searchResult === null ? (
              <p>검색해보세요</p>
            ) : searchResult === undefined ? (
              <p>검색중</p>
            ) : Object.keys(searchResult).length == 0 ? (
              <p>검색결과 없음</p>
            ) : (
              <List className={classes.list}>
                {searchResult.map(({ _id, picture, nickname, major }) => (
                  <ListItem
                    key={_id}
                    button
                    disabled={firebase.auth().currentUser.uid === _id}
                    onClick={() => sendFriendRequest(_id)}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar alt={nickname} src={picture} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${nickname}${
                        firebase.auth().currentUser.uid === _id ? " (나)" : ""
                      }`}
                      secondary={<React.Fragment>{major}</React.Fragment>}
                    />
                  </ListItem>
                ))}
                {/* <Divider variant="inset" component="li" /> */}
              </List>
            )}
          </div>
          {sendResult && sendResult.status && (
            <Alert severity="error">
              <AlertTitle>{sendResult.status}</AlertTitle>
              <pre>{sendResult.data}</pre>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchFriends;
