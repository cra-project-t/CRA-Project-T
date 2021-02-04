import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { config } from "./config";
import { groupRouter } from "./routers/groupRouter";
import { checkAuth } from "./middlewares/checkAuth";
import { userRouter } from "./routers/userRouter";
import { notifRouter } from "./routers/notifRouter";

const app = express();

app.use(
  cors({
    origin: config.client,
  })
);

admin.initializeApp({});

// Work Time Management
// app.use("/worktime", checkAuth, workTimeRouter);

app.use("/group", checkAuth, groupRouter);
app.use("/user", checkAuth, userRouter);
app.use("/notif", checkAuth, notifRouter);

app.use("/", (req, res) => {
  res.send("Hello World!!");
});

exports.app = functions.region("asia-northeast3").https.onRequest(app);
