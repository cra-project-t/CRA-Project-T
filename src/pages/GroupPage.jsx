import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import firebase from "firebase";
import axios from "axios";
import { userStore } from "../stores/userStore";

// Title: Group 정보(사진, 이름, 정보 ), Group 공지, Group event / GroupMember
const GroupPage = () => {
  const classes = useStyles();
  const [groupList, setGroupList] = useState([]);
  const [groupListError, setGroupListError] = useState("");
  const { state: userDataStore } = useContext(userStore);

  useEffect(() => {
    setGroupListError("");
    setGroupListLoading(true);
    firebase
      .auth()
      .currentUser.getIdToken()
      .then(token => {
        axios
          .get(`/group/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(res => setGroupList(res.data && res.data.data))
          .catch(e => {
            setGroupListError(e.response.data.error);
            setGroupList([]);
          })
          .finally(() => setGroupListLoading(false));
      });
  }, [id]);

  return (
    <div>
      <Paper className={classes.root}>
        {groupListLoading && <CircularProgress />}
        {groupListError ? (
          <div>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              <strong>{groupListError}</strong>
            </Alert>
          </div>
        ) : (
          <div className="center">
            <img
              src={groupList.photoURL}
              width="150"
              height="150"
              alt="Avatar"
              className="round"
              border-radius="50%"
              text-align="center"
            />
            <h1>{groupList.name}</h1>
            <h3>{groupList.description}</h3>
          </div>
        )}
        <Typography
          className={classes.title1}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          GROUP 공지사항
        </Typography>
        <GroupNotifList />
        <Typography
          className={classes.title2}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          GROUP 이벤트
        </Typography>
      </Paper>
    </div>
  );
};

export default GroupPage;

function GroupNotifList() {
  const classes = useStyles();
  const { state: userDataStore } = useContext(userStore);
  const [notifList, setNotifList] = useState([]);
  const [notifListError, setNotifListError] = useState("");
  const [notifListLoading, setNotifListLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const columns = [
    { id: "_id", label: "No", minWidth: 50 },
    { id: "announceName", label: "Subject", minWidth: 170 },
    //{ id: "file", label: "file", minWidth: 30 },
    { id: "writer", label: "Writer", minWidth: 100 },
    { id: "created", label: "Date", minWidth: 100 },
    //{ id: "Read", label: "Read", minWidth: 50 },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //해당 그룹 notice만 가져오기(전체), 작성자 addnotif 수정, date 출력
  useEffect(() => {
    setNotifListError("");
    setNotifListLoading(true);

    const fetchData = async () => {
      const token = await firebase.auth().currentUser.getIdToken();
      console.log(token);
      firebase
        .auth()
        .currentUser.getIdToken()
        .then(token => {
          const dataPromises = [];
          userDataStore.groups.map(group => {
            dataPromises.push(
              axios.get(`/notif/${group}/show/announce`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }) //get으로 받은 Promise를 배열안에 다 넣어버린다.
            );
          });
          Promise.all(dataPromises).then(datas => {
            const allData = datas.reduce((prev, curr) => {
              console.log(prev);
              console.log(curr.data.data);
              return prev.concat(curr.data.data);
            }, []);
            console.log(allData);
            setNotifList(allData);
          });
        });
    };
    fetchData();
  }, []);

  return (
    <div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {notifList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(notifList => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={notifList._id}
                  >
                    {columns.map(column => {
                      const value = notifList[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 30, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: "2px",
  },
  container: {
    maxHeight: 440,
  },
});
