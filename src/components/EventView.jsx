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
      {(!props.allday)? 
        <DialogContent>
          {props.start.toString()}
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

export default EventView