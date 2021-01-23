import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import "./SearchGroup.css";

const SearchGroup = props => {
  const groups = {
    cra: {
      name: "크라동아리",
      type: "club", // club - 동아리, association - 학회, other - 기타
      desc: "Computer Research Association",
      photo: "https://www.handong.edu/dcp/editor/images/01_CRA.png",
      members: 13, // 13 명
    },
    ghost: {
      name: "고스트",
      type: "club", // club - 동아리, association - 학회, other - 기타
      desc: "고스트 동아리에 오신것을 환영합니다.",
      photo: "https://www.handong.edu/dcp/editor/images/02_GHOST.png",
      members: 10, // 10 명
    },
  };
  const classes = useStyles();
  const id = props.match.params.id;
  return (
    <Grid container item justify="center">
      <div>
        <div className={classes.root}>
          <img src={groups[id].photo} width="150" height="150" alt="Avatar" />
          <h1>{groups[id].name}</h1>
          <h3>{groups[id].desc}</h3>
          <h5>{groups[id].members}명 회원</h5>
          <Button variant="contained">취소</Button>
          <Button variant="contained" color="primary">
            요청
          </Button>
        </div>
      </div>
    </Grid>
  );
};

export default SearchGroup;

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));
