import React, { useEffect, useState } from 'react'
import ReactAnimatedWeather from "react-animated-weather";
import Api from '../../Apis/Api';
import ct from "countries-and-timezones"

const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };
const Forecast = ({icon,weahterData,setweatherData,setIcon}) => {
 const [key,setKey]= useState(null)

  useEffect(()=>{
    switch (weahterData.main) {
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
  },[weahterData])


 const searchCity= async(city)=>{
    try {
        let apiData= await fetch(`${Api.base}weather?q=${ city !== "[object Object]" ? city : key }&units=metric&APPID=${Api.key}`)
        console.log(city)
        let data= await apiData.json()
        setweatherData({
            lat:data.coord.lat,
            lon:data.coord.lon,
            city: data.name,
            temperatureC: Math.round(data.main.temp),
            temperatureF: Math.round(data.main.temp * 1.8 + 32),
            humidity: data.main.humidity,
            main: data.weather[0].main,
            country: data.sys.country,
            visibility:data.visibility,
            windspeed:Math.round( data.wind.speed *3.6),
            timezone:ct.getCountry(data.sys.country).timezones[0]
          });
          setKey(city)
         
    } catch (error) {
        setweatherData("")
        
    }

    
   

    
 }
  return (
    <div>
      <div className="mb-icon">
          {" "}
          <ReactAnimatedWeather
            icon={icon}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}
          />
          <p >{weahterData.main}</p>
       
        </div>

        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search City"
            onChange={(e) => searchCity(e.target.value)}
        
          />
         
        </div>
        <div className="city-forecast">{weahterData.city},{weahterData.country}</div>
        <div className="temprature-details">
           <div>
            
            <p>Temprature</p>
            {weahterData? <p>{weahterData.temperatureC}°<span>C</span></p> : "Detecting..."}
            
           </div>
           <div>
            <p>Humidity</p>
            {weahterData?  <p>{weahterData.humidity}%</p> : "Detecting..."}
           
           </div>
           <div>
            <p>Visiblity</p>
            {weahterData?  <p>{weahterData.visibility} mi</p> : "Detecting..."}
           </div>
           <div>
            <p>Wind Speed</p>
            {weahterData?  <p>{weahterData.windspeed} Km/hr</p> : "Detecting..."}
           
           
           </div>
        </div>


    </div>
  )
}

export default Forecast
