import * as express from "express";
import * as admin from "firebase-admin";

export const groupRouter = express.Router();

groupRouter.get("/", async (req, res) => {
  const decodedToken = req.decodedToken;
  return res.json(decodedToken);
});

groupRouter.get("/:groupId/members", async (req, res) => {
  const uid = req.decodedToken.uid;
  const groupId = req.params.groupId.toLowerCase();

  // 데이터베이스에서 해당 그룹 정보 가져오기
  const groupData = (
    await admin.firestore().collection("groups").doc(groupId).get()
  ).data();

  console.log(uid, groupData);

  // DB 에서 해당 데이터를 찾을 수 없는경우.
  if (!groupData)
    return res.status(404).json({ status: 404, error: "NOT FOUND" });

  // 해당 그룹에 멤버 정보가 있는지 확인
  if (!(groupData.members && groupData.members.includes(uid)))
    return res.status(403).json({ status: 403, error: "FORBIDDEN", uid });

  const dataPromise = groupData.members.map(async (memberID: string) => {
    const { displayName, photoURL } = await admin.auth().getUser(memberID);
    console.log(displayName);
    return {
      displayName,
      photoURL,
    };
  });

  // 유저 정보 데이터 반환
  return res.json({
    status: "200",
    data: await Promise.all(dataPromise),
  });
});

// POST /group/add
groupRouter.post("/add", async (req, res) => {
  const { englishName, name, type, description, memberCount } = req.body;
  const { uid } = req.decodedToken;

  // 유효성 #1 - 해당 필드들이 존재하여야함.
  if (!englishName || !name || !type || !description || !memberCount) {
    return res.status(221).json({
      status: 221,
      error: "필수 필드중 하나가 존재하지 않음.",
    });
  }

  // 유효성 #2 - type 이 club, association, others
  if (!["club", "association", "others"].includes(type)) {
    return res.status(221).json({
      status: 221,
      error: "알 수 없는 type",
    });
  }
  // 유효성 #3 - englishName에 space가 있으면 안된다. 소문자 변환
  if (englishName.includes(" ")) {
    return res.status(221).json({
      status: 221,
      error: "englishName에 space가 존재함",
    });
  }

  const existingDoc = await admin
    .firestore()
    .collection("groups")
    .doc(englishName.toLowerCase())
    .get();
  if (existingDoc.data()) {
    // 해당 englishName을 가진 데이터가 존재함
    return res.status(409).json({
      status: 409,
      error: "존재하는 항목임",
    });
  }

  const groupID = englishName.trim().toLowerCase();
  // TODO: memberCount 및 members 정의 후에 해당 요청이 문제가 없을경우
  // 해당 유저의 정보에 groups 항목에 해당 그룹을 추가한다.
  admin
    .firestore()
    .collection("groups")
    .doc(groupID)
    .set({
      name: name,
      type: type,
      description: description,
      owners: [uid],
      members: [uid],
      memberCount: 1, // memberCount 그룹 추가 시 1명이므로
    })
    .then(async () => {
      //문제가 없음
      try {
        await admin
          .firestore()
          .collection("users")
          .doc(uid)
          .update({
            groups: admin.firestore.FieldValue.arrayUnion(groupID),
          });
        return res.send("Success");
      } catch (e) {
        admin.firestore().collection("groups").doc(groupID).delete();
        return res.status(500).json(e);
      }
    });

  // if(!memberCount){
  // admin.firestore().collection("users").doc(uid).set({...createdDocument, group: name});
  // }
  return;
});
