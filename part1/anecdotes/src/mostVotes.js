import React from "react";

const MostVotes = (props) => {
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{props.anecdote}</p>
      <p>has {props.votes} votes</p>
    </div>
  );
};

export default MostVotes;
