import React from "react";
import ReactDOM from "react-dom";
import { Grid, Paper } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import TitleBar from "./TitleBar";

const open = false;

function Heading({ drawerWidth, classes }) {
  return ReactDOM.createPortal(
    <React.Fragment>
      <Grid container>
        <TitleBar />
        <Grid item xs={12}>
          <Paper
            elevation={0}
            className={`${classes.content} ${open && classes.contentShift}`}
          ></Paper>
        </Grid>
      </Grid>
    </React.Fragment>,
    document.getElementById("root-heading")
  );
}

export default Heading;
