import React from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      position: "fixed",
      right: 10,
      bottom: 10,
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function HomeAddActionIcon() {
  const classes = useStyles();

  return ReactDOM.createPortal(
    <div className={classes.root}>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </div>,
    document.getElementById("root-action")
  );
}
