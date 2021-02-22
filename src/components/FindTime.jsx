import { useEffect, useState } from "react";
import firebase from "firebase";

const FindTime = () => {
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
  const [Time] = useState({
    MON: {
      start: [],
      end: [],
    },
    TUE: {
      start: [],
      end: [],
    },
    WED: {
      start: [],
      end: [],
    },
    THU: {
      start: [],
      end: [],
    },
    FRI: {
      start: [],
      end: [],
    },
    SAT: {
      start: [],
      end: [],
    },
    SUN: {
      start: [],
      end: [],
    },
  });
  // console.log(state);
  return <div>{findTime().MON.start[0]}</div>;

  function findTime() {
    data.forEach((element) => {
      Time[element.week].start.unshift(element.startTime);
      Time[element.week].end.unshift(element.endTime);
      mergeTime(Time[element.week], 0);
    });
    // console.log(data);
    Time.MON.start.push(1440);
    Time.MON.end.unshift(0);
    // MergeTime(Time.MON);
    for (let i = 0; i < Time.MON.start.length; i++) {
      console.log(Time.MON.end[i], Time.MON.start[i]);
    }
    // console.log(Time);
    return Time;
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

  function mergeTime(Time, i) {
    if (i === Time.start.length - 1);
    else if (Time.end[i] < Time.start[i + 1]);
    else if (Time.start[i] <= Time.start[i + 1]) {
      if (Time.end[i] < Time.end[i + 1]) {
        // 2번
        swap(Time.end, i, i + 1);
        Time.start.splice(i + 1, 1);
        Time.end.splice(i + 1, 1);
      } else {
        // 3-1번
        Time.start.splice(i + 1, 1);
        Time.end.splice(i + 1, 1);
        mergeTime(Time, i);
      }
    } else if (
      Time.start[i] >= Time.start[i + 1] &&
      Time.end[i] <= Time.end[i + 1]
    ) {
      //3-2번
      Time.start.splice(i, 1);
      Time.end.splice(i, 1);
    } else if (Time.start[i] > Time.end[i + 1]) {
      // 5번
      swap(Time.start, i, i + 1);
      swap(Time.end, i, i + 1);
      mergeTime(Time, i + 1);
    } else if (Time.end[i] >= Time.end[i + 1]) {
      if (Time.start[i] > Time.start[i + 1]) {
        //4번
        swap(Time.start, i, i + 1);
        Time.start.splice(i + 1, 1);
        Time.end.splice(i + 1, 1);
        mergeTime(Time, i);
      } else {
        //3-1번
        Time.start.splice(i + 1, 1);
        Time.end.splice(i + 1, 1);
        mergeTime(Time, i);
      }
    }
  }

  function swap(Time, a, b) {
    let temp = Time[a];
    Time[a] = Time[b];
    Time[b] = temp;
  }
};

export default FindTime;
