import React, { useEffect, useState } from "react";

import Api from "../../Apis/Api";
import Clock from "react-live-clock";
import { Grid } from "@mui/material";
import Forecast from "../Forecast/Forecast";
import loading from "../../images/WeatherIcons.gif";
import ct from "countries-and-timezones";
import moment from "moment";
import "moment-timezone";

const CurrentLocation = () => {
  const [weahterData, setweatherData] = useState([]);
  const [icon, setIcon] = useState("CLEAR_DAY");
  const [currentDateInTimezone, setCurrentDateInTimezone] = useState("");
  const [currentWeekday, setCurrentWeekday] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          getWeatherData(0, 0);
          alert(
            "You have disabled location service. Please Allow to access your location. Your current location will be used to display current location Weather"
          );
        }
      );
    } else {
      alert("Something Went Wrong, Please close the tab and open again");
    }
  }, []);

  useEffect(() => {
    moment.tz.setDefault(weahterData.timezone);
    const dateInTimezone = moment().format("YYYY-MM-DD");
    setCurrentDateInTimezone(dateInTimezone);
    const weekday = moment().format("dddd");
    setCurrentWeekday(weekday);


    const intervalId = setInterval(() => {
      if (weahterData) {
        getWeatherData(weahterData.lat, weahterData.lon);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [weahterData]);

  const getWeatherData = async (lat, lon) => {
    let apiData = await fetch(
      `${Api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${Api.key}`
    );
    const data = await apiData.json();
    setweatherData({
      lat,
      lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,
      visibility: data.visibility,
      windspeed: data.wind.speed,
      timezone: ct.getCountry(data.sys.country).timezones[0],
    });

    switch (data.weather[0].main) {
      case "Haze":
        setIcon("CLEAR_DAY");
        break;
      case "Clouds":
        setIcon("CLOUDY");
        break;
      case "Rain":
        setIcon("RAIN");
        break;
      case "Snow":
        setIcon("SNOW");
        break;
      case "Dust":
      case "Smoke":
        setIcon("WIND");
        break;
      case "Drizzle":
        setIcon("SLEET");
        break;
      case "Fog":
        setIcon("FOG");
        break;
      case "Tornado":
        setIcon("WIND");
        break;
      default:
        setIcon("CLEAR_DAY");
    }
  };

  return (
 
      <Grid container spacing={2}>
        {weahterData.temperatureC ? (
          <Grid item xs={12} md={8}>
            <div className="city">
              <div className="title">
                <h2>{weahterData.city}</h2>
                <h3>{weahterData.country}</h3>
              </div>

              <div className="date-time">
                <div className="dmy">
                  <div className="current-time">
                    <Clock
                      format="HH:mm:ss"
                      interval={1000}
                      ticking={true}
                      timezone={weahterData.timezone}
                    />
                  </div>
                  <div className="current-date">
                    {currentWeekday},{currentDateInTimezone}
                  </div>
                </div>
                <div className="temperature">
                  <p>
                    {weahterData.temperatureC}°<span>C</span>
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        ) : (
          <Grid item xs={12} md={8}>
            <img
              src={loading}
              style={{ width: "50%", WebkitUserDrag: "none" }}
              alt="loading"
            />
            <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
              Detecting your location
            </h3>
          </Grid>
        )}

        <Grid item xs={12} md={4}>
          <div className="forecast">
            <Forecast
              icon={icon}
              weahterData={weahterData}
              setweatherData={setweatherData}
              setIcon={setIcon}
            />
          </div>
        </Grid>
      </Grid>

  );
};

export default CurrentLocation;
