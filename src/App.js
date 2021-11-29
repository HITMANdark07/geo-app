import React, { useEffect, useState, useCallback } from "react";
import styles from "./App.module.css";
import MyMapComponent from "./MapComponent";
import "react-google-maps/lib/index";
import ForecastComponent from "./ForecastComponent";
import moment from "moment";

function App() {
  const [position, setPosition] = useState({
    lat: -34.397, // LONDON LATITUDE COORDS BY DEFAULT
    lng: 150.644, // LONDON LONGITUDE COORDS BY DEFAULT
  });
  const [weatherData, setWaeatherData] = useState({
    time: Date.now(),
    country: "LONDON",
    place: "GB",
    weather_icon: "01d",
    tempreature: 273.15,
    code:200,
  });
  const [forecast, setForecast] = useState([]);
  const getWeatherInfo = useCallback(
    async (position) => {
      const reqURL = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${process.env.REACT_APP_WEATHER_CLIENT_ID}`;
      fetch(reqURL)
        .then((response) => response.json())
        .then((data) => {
          setWaeatherData((prevState) => ({
            ...prevState,
            place: data.name,
            country: data.sys.country,
            tempreature: data.main.temp,
            weather_icon: data.weather[0].icon,
            code: data.cod,
          }));
        });
    },
    [setWaeatherData]
  );
  const setCoords = useCallback(
    (position) => {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      getWeatherInfo(position);
    },
    [getWeatherInfo]
  );

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setCoords);
    } else {
      window.location.reload();
    }
  }, [setCoords]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const getForecast = (lat,lng) => {
    const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_WEATHER_CLIENT_ID}`;
    fetch(forecastApi).then((response) => response.json())
      .then((data) => {
        const formatedData ={};
        const output=[];
        data.list.forEach((d) => {
          let str = moment.utc(d.dt_txt, "YYYY-MM-DD HH").local().format("ddd, MMM DD");
          let formatedDate = str.substr(str.length-3,str.length-1);
          if(formatedData[formatedDate]){
            // do nothing
          }else{
            formatedData[formatedDate] = 1;
            output.push(d);
          }
        })
        setForecast(output.slice(1,4));
      });
  }

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.forcastContainer}>
          <div className={styles.time}>
            {moment(weatherData.time).format("HH:MM A, MMM Do")}
          </div>
          <div className={styles.place}>
            {weatherData.country} , {weatherData.place}
          </div>
          <div className={styles.tempreature}>
            <div className={styles.weathericon}>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather_icon}@2x.png`}
                alt="weather_icon"
              />
            </div>
            <div className={styles.tempData}>
              {(weatherData.tempreature - 273.15).toFixed(0)}
              ° C
            </div>
          </div>
          <div className={styles.forecastHead}>
            <button 
            onClick={() => getForecast(position.lat, position.lng)}
            className={styles.forecastbutton}>
              Next 3 Days Forecast
            </button>
          </div>
          <div className={styles.forecasts}>
            {forecast.length> 0 && forecast.length && (
              forecast.map((fcst,idx) => (
                <ForecastComponent key={idx} data={fcst} />
              ))
            )}
          </div>
        </div>
        <div className={styles.mapsContainer}>
          <MyMapComponent
            isMarkerShown
            position={position}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `0px` }} />}
            containerElement={<div style={{ height: `200px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
          <table className={styles.table} >
            <thead>
              <tr>
              <th className={styles.th}>Currency</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>%Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.td}>EURUSD</td>
                <td className={styles.td}>------</td>
                <td className={styles.td}>------</td>
              </tr>
              <tr>
                <td className={styles.td}>USDCHF</td>
                <td className={styles.td}>------</td>
                <td className={styles.td}>------</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
