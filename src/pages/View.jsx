import React from 'react'
import Add from './Add';
/*

*/
const View = (props) => {
  console.log(props);
  return (
    <div>
      View {props.match.params.name}
      <Add />
    </div>
  )
}

export default View
