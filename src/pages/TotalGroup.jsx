import React, { useState, useEffect, useContext } from "react";
import { Grid, makeStyles, Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import GroupIcon from "@material-ui/icons/Group";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import axios from "axios";
import SearchGroup from "./SearchGroup";
import { userStore } from "../stores/userStore";

const TotalGroup = () => {
  const classes = useStyles();

  return (
    <div>
      <Paper square elevation={1}>
        <Grid className={classes.root} container spacing={2}>
          <Grid item sm={6} xs={12}>
            <div className={classes.paper}>
              <Typography
                className={classes.title1}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                소속 그룹
              </Typography>
              <IncludedGroupList />
            </div>
            <br />
            <div>
              <Typography
                className={classes.title2}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                전체 그룹
              </Typography>
              <OtherGroupList />
            </div>
          </Grid>
          {/*
          <Grid item sm={6} xs={12}>
            <div className={classes.paper}><SearchGroup /></div>
          </Grid>*/}
        </Grid>
      </Paper>
    </div>
  );
};

export default TotalGroup;

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: "2px",
  },
  container: {
    maxHeight: 440,
  },
  pos: {
    marginBottom: 12,
  },
});

function IncludedGroupList() {
  const classes = useStyles();
  const { state: userDataStore } = useContext(userStore);
  const [groupInfo, setGroupInfo] = useState([]);
  const [groupInfoError, setGroupInfoError] = useState("");
  const [groupInfoLoading, setGroupInfoLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const columns = [
    { id: "name", label: "그룹이름", minWidth: 100 },
    { id: "description", label: "그룹정보", minWidth: 170 },
    {
      id: "memberCount",
      label: "그룹원 수",
      minWidth: 50,
    },
  ];

  useEffect(() => {
    setGroupInfoError("");
    setGroupInfoLoading(true);
    const fetchData = async () => {
      const token = await firebase.auth().currentUser.getIdToken();
      console.log(token);
      firebase
        .auth()
        .currentUser.getIdToken()
        .then((token) => {
          const dataPromises = []; // promise 비동기라 loop돌릴 때 오류 가끔씩=> Promise.all사용
          userDataStore.groups.map((group) => {
            dataPromises.push(
              axios.get(`/group/${group}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }) //get으로 받은 Promise를 배열안에 다 넣어버린다.
            );
          });
          Promise.all(dataPromises).then((datas) => {
            const allData = datas.reduce((prev, curr) => {
              return prev.concat(curr.data.data);
            }, []);
            setGroupInfo(allData);
          });
        });
    };
    fetchData();
  }, []);

  return (
    <TableContainer className={classes.container}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.id == "memberCount" ? (
                  <div>
                    <GroupIcon />
                    {column.label}
                  </div>
                ) : (
                  <div>{column.label}</div>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {groupInfo
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((groupInfo) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={groupInfo.description}
                >
                  {columns.map((column) => {
                    const value = groupInfo[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id == "name" ? (
                          <div>
                            <Avatar alt="Remy Sharp" src={groupInfo.photoURL} />
                            {value}
                          </div>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function OtherGroupList() {
  const classes = useStyles();
  const { state: userDataStore } = useContext(userStore);
  const [groupInfo, setGroupInfo] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [groupInfoError, setGroupInfoError] = useState("");
  const [groupInfoLoading, setGroupInfoLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const columns = [
    { id: "name", label: "그룹이름", minWidth: 100 },
    { id: "description", label: "그룹정보", minWidth: 170 },
    {
      id: "memberCount",
      label: "그룹원 수",
      minWidth: 50,
    },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setGroupInfoError("");
    setGroupInfoLoading(true);
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token) => {
        axios
          .get(`/group/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => setGroupList(res.data));
      });
    console.log(groupList);
    const fetchData = async () => {
      const token = await firebase.auth().currentUser.getIdToken();
      firebase
        .auth()
        .currentUser.getIdToken()
        .then((token) => {
          const dataPromises = []; // promise 비동기라 loop돌릴 때 오류 가끔씩=> Promise.all사용
          const othergroups = groupList.filter(
            (group) => userDataStore.groups.indesOf(group) === -1
          ); // 1. include해서 uid가 없으면 남아있게 !group.member.include 2. filter해서 groupid를 받아서 IDK
          othergroups.map((group) => {
            dataPromises.push(
              axios.get(`/group/${group}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }) //get으로 받은 Promise를 배열안에 다 넣어버린다.
            );
          });
          Promise.all(dataPromises).then((datas) => {
            const allData = datas.reduce((prev, curr) => {
              console.log(prev);
              console.log(curr.data.data);
              return prev.concat(curr.data.data);
            }, []);
            setGroupInfo(allData);
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
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.id == "memberCount" ? (
                    <div>
                      <GroupIcon />
                      {column.label}
                    </div>
                  ) : (
                    <div>{column.label}</div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {groupInfo
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((groupInfo) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={groupInfo.description}
                  >
                    {columns.map((column) => {
                      const value = groupInfo[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id == "name" ? (
                            <div>
                              <Avatar
                                alt="Remy Sharp"
                                src={groupInfo.photoURL}
                              />
                              {value}
                            </div>
                          ) : (
                            value
                          )}
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
        count={groupInfo.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        // frontend에서 몇개 불러왔고 몇번째 page인지 정보 받아와야 한다.
      />
    </div>
  );
}
//pagination=> orderBy, limit, offset(start*limit): 상쇄하고 start*limit부분부터 시작한다.
