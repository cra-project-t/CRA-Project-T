import React, { useState } from "react";
import FindTimeForm from "./FindTimeForm.jsx";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
// import firebase from "firebase";

const FindTime = (props) => {
  const Button = props.button
    ? (pr) => ({ ...props.button, props: { ...props.button.props, ...pr } })
    : () => null;
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  // const [state, setState] = useState([]);
  // const [data, userData] = useState([]);
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

  // useEffect(() => {
  //   firebase.firestore().collection('users').doc('B95XfCKRgDVbb38aeqlc6dLDv9W2').get().then(doc => setState(doc.data()));
  // }, [])
  let today = new Date();
  const weeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const days = ["TOD", "TOM", "TWOD", "THD"];
  const [times, settime] = useState({
    TOD: {
      // today
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
  });

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClickOpen("paper")} />
      <Dialog open={open} onClose={handleClose} scroll={scroll}>
        {findTime()}
      </Dialog>
    </>
  );

  function findTime() {
    data.forEach((element) => {
      let day =
        days[weeks.findIndex((e) => e === element.week) - today.getDay()];
      times[day].start.unshift(element.startTime);
      times[day].end.unshift(element.endTime);
      mergeTime(times[day], 0);
      // console.log(days[weeks.findIndex((e) => e === element.week) - today.getDay()]);
    });
    times.TOD.start.push(1440);
    times.TOD.end.unshift(0);
    times.TOM.start.push(1440);
    times.TOM.end.unshift(0);
    times.TWOD.start.push(1440);
    times.TWOD.end.unshift(0);
    times.THD.start.push(1440);
    times.THD.end.unshift(0);
    const list = [];
    let j = 0;
    list.push(<DialogTitle>오늘</DialogTitle>);
    for (let i = 0; i < times.TOD.start.length; i++) {
      list.push(
        <DialogContent>
          <FindTimeForm
            key={j++}
            props1={times.TOD.end[i]}
            props2={times.TOD.start[i]}
          />
        </DialogContent>
      );
    }
    list.push(<DialogTitle>내일</DialogTitle>);
    for (let i = 0; i < times.TOM.start.length; i++) {
      list.push(
        <DialogContent>
          <FindTimeForm
            key={j++}
            props1={times.TOM.end[i]}
            props2={times.TOM.start[i]}
          />
        </DialogContent>
      );
    }
    list.push(<DialogTitle>2일 뒤</DialogTitle>);
    for (let i = 0; i < times.TWOD.start.length; i++) {
      list.push(
        <DialogContent>
          <FindTimeForm
            key={j++}
            props1={times.TWOD.end[i]}
            props2={times.TWOD.start[i]}
          />
        </DialogContent>
      );
    }
    list.push(<DialogTitle>3일 뒤</DialogTitle>);
    for (let i = 0; i < times.THD.start.length; i++) {
      list.push(
        <DialogContent>
          <FindTimeForm
            key={j++}
            props1={times.THD.end[i]}
            props2={times.THD.start[i]}
          />
        </DialogContent>
      );
    }
    return list;
  }

  // function MergeTime(Time) {
  //   quick_sort(Time, 0, Time.start.length - 1);
  //   // console.log(Time);
  // }

  // function quick_sort(Time, left, right) {
  //   let pivot = left;
  //   let i = left + 1;
  //   let j = right;

  //   if (left < right) {
  //     while (i <= j) {
  //       if (Time.start[i] <= Time.start[pivot]) {
  //         i++;
  //       }
  //       else if (Time.start[j] > Time.start[pivot]) {
  //         j--;
  //       }
  //       else {
  //         swap(Time, i, j);
  //       }
  //     }
  //     swap(Time, j, pivot);
  //     quick_sort(Time, left, j - 1);
  //     quick_sort(Time, j + 1, right);
  //   }
  // }

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
};

export default FindTime;
