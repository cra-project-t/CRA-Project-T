// @ts-nocheck

import * as admin from "firebase-admin";
import * as cred from "../secrets/firebase-admin.json";
// const cred = require("../secrets/firebase-admin.json");

admin.initializeApp({
  projectId: "cra-project-t",
  credential: admin.credential.cert(cred),
});

(async () => {
  const data = (
    await admin.firestore().collection("groups").get()
  ).docs.map(doc => doc.data());
  return console.log(data);
})();
