import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function QuickView() {
  const classes = useStyles();
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          빠른 알림
        </Typography>
        <Typography variant="h5" component="h2">
          10 분 후에 수업이 끝납니다.
        </Typography>
        <Typography color="textSecondary">공동체 리더십 훈련</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">숨기기</Button>
      </CardActions>
    </Card>
  );
}
