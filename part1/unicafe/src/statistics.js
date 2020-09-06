import React from "react";
import Statistic from "./statistic";

const Statistics = (props) => {
  const stats = (g, n, b) => {
    const result = (g + n * 0 + b * -1) / (g + n + b);
    return result ? result : "";
  };

  if (props.good + props.neutral + props.bad === 0)
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    );

  return (
    <div>
      <h1>statistics</h1>
      <Statistic text="good" stats={props.good} />
      <Statistic text="neutral" stats={props.neutral} />
      <Statistic text="bad" stats={props.bad} />
      <Statistic text="all" stats={props.good + props.neutral + props.bad} />
      <Statistic
        text="average"
        stats={stats(props.good, props.neutral, props.bad)}
      />
      <Statistic
        text="positive"
        stats={
          (props.good / (props.good + props.neutral + props.bad)) * 100 + ` %`
        }
      />
    </div>
  );
};

export default Statistics;
