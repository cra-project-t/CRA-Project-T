import * as express from "express";
import * as admin from "firebase-admin";

export const groupRouter = express.Router();

groupRouter.get("/", async (req, res) => {
  const decodedToken = req.decodedToken;
  return res.json(decodedToken);
});

// POST /group/add
groupRouter.post("/add", async (req, res) => {
  const { englishName, name, type, description } = req.body;
  const { uid } = req.decodedToken;

  // 유효성 #1 - 해당 필드들이 존재하여야함.
  if (!englishName || !name || !type || !description) {
    res.status(221).json({
      status: 221,
      error: "필수 필드중 하나가 존재하지 않음.",
    });
  }

  // 유효성 #2 - type 이 club, association, others
  if (!["club", "association", "others"].includes(type)) {
    res.status(221).json({
      status: 221,
      error: "알 수 없는 type",
    });
  }

  const existingDoc = await admin
    .firestore()
    .collection("group")
    .doc(englishName)
    .get();
  if (existingDoc.data()) {
    // 해당 englishName을 가진 데이터가 존재함
    return res.status(409).json({
      status: 409,
      error: "존재하는 항목임",
    });
  }

  // TODO: memberCount 및 members 정의 후에 해당 요청이 문제가 없을경우 해당 유저의 정보에 groups 항목에 해당 그룹을 추가한다.
  const createdDocument = await admin
    .firestore()
    .collection("group")
    .doc(englishName)
    .set({
      name: name,
      type: type,
      description: description,
      owners: [uid],
    });

  return res.json(createdDocument);
});
