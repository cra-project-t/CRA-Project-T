import * as express from "express";
import * as admin from "firebase-admin";

export const notifRouter = express.Router();

notifRouter.get("/", async (req, res) => {
  const decodedToken = req.decodedToken;
  return res.json(decodedToken);
});

notifRouter.get("/:groupId/add/announce", async (req, res) => {
  const uid = req.decodedToken.uid;
  const groupId = req.params.groupId.toLowerCase();

  try {
    // 데이터베이스에서 해당 그룹의 공지사항 정보 가져오기
    const announceData = (
      await admin
        .firestore()
        .collection("groups")
        .doc(groupId)
        .collection("announcements")
        .orderBy("today")
        .limit(5)
        .get()
    ).data();

    // console.log(uid, announceData);

    // DB 에서 해당 데이터를 찾을 수 없는경우.
    if (!announceData)
      return res
        .status(404)
        .json({ status: 404, error: "announceDATA NOT FOUND" });

    // 해당 유저 그룹에 그룹 정보가 있는지 확인
    if (!announceData.group)
      return res
        .status(403)
        .json({ status: 403, error: "announceGROUP FORBIDDEN", uid });

    // 유저의 그룹 정보 데이터 반환
    return res.json({
      status: "200",
      data: announceData.group, // Group ID
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ status: 500, error: "Server error", e });
  }
});
