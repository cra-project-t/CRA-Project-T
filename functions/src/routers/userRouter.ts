import * as express from "express";
import * as admin from "firebase-admin";

export const userRouter = express.Router();

userRouter.post("/search", async (req, res) => {
  const { uid, name } = req.decodedToken;
  const { niddle } = req.body;

  if (!niddle)
    return res.status(221).json({
      status: 221,
      error: "필수 필드중 하나가 존재하지 않음.",
    });

  console.log(`${name}(${uid}) searched for ${niddle}`);
  const foundData = (
    await admin
      .firestore()
      .collection("users")
      .where("nickname", "==", niddle)
      .get()
  ).docs.map((data) => ({
    _id: data.id,
    nickname: data.data().nickname,
    major: data.data().major || "",
    picture: data.data().picture || "",
  }));
  // if (foundData.length == 0)
  //   return res
  //     .status(404)
  //     .json({ status: 404, error: "NO USER FOUND WITH NIDDLE" });
  return res.send(foundData);
});

type FriendUser = {
  from: string;
  requestDate: admin.firestore.Timestamp;
};
type Friend = {
  _id: string;
  nickname: string;
  since: admin.firestore.Timestamp;
};
type ToFriendUser = {
  to: string;
  requestDate: admin.firestore.Timestamp;
};

userRouter.post("/request", async (req, res) => {
  const { uid, name } = req.decodedToken;
  const { to } = req.body;

  // 대상 정의 X
  if (!to)
    return res.status(406).json({
      status: 406,
      error: "필수 필드중 하나가 존재하지 않음.",
    });

  // 만약에 테스트 모드일경우 from 을 활용해 전송인을 변경할 수 있다.
  let from = uid;
  if (req.body.from && process.env.NODE_ENV?.toLowerCase() !== "production") {
    console.warn("Development Mode - From 임의 설정 by ", uid);
    from = req.body.from;
  }

  // from 과 to 는 다른 유저야함
  if (from === to) {
    return res.status(406).json({
      status: 406,
      error: "to와 from 은 다른 유저야합니다.",
      to,
      from,
    });
  }

  const toData = (
    await admin.firestore().collection("users").doc(to).get()
  ).data();

  // 유저를 찾을 수 없는경우
  if (!toData)
    return res.status(404).json({ status: 404, error: "NO TO USER FOUND" });

  // TO 유저가 해당 유저로부터 이미 친구 요청을 받았을경우.
  if (toData.friends?.incoming?.find((data: FriendUser) => data.from === from))
    return res.status(400).json({ status: 400, error: "Already Requested" });

  // To 유저가 해당 유저에게 이미 친구 요청을 보냈는 경우.
  if (toData.friends?.pending?.find((data: ToFriendUser) => data.to === from))
    return res
      .status(400)
      .json({ status: 400, error: "Same Incoming Request" });

  // 이미 친구인경우
  if (toData.friends?.active?.find((data: Friend) => data._id === from))
    return res.status(400).json({ status: 400, error: "Already Friend" });

  // 요청 보내기
  const requestDate = admin.firestore.Timestamp.fromDate(new Date());
  try {
    // 받는 사람에게 추가
    await admin
      .firestore()
      .collection("users")
      .doc(to)
      .update({
        "friends.incoming": admin.firestore.FieldValue.arrayUnion(<FriendUser>{
          from,
          requestDate,
        }),
        notifications: admin.firestore.FieldValue.arrayUnion({
          message: `${name}님에게서 친구 요청을 받으셨습니다.`,
          created: requestDate,
          type: "friendRequest",
          from,
        }),
      });

    // 보내는 사람에게 추가
    await admin
      .firestore()
      .collection("users")
      .doc(from)
      .update({
        "friends.pending": admin.firestore.FieldValue.arrayUnion(<ToFriendUser>{
          to,
          requestDate,
        }),
      });

    // Success
    return res.json({
      from,
      to,
    });
  } catch (e) {
    console.error("Error While Sending Friend Request");
    console.error(e);

    // 받는 사람에게 제거
    await admin
      .firestore()
      .collection("users")
      .doc(to)
      .update({
        friends: {
          incoming: admin.firestore.FieldValue.arrayRemove(<FriendUser>{
            from,
            requestDate,
          }),
        },
      });

    // 보내는 사람에게 제거
    return await admin
      .firestore()
      .collection("users")
      .doc(from)
      .update({
        friends: {
          pending: admin.firestore.FieldValue.arrayRemove(<ToFriendUser>{
            to,
            requestDate,
          }),
        },
      });

    // Delete Pending User Data.
  }
});

