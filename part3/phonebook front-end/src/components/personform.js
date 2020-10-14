import React from "react";

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.addPerson}>
        <div>
          <label>name:</label>
          <input
            onChange={props.handlePersonsChange}
            value={props.newName}
            required
          />
        </div>
        <div>
          <label>number:</label>
          <input
            onChange={props.handleNumberChange}
            value={props.newNumber}
            required
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
