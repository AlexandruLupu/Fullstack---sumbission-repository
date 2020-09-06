import React from "react";

const Statistic = (props) => {
  return (
    <div>
      <p>
        {props.text} {props.stats}
      </p>
    </div>
  );
};

export default Statistic;
