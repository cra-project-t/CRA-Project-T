import React from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
<<<<<<< HEAD
import HomeClubNotif from "./HomeClubNotif";
=======
import ShowClubNotif from "./ShowClubNotif";
>>>>>>> e64670bace7147503d1ec4be3d45cc49f16d4d44

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container>
          <Box>
            {/*P TAG REMOVED ←<div> cannot appear as a descendant of <p>*/}
            <Typography component="span">{children}</Typography>
          </Box>
        </Container>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // width: 500,
  },
  tab: {
    minWidth: 100,
  },
}));

export default function HomeAnnouncements() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="학교" {...a11yProps(0)} className={classes.tab} />
          <Tab label="동아리" {...a11yProps(1)} className={classes.tab} />
          <Tab label="학회" {...a11yProps(2)} className={classes.tab} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          학교 공지
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
<<<<<<< HEAD
          <HomeClubNotif />
=======
          <ShowClubNotif />
>>>>>>> e64670bace7147503d1ec4be3d45cc49f16d4d44
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          학회 공지
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
