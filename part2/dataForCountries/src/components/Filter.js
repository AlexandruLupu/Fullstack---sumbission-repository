import React from "react";

const Filter = (props) => {
  return (
    <div>
      <label>filter countries</label>
      <input onChange={props.handleFilterChange} />
    </div>
  );
};

export default Filter;
