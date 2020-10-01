import React from "react";

const Total = ({ courses }) => {
  const initialValue = 0;

  const total = courses.reduce((s, p) => s + p.exercises, initialValue);

  return <b>total of {total} exercises</b>;
};

export default Total;
