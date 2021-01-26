import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  IconButton,
  Button,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

function TitleBar({ drawerWidth }) {
  const open = false;
  const classes = makeStyles((theme) => ({
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    title: {
      flexGrow: 1,
    },
  }))();

  // Set Document Title
  document.title = "Project T";

  return (
    <Grid item xs={12}>
      <AppBar
        position="static"
        className={`${classes.appBar} ${open && classes.appBarShift}`}
      >
        <Toolbar>
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => dispatch({ type: "NAVOPEN" })}
            edge="start"
            className={`${classes.menuButton} ${open && classes.hide}`}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography className={classes.title}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              <strong>Project T</strong>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </Grid>
  );
}

export default TitleBar;
