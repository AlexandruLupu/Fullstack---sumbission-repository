import React from "react";

const Country = (props) => {
  return props.countriesToShow.map((country) => {
    return <p key={country.name}>{country.name}</p>;
  });
};

export default Country;
