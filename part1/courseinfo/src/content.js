import React from "react";
import Part from "./part";

const Content = (props) => {
  return (
    <>
      <Part
        name={props.course.parts[0].name}
        exercises={props.course.parts[0].exercises}
      />
      <Part
        name={props.course.parts[1].name}
        exercises={props.course.parts[1].exercises}
      />
      <Part
        name={props.course.parts[2].name}
        exercises={props.course.parts[2].exercises}
      />
    </>
  );
};

export default Content;
