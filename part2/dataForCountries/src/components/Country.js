import React from "react";

const Country = (props) => {
  const {
    name,
    capital,
    population,
    languages,
    flag,
  } = props.countriesToShow[0];

  return (
    <div>
      <h1>{name}</h1>
      <p>capital {capital}</p>
      <p>population {population}</p>
      <h3>languages</h3>
      {languages.map((language) => {
        return (
          <ul key={language.name}>
            <li>{language.name}</li>
          </ul>
        );
      })}
      <img src={flag} width="200" height="200" alt="flag" />
    </div>
  );
};

export default Country;
