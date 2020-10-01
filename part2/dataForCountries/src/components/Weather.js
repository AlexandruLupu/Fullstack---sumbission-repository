import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = (props) => {
  const [weather, setWeather] = useState([]);
  const params = {
    access_key: process.env.REACT_APP_API_KEY,
    query: props.name,
  };

  useEffect(() => {
    axios
      .get("http://api.weatherstack.com/current", { params })
      .then((response) => {
        let tempWeather = [];
        tempWeather = response.data;
        setWeather(tempWeather);
        console.log(response.data);
      });
  }, []);

  return (
    <div>
      <h3>Weather in</h3>
    </div>
  );
};

export default Weather;
