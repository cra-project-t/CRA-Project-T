import * as express from "express";
import * as admin from "firebase-admin";

export const calendarRouter = express.Router();

calendarRouter.get("/", async (req, res) => {
  const decodedToken = req.decodedToken;
  return res.json(decodedToken);
});

calendarRouter.get("/:id/events", async (req, res) => {
  const { id } = req.params;
  const { uid } = req.decodedToken;

  // Get Calendar Data from database
  const calendarInfo = (
    await admin.firestore().collection("calendars").doc(id).get()
  ).data();

  // Calendar Not Found
  if (!calendarInfo) {
    return res.status(404).json({
      status: 404,
      error: `${id} Not Found`,
    });
  }

  // Ownership Check
  if (calendarInfo.ownerId !== uid) {
    return res.status(403).json({
      status: 403,
      error: `Not Enough Permission`,
      uid,
    });
  }

  // TODO: Add Visibility Check

  const eventsInfo = (
    await admin
      .firestore()
      .collection("calendars")
      .doc(id)
      .collection("plans")
      .get()
  ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return res.json(eventsInfo);
});
