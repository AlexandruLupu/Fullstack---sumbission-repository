import React from "react";

const Filter = (props) => {
  return (
    <div>
      <label>filter shown with</label>
      <input onChange={props.handleFilterChange} />
    </div>
  );
};

export default Filter;
