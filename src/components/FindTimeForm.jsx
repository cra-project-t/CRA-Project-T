import React from "react";
import { DialogContent } from "@material-ui/core";

const FindTimeForm = ({ key, props1, props2 }) => {
  let startHour = Math.floor(props1 / 60);
  let startMinute = props1 % 60;
  let endHour = Math.floor(props2 / 60);
  let endMinute = props2 % 60;
  let startM_A = startHour >= 12 ? "오후" : "오전";
  if (startHour >= 13) startHour -= 12;
  let endM_A = endHour >= 12 ? "오후" : "오전";
  if (endHour >= 13) endHour -= 12;
  if (props1 === 0 && props2 === 1439)
    return <DialogContent id={key}>하루종일</DialogContent>;
  return (
    <DialogContent id={key}>
      {startM_A} {startHour}시 {startMinute}분 ~ {endM_A} {endHour}시{" "}
      {endMinute}분
    </DialogContent>
  );
};

export default FindTimeForm;