userRouter.post("/request/approve", async (req, res) => {
  const { uid } = req.decodedToken;
  const { from } = req.body;

  if (!from)
    return res.status(406).json({
      status: 406,
      error: "필수 필드중 하나가 존재하지 않음.",
    });

  // 유저 프로필에 진짜 요청이 있는지 확인
  const userData = (
    await admin.firestore().collection("users").doc(uid).get()
  ).data();
  if (!userData)
    return res
      .status(404)
      .json({ status: 404, error: "NO REQUESTED USER FOUND" });

  // 해당 유저가 요청을 안받았을경우
  const userIncoming = userData.friends?.incoming?.find(
    (data: FriendUser) => data.from === from
  );
  if (!userIncoming)
    return res
      .status(400)
      .json({ status: 400, error: "User didn't receieved invitation" });

  const fromData = (
    await admin.firestore().collection("users").doc(from).get()
  ).data();
  if (!fromData)
    return res.status(404).json({ status: 404, error: "NO FROM USER FOUND" });

  // To 유저가 해당 유저에게 이미 친구 요청을 보냈는 경우.
  const fromPending = fromData.friends?.pending?.find(
    (data: ToFriendUser) => data.to === uid
  );
  if (!fromPending)
    return res
      .status(400)
      .json({ status: 400, error: "User didn't sended the request" });

  // 이미 친구인경우
  if (userData.friends?.active?.find((data: Friend) => data._id === from))
    return res.status(400).json({ status: 400, error: "Already Friend" });

  // 친구작업
  const since = admin.firestore.Timestamp.fromDate(new Date());
  try {
    const fromNickname =
      fromData.nickname || (await admin.auth().getUser(from)).displayName;
    const userNickname =
      userData.nickname || (await admin.auth().getUser(uid)).displayName;
    // 받는 사람에게 추가
    console.log("userIncoming", userIncoming);
    await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .update({
        "friends.incoming": admin.firestore.FieldValue.arrayRemove(
          userIncoming
        ),
        "friends.active": admin.firestore.FieldValue.arrayUnion(<Friend>{
          _id: from,
          nickname: fromNickname,
          since,
        }),
        notifications: admin.firestore.FieldValue.arrayUnion({
          message: `${fromNickname} 님과 친구가 되셨습니다.`,
          created: since,
          type: "friendConfirm",
          from,
        }),
      });

    // 보내는 사람에게 추가
    console.log("fromPending", fromPending);
    await admin
      .firestore()
      .collection("users")
      .doc(from)
      .update({
        "friends.pending": admin.firestore.FieldValue.arrayRemove(fromPending),
        "friends.active": admin.firestore.FieldValue.arrayUnion(<Friend>{
          _id: uid,
          nickname: userNickname,
          since,
        }),
        notifications: admin.firestore.FieldValue.arrayUnion({
          message: `${userNickname} 님과 친구가 되셨습니다.`,
          created: since,
          type: "friendConfirm",
          from,
        }),
      });

    // Success
    return res.json({
      from,
      to: uid,
    });
  } catch (e) {
    // 실패했을때 삭제
    console.error("Error While Accept Friend Request");
    console.error(e);
    return res.status(500).json({ err: e });
  }
});
