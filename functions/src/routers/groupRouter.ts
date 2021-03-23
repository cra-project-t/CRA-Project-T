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
    return res.status(404).json({ status: 404, error: "GROUPDATA NOT FOUND" });

  // 해당 그룹에 멤버 정보가 있는지 확인
  if (!(groupData.members && groupData.members.includes(uid)))
    return res
      .status(403)
      .json({ status: 403, error: "GROUPMEMBER FORBIDDEN", uid });

  const dataPromise = groupData.members.map(async (memberID: string) => {
    const { displayName, photoURL } = await admin.auth().getUser(memberID);
    console.log(displayName);
    return {
      uid: memberID,
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
//새로운 그룹을 추가
groupRouter.post("/add", async (req, res) => {
  const {
    englishName,
    name,
    type,
    description,
    memberCount,
    photoURL,
  } = req.body;
  const { uid } = req.decodedToken;

  // 유효성 #1 - 해당 필드들이 존재하여야함.
  if (
    !englishName ||
    !name ||
    !type ||
    !description ||
    !memberCount ||
    !photoURL
  ) {
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
  return admin
    .firestore()
    .collection("groups")
    .doc(groupID)
    .set({
      name: name,
      type: type,
      description: description,
      owners: [uid], //소유자(만든 사람)이나 멤버나 로그인된 user므로 추가
      members: [uid],
      memberCount: 1, // memberCount 그룹 추가 시 1명이므로
      photoURL: photoURL,
    }) // 주석처리의 중요성 ★
    .then(async () => {
      //문제가 없으면
      try {
        await admin
          .firestore()
          .collection("users")
          .doc(uid)
          .update({
            groups: admin.firestore.FieldValue.arrayUnion(groupID), // 그룹추가 시, 로그인된 유저의 정보에 추가한 그룹을 데이터에 추가
            calendars: admin.firestore.FieldValue.arrayUnion({
              owner: groupID,
              ownerName: name,
              permission: "owner",
              type: "group",
            }),
          });
        return res.send("Success");
      } catch (e) {
        await admin.firestore().collection("groups").doc(groupID).delete();
        return res.status(500).json(e);
      }
    });
});

groupRouter.get("/:userId/groups", async (req, res) => {
  const uid = req.decodedToken.uid;

  try {
    // 데이터베이스에서 해당 유저의 정보 가져오기
    const userData = (
      await admin.firestore().collection("users").doc(uid).get()
    ).data();

    // console.log(uid, userData);

    // DB 에서 해당 데이터를 찾을 수 없는경우.
    if (!userData)
      return res.status(404).json({ status: 404, error: "USERDATA NOT FOUND" });

    // 해당 유저 그룹에 그룹 정보가 있는지 확인

    // 유저의 그룹 정보 데이터 반환
    return res.json({
      status: "200",
      data: userData.groups || [], // Group ID
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: 500, error: "Server error", e });
  }
});

groupRouter.post("/:groupId/add/announce", async (req, res) => {
  const groupId = req.params.groupId.toLowerCase();
  const {
    announceName,
    description,
    wayofannounce = "email",
    checked,
  } = req.body;
  const { uid } = req.decodedToken;

  // 유효성 #1 - 해당 필드들이 존재하여야함.
  if (!announceName || !description || !wayofannounce || !checked) {
    return res.status(221).json({
      status: 221,
      error: "필수 필드중 하나가 존재하지 않음.",
    });
  }
  //유효성 #2 wayofannounce가 정의되어 있는 옵션 중 하나인지 확인
  if (!["email", "notification"].includes(wayofannounce)) {
    return res.status(221).json({
      status: 221,
      error: "알 수 없는 type",
    });
  }
  // TODO: memberCount 및 members 정의 후에 해당 요청이 문제가 없을경우
  // 해당 유저의 정보에 notifs 항목에 해당 그룹을 추가한다.
  try {
    const groupdata = (
      await admin.firestore().collection("groups").doc(groupId).get()
    ).data();
    if (!groupdata) {
      return res.sendStatus(404);
    }
    if (!(groupdata.owners && groupdata.owners.includes(uid))) {
      return res.sendStatus(403);
    }
    const checkArr = checked.filter(
      (member: string) => groupdata.members.indexOf(member) === -1
    );
    if (checkArr.length) {
      return res.sendStatus(400);
    }
    await admin
      .firestore()
      .collection("groups")
      .doc(groupId)
      .collection("announcements")
      .add({
        announceName,
        description,
        wayofannounce,
        checked,
        created: admin.firestore.Timestamp.fromDate(new Date()),
      });
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: 500, error: "Server error" });
  }

  // if(!memberCount){
  // admin.firestore().collection("users").doc(uid).set({...createdDocument, group: name});
  // }
  return;
});

groupRouter.get("/:groupId", async (req, res) => {
  //const uid = req.decodedToken.uid;
  const groupId = req.params.groupId.toLowerCase();

  // 데이터베이스에서 해당 그룹 정보 가져오기
  const groupData = (
    await admin.firestore().collection("groups").doc(groupId).get()
  ).data();

  // DB 에서 해당 데이터를 찾을 수 없는경우.
  if (!groupData)
    return res
      .status(404)
      .json({ status: 404, error: "데이터를 찾을 수 없습니다." });

  // 유저 정보 데이터 반환
  return res.json({
    status: "200",
    data: groupData,
  });
});

groupRouter.post("/:groupId", async (req, res) => {
  const uid = req.decodedToken.uid;
  // const { uid } = req.decodedToken; // decodedToken은 오브젝트, {uid}는 decodedToken 안의 uid를 쓰겠다고 선언하는 것
  const groupId = req.params.groupId.toLowerCase();
  // const { checkGroup } = req.body;
  const checkGroup = req.body.checkGroup; //인생의 교훈: 아는 것만 복붙
  if (!checkGroup) {
    return res.status(221).json({ status: 221, error: "필드 존재X" });
  }

  try {
    // 1 - group 에 유저 정보 추가.
    await admin
      .firestore()
      .collection("groups")
      .doc(groupId)
      .update({
        members: admin.firestore.FieldValue.arrayUnion(uid),
        memberCount: admin.firestore.FieldValue.increment(1), //firebase대신 admin권한
      });

    // 2 - 유저 정보에 그룹 데이터 추가.
    await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .update({
        groups: admin.firestore.FieldValue.arrayUnion(groupId),
        calendars: admin.firestore.FieldValue.arrayUnion({
          owner: groupId,
          ownerName: groupId,
          permission: "read",
          type: "group",
        }),
      });
    //checkGroup.update(groupId); //일케 못하는듯..?->배열이니까+post로 받은 데이타(ex. firestore에서 받아온 데이타가져와서 get이나 add등의 함수 기능 X)는 함수로 만들 수 없다(map이나 split 등의 함수 자체로 받을 수 있으나)

    return res.json({
      status: "200",
    });
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
  // 데이터베이스에서 해당 그룹 정보 가져오기
  // const groupList: any = [];
  // await admin
  //   .firestore()
  //   .collection("groups")
  //   .get()
  //   .then(function (querySnapshot) {
  //     querySnapshot.forEach(function (doc) {
  //       // doc.data() is never undefined for query doc snapshots
  //       console.log(doc.id, " => ", doc.data());
  //       groupList.push(doc.data());
  //     });
  //   });
  /*

데이터를 어떻게 줄까? 

{}vs[]

cra 데이타
documentID: cra
{
  name: "크라",
  members: ["유정섭", "강하림"]
}
방법1: list에 추가(나열) ===> documentID가 없기에 안에 _id형식으로 넣어준다.
const groupList = [
  {
    _id: "cra1"
    name: "크라",
    members: ["유정섭", "강하림"]
  },
  {
    name: "크라",
    members: ["유정섭", "강하림"]
  },
  {
    name: "크라",
    members: ["유정섭", "강하림"]
  }
]

find, map, sort, filter, ... 루프. 반복문. ===> 시간 多
groupList.find(group => group._id === "cra1")
=>
{
  _id: "cra1"
  name: "크라",
  members: ["유정섭", "강하림"]
}


파이썬 딕셔너리 / 자바스크립트 오브젝트 ===> 그럼에도 불구하고 단점: object는 map, reduce,...반복문 X
const groupList = {
  cra1: {
    name: "크라",
    members: ["유정섭", "강하림"]
  },
  cra2: {
    name: "크라",
    members: ["유정섭", "강하림"]
  }
}


groupList.cra1

object 는 map, reduce, find, sort (X)

*/
  // reduce: 1. accumulate(callback) 함수, 2. 초기값
  // array into object
  // groupData.docs.reduce((prv, cur) => {}, {});
});

groupRouter.get("/all", async (req, res) => {
  const groupList = await admin.firestore().collection("groups").get();

  if (!groupList)
    return res
      .status(404)
      .json({ status: 404, error: "데이터를 찾을 수 없습니다." });

  return res.json({
    status: "200",
    data: groupList.docs.map(doc => doc.data()),
  });
});
