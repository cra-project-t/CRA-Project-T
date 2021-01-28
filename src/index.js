import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

import App from "./App";

import firebaseConfig from "./config/firebaseConfig";
import { uriList } from "./uriList.js";

// Axios Setup
axios.defaults.baseURL = uriList.app;

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
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
