require("dotenv").config();

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { config } from "./config";
import { groupRouter } from "./routers/groupRouter";
import { checkAuth } from "./middlewares/checkAuth";
import { userRouter } from "./routers/userRouter";
import { notifRouter } from "./routers/notifRouter";
import { calendarRouter } from "./routers/calendarRouter";

const app = express();

app.use(
  cors({
    origin: config.client,
  })
);

admin.initializeApp({});

// Work Time Management
// app.use("/worktime", checkAuth, workTimeRouter);

app.use("/calendar", checkAuth, calendarRouter);
app.use("/group", checkAuth, groupRouter);
app.use("/user", checkAuth, userRouter);
app.use("/notif", checkAuth, notifRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

exports.app = functions.region("asia-northeast3").https.onRequest(app);
