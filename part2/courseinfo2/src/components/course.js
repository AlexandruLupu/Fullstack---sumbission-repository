import React from "react";
import Header from "./header";
import Content from "./content";
import Total from "./total";

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content courses={course.parts} />
      <Total courses={course.parts} />
    </div>
  );
};

export default Course;
