import React from 'react'

const Add = (props) => {
  console.log(props);
  return (
    <div>
      Add {props.admin && "어드민입니다."}
    </div>
  )
}

export default Add
