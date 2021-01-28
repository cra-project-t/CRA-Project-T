// import React, { useEffect, useState } from "react";
import EventIcon from "@material-ui/icons/Event";
import {
  Dialog,
  // DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const EventView = ({ props, setopenEvent }) => {
  const handleClose = () => {
    setopenEvent(false);
  };
  console.log(props);
  return (
    <Dialog open fullWidth onClose={handleClose}>
      <DialogTitle>
        <EventIcon />
        {props.title}
      </DialogTitle>
      <DialogContent>
        {props.start.toString()}
      </DialogContent>
      {(!props.allday) ?
        <DialogContent>
          {props.start.toString().substring(0, 8) + (props.start.getDate() + 1) + props.start.toString().substring(10)}
        </DialogContent>
        :
        <DialogContent>
          {props.end.toString()}
        </DialogContent>
      }
      <DialogContent>
        {props.extendedProps.comments}
      </DialogContent>
    </Dialog>
  );
}

export default EventView;
