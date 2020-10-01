import React, { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import Country from "./components/Country";
import Countries from "./components/Countries";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  /*  axios
    .get("http://api.weatherstack.com/current", { params })
    .then((response) => {
      let tempWeather = [];
      tempWeather = response.data;
      //setWeather(tempWeather);
      console.log(response.data);
    });
*/

  const countriesToShow =
    filter.length > 0
      ? countries.filter((country) =>
          country.name.toLowerCase().startsWith(filter.toLowerCase())
        )
      : [];

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  if (countriesToShow.length > 10) {
    return (
      <div>
        <Filter handleFilterChange={handleFilterChange} />
        <p>Too many matches, specify another filter</p>
      </div>
    );
  }

  return (
    <div>
      <Filter handleFilterChange={handleFilterChange} />

      {countriesToShow.length === 1 ? (
        <Country countriesToShow={countriesToShow} />
      ) : (
        <Countries countriesToShow={countriesToShow} />
      )}
    </div>
  );
}

export default App;
