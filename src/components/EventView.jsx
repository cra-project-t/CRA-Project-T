import EventIcon from "@material-ui/icons/Event";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";

const EventView = ({ props, setopenEvent }) => {
  const handleClose = () => {
    setopenEvent(false);
  };
  const classes = useStyles();
  console.log(props);
  return (
    <Dialog open fullWidth onClose={handleClose}>
      <DialogTitle>
        <EventIcon />
        {props.title}
      </DialogTitle>
      <div className={classes.root}>
        <DialogContent>
          <p>{props.start.toString()}</p>
        </DialogContent>
        {props.allDay ? (
          <DialogContent>
            <p>
              {props.start.toString().substring(0, 8) +
                (props.start.getDate() + 1) +
                props.start.toString().substring(10)}
            </p>
          </DialogContent>
        ) : (
          <DialogContent>
            <p>{props.end.toString()}</p>
          </DialogContent>
        )}
        <DialogContent>
          <p>{props.extendedProps.comments}</p>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default EventView;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: theme.spacing(1),
    fontSize: "20px",
  },
}));
