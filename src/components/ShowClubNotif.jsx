import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
const ShowClubNotif = () => {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  return (
    <div className={classes.root}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={dense}
              onChange={event => setDense(event.target.checked)}
            />
          }
          label="Enable dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={secondary}
              onChange={event => setSecondary(event.target.checked)}
            />
          }
          label="Enable secondary text"
        />
      </FormGroup>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={classes.demo}>
            <List dense={dense}>
              {generate(
                <ListItem>
                  <ListItemText
                    primary="[CRA] 3차 시연회 공지"
                    // primary={
                    //   `${value.displayName}` /* value=collection users에 있는 USERID */
                    // }
                    secondary={secondary ? "2021-02-09" : null}
                  />
                </ListItem>
              )}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ShowClubNotif;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    })
  );
}
