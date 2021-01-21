import ReactDOM from "react-dom";
import firebase from "firebase/app";
import "firebase/auth";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

import App from "./App";

import firebaseConfig from "./config/firebaseConfig";

// Firebase Setup
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

// Material UI Setup
const theme = createMuiTheme({
  // Style
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Nanum Gothic"',
      "Gulim",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
