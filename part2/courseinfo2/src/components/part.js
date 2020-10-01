import React from "react";

const Part = ({ courses }) => {
  return (
    <div>
      {courses.map((course) => {
        return (
          <p key={course.id}>
            {course.name} {course.exercises}
          </p>
        );
      })}
    </div>
  );
};

export default Part;
