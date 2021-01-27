import { useState } from 'react';

const FindTime = () => {
  const data = [
    {
      week: "월",
      startTime: 60,
      endTime: 80
    },
    {
      week: "월",
      startTime: 150,
      endTime: 300
    },
    {
      week: "월",
      startTime: 50,
      endTime: 220
    },
    {
      week: "월",
      startTime: 300,
      endTime: 350
    },
    {
      week: "화",
      startTime: 300,
      endTime: 350
    },
    {
      week: "월",
      startTime: 400,
      endTime: 500
    },
  ];

  const [Time] = useState({
    월 : {
      start : [],
      end : []
    },
    화 : {
      start : [],
      end : []
    },
    수 : {
      start : [],
      end : []
    },
    목 : {
      start : [],
      end : []
    },
    금 : {
      start : [],
      end : []
    },
    토 : {
      start : [],
      end : []
    },
    일 : {
      start : [],
      end : []
    }
  });
  
  return (
    <div>
      {findTime()}
    </div>
  )

  function findTime() {
    data.forEach(element => {
      Time[element.week].start.unshift(element.startTime);
      Time[element.week].end.unshift(element.endTime);
      mergeTime(Time[element.week], 0);
    });
    // console.log(data);
    Time.월.start.push(1440);
    Time.월.end.unshift(0);
    for(let i = 0 ; i < Time.월.start.length ; i++){
      console.log(Time.월.end[i], Time.월.start[i]);
    }
    console.log(Time);
  }

  function mergeTime(Time, i) {
    if(i === Time.start.length-1);
    else if(Time.end[i] < Time.start[i+1]);
    else if(Time.start[i] <= Time.start[i+1]){
      if(Time.end[i] < Time.end[i+1]){
        // 2번
        swap(Time.end, i, i+1);
        Time.start.splice(i+1, 1);
        Time.end.splice(i+1, 1);
      }
      else {
        // 3-1번
        Time.start.splice(i+1, 1);
        Time.end.splice(i+1, 1);
        mergeTime(Time, i);
      }
    }
    else if(Time.start[i] >= Time.start[i+1] && Time.end[i] <= Time.end[i+1]){
      //3-2번
      Time.start.splice(i, 1);
      Time.end.splice(i, 1);
    }
    else if(Time.start[i] > Time.end[i+1]){
      // 5번
      swap(Time.start, i, i+1);
      swap(Time.end, i, i+1);
      mergeTime(Time, i+1);
    }
    else if(Time.end[i] >= Time.end[i+1]){
      if(Time.start[i] > Time.start[i+1]){
        //4번
        swap(Time.start, i, i+1);
        Time.start.splice(i+1, 1);
        Time.end.splice(i+1, 1);
        mergeTime(Time, i);
      }
      else {
        //3-1번
        Time.start.splice(i+1, 1);
        Time.end.splice(i+1, 1);
        mergeTime(Time, i);
      }
    }
  }

  function swap(Time, a, b) {
    let temp = Time[a];
    Time[a] = Time[b];
    Time[b] = temp;
  }
}

export default FindTime
