import * as express from "express";
import * as admin from "firebase-admin";
import Ajv, { JSONSchemaType } from "ajv";

export const calendarRouter = express.Router();
const ajv = new Ajv();

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

type AddCalendarBody = {
  allDay: boolean;
  startTime: number;
  endTime: number;
  eventName: string;
  eventDescription: string;
};
const addCalendarBodySchema: JSONSchemaType<AddCalendarBody> = {
  type: "object",
  properties: {
    allDay: {
      type: "boolean",
    },
    startTime: {
      type: "number",
    },
    endTime: {
      type: "number",
    },
    eventName: {
      type: "string",
    },
    eventDescription: {
      type: "string",
    },
  },
  required: ["allDay", "startTime", "endTime", "eventName", "eventDescription"],
};
const addCalendarBodyValidate = ajv.compile(addCalendarBodySchema);

calendarRouter.post("/:id/events/add", async (req, res) => {
  const { id } = req.params;
  // 유저 정보 불러오기
  const { uid } = req.decodedToken;

  // Validate Data
  if (!addCalendarBodyValidate(req.body))
    return res.status(422).json(addCalendarBodyValidate.errors);

  const userData = (
    await admin.firestore().collection("users").doc(uid).get()
  ).data();

  // If User doesn't exist
  if (!userData) {
    return res.sendStatus(404);
  }

  // If user doesn't have permission to add to group
  // users data doesn't contains or does not have permission to write
  const calendar: Calendar =
    userData.calendars &&
    userData.calendars.find(
      (_calendar: Calendar) =>
        _calendar.owner === id &&
        ["owner", "write"].includes(_calendar.permission)
    );
  if (!calendar) return res.sendStatus(403); // Not enough permission

  const { allDay, startTime, endTime, eventName, eventDescription } = req.body;

  await admin
    .firestore()
    .collection(`${calendar.type}s`)
    .doc(calendar.owner)
    .collection("events")
    .add({
      allDay,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      eventName,
      eventDescription,
    });

  return res.sendStatus(200);
});

calendarRouter.get("/myEvents", async (req, res, next) => {
  try {
    // Get UID
    const { uid } = req.decodedToken;

    // Get user data from db
    const userData = (
      await admin.firestore().collection("users").doc(uid).get()
    ).data();

    // Check if user have calendars information
    if (!userData?.calendars) return res.json({ response: [] });

    console.log(
      `[calendarRouter:Get] Will respond with ${userData.calendars.length} items`
    );

    // Get all calendar information
    const userCalendarInfoPromise: Promise<
      FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
    >[] = userData.calendars.map((calendar: Calendar) => {
      return admin
        .firestore()
        .collection(`${calendar.type}s`)
        .doc(calendar.owner)
        .collection("events")
        .get();
    });

    const userCalendarInfoResponse = (
      await Promise.all(userCalendarInfoPromise)
    ).reduce((prev: any, data) => {
      return [
        ...prev,
        ...data.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          startTime: doc.data().startTime.toDate(),
          endTime: doc.data().endTime.toDate(),
        })),
      ];
    }, []);
    console.log(userCalendarInfoResponse);
    return res.json(userCalendarInfoResponse);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

// @deprecated - Will be removed in the future.
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
