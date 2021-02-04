import * as express from "express";
import * as admin from "firebase-admin";

export const calendarRouter = express.Router();

calendarRouter.get("/", async (req, res) => {
  const decodedToken = req.decodedToken;
  return res.json(decodedToken);
});

type Calendar = {
  owner: string;
  ownerName: string;
  permission: "owner" | "write" | "read";
  type: "user" | "group";
};

calendarRouter.post("/:id/events/add", async (req, res) => {
  const { id } = req.params;
  // 유저 정보 불러오기
  const { uid } = req.decodedToken;
  const userData = (
    await admin.firestore().collection("users").doc(uid).get()
  ).data();

  // If User doesn't exist
  if (!userData) {
    return res.sendStatus(404);
  }

  // If user doesn't have permission to add to group
  // users data doesn't contains or does not have permission to write
  if (
    userData.calendars &&
    userData.calendars.filter(
      (calendar: Calendar) =>
        calendar.owner === id &&
        ["owner", "write"].includes(calendar.permission)
    ).length === 0
  )
    return res.sendStatus(403); // Not enough permission

  return res.sendStatus(200);
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
