import React from "react";
import { DialogContent } from "@material-ui/core";

const FindTimeForm = ({ key, props1, props2 }) => {
    return (<DialogContent id={key}>
        {props1} {props2}
    </DialogContent>)

}

export default FindTimeForm;