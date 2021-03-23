import React, { useState, useEffect } from "react";
import FindTimeForm from "./FindTimeForm.jsx";
import { Dialog, DialogTitle } from "@material-ui/core";
// import firebase from "firebase";

const FindTime = (props) => {
  const Button = props.button
    ? (pr) => ({ ...props.button, props: { ...props.button.props, ...pr } })
    : () => null;
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const data = [
    {
      week: "MON",
      startTime: 60,
      endTime: 80,
    },
    {
      week: "MON",
      startTime: 150,
      endTime: 300,
    },
    {
      week: "MON",
      startTime: 50,
      endTime: 220,
    },
    {
      week: "MON",
      startTime: 300,
      endTime: 350,
    },
    {
      week: "TUE",
      startTime: 300,
      endTime: 350,
    },
    {
      week: "MON",
      startTime: 400,
      endTime: 500,
    },
  ];

  const times = {
    TOD: { // today
      start: [],
      end: [],
    },
    TOM: {
      // tomorrow
      start: [],
      end: [],
    },
    TWOD: {
      // two days
      start: [],
      end: [],
    },
    THD: {
      // three days
      start: [],
      end: [],
    },
  };

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [lists, setLists] = useState([])

  useEffect(() => {
    let today = new Date();
    const weeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const days = ["TOD", "TOM", "TWOD", "THD"];

    function findTime() {
      data.forEach((element) => {
        let idx = weeks.findIndex((e) => e === element.week) - today.getDay();
        if (idx >= 0 && idx < 3) {
          let day = days[idx];
          times[day].start.unshift(element.startTime);
          times[day].end.unshift(element.endTime);
          mergeTime(times[day], 0);
        }
      });
      times.TOD.start.push(1440);
      times.TOD.end.unshift(0);
      times.TOM.start.push(1440);
      times.TOM.end.unshift(0);
      times.TWOD.start.push(1440);
      times.TWOD.end.unshift(0);
      times.THD.start.push(1440);
      times.THD.end.unshift(0);
      let j = 0;
      let todayIndex = today.getDay();
      const list = [];
      list.push(<DialogTitle>{weeks[todayIndex++]}</DialogTitle>)
      for (let i = 0; i < times.TOD.start.length; i++) {
        list.push(<FindTimeForm key={j++} props1={times.TOD.end[i]} props2={times.TOD.start[i]} />)
      }
      if (todayIndex === 7) todayIndex = 0;
      list.push(<DialogTitle>{weeks[todayIndex++]}</DialogTitle>)
      for (let i = 0; i < times.TOM.start.length; i++) {
        list.push(<FindTimeForm key={j++} props1={times.TOM.end[i]} props2={times.TOM.start[i]} />)
      }
      if (todayIndex === 7) todayIndex = 0;
      list.push(<DialogTitle>{weeks[todayIndex++]}</DialogTitle>)
      for (let i = 0; i < times.TWOD.start.length; i++) {
        list.push(<FindTimeForm key={j++} props1={times.TWOD.end[i]} props2={times.TWOD.start[i]} />)
      }
      if (todayIndex === 7) todayIndex = 0;
      list.push(<DialogTitle>{weeks[todayIndex++]}</DialogTitle>)
      for (let i = 0; i < times.THD.start.length; i++) {
        list.push(<FindTimeForm key={j++} props1={times.THD.end[i]} props2={times.THD.start[i]} />)
      }
      setLists(list);
    }

    function mergeTime(time, i) {
      if (i === time.start.length - 1);
      else if (time.end[i] < time.start[i + 1]);
      else if (time.start[i] <= time.start[i + 1]) {
        if (time.end[i] < time.end[i + 1]) {
          // 2번
          swap(time.end, i, i + 1);
          time.start.splice(i + 1, 1);
          time.end.splice(i + 1, 1);
        } else {
          // 3-1번
          time.start.splice(i + 1, 1);
          time.end.splice(i + 1, 1);
          mergeTime(time, i);
        }
      } else if (
        time.start[i] >= time.start[i + 1] &&
        time.end[i] <= time.end[i + 1]
      ) {
        //3-2번
        time.start.splice(i, 1);
        time.end.splice(i, 1);
      } else if (time.start[i] > time.end[i + 1]) {
        // 5번
        swap(time.start, i, i + 1);
        swap(time.end, i, i + 1);
        mergeTime(time, i + 1);
      } else if (time.end[i] >= time.end[i + 1]) {
        if (time.start[i] > time.start[i + 1]) {
          //4번
          swap(time.start, i, i + 1);
          time.start.splice(i + 1, 1);
          time.end.splice(i + 1, 1);
          mergeTime(time, i);
        } else {
          //3-1번
          time.start.splice(i + 1, 1);
          time.end.splice(i + 1, 1);
          mergeTime(time, i);
        }
      }
    }

    function swap(time, a, b) {
      let temp = time[a];
      time[a] = time[b];
      time[b] = temp;
    }

    findTime();
  }, [])

  return (
    <>
      <Button onClick={handleClickOpen("paper")} />
      <Dialog open={open} onClose={handleClose} scroll={scroll}>
        {lists}
      </Dialog>
    </>
  );
};

export default FindTime;
