import * as express from "express";
import * as admin from "firebase-admin";

export const notifRouter = express.Router();

notifRouter.get("/", async (req, res) => {
  const decodedToken = req.decodedToken;
  return res.json(decodedToken);
});
