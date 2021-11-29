import React from 'react'
import styles from "./Forecast.module.css";
import moment from "moment";

const ForecastComponent = ({data}) => {

    const getTempinCelcius = (data) => (data-273.15).toFixed(0);
    return (
        <div className={styles.container}>
            <div className={styles.dateData}>{moment.utc(data.dt_txt, "YYYY-MM-DD HH").local().format("ddd, MMM DD")}</div>
            <div className={styles.temp}>
                <img 
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                // src={`https://openweathermap.org/img/wn/01d.png`} // default
                alt="weather" />
                <span className={styles.tempData}>{getTempinCelcius(data.main.temp_max)}/{getTempinCelcius(data.main.temp_min)}°C</span>
            </div>
            <div className={styles.weatherData}>{data.weather[0].description}</div>
        </div>
    )
}

export default ForecastComponent;
