import React from "react";

const Numbers = (props) => {
  return (
    <p>
      {props.persons.name} {props.persons.number} {"  "}
      <button onClick={props.handleDelete}>delete</button>
    </p>
  );
};

export default Numbers;
