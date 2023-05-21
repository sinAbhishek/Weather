import React, { useState, useEffect } from "react";
import { Icon } from "../Icons/Icon";
import "./weekly.css";
const Weekly = ({ data }) => {
  const [Icn, seticon] = useState({ icon: Icon.clearSun });
  const [date, setdate] = useState("");
  const Day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [day, setday] = useState("");

  useEffect(() => {
    data && fn();
  }, [data]);

  useEffect(() => {
    const call = () => {
      const dt = new Date(data.dt * 1000).getDate();
      const month = new Date(data.dt * 1000).getMonth() + 1;
      const dayno = new Date(data.dt * 1000).getDay();
      setdate(dt + "/" + month);
      setday(Day[dayno]);
    };
    data && call();
  }, [data]);
  const fn = () => {
    switch (data.weather[0].main) {
      case "Rain":
        seticon({ icon: Icon.rain });
        break;
      case "Thunderstorm":
        seticon({ icon: Icon.thunderstorm });
        break;
      case "Snow":
        seticon({ icon: Icon.snow });
        break;
      case "Drizzle":
        seticon({ icon: Icon.drizzle });
        break;
      case "Clouds":
        seticon({ icon: Icon.cloud });
        break;
      case "Clear":
        seticon({ icon: Icon.clearSun });
        break;
      default:
        seticon({ icon: Icon.fog });
        break;
    }
  };
  return (
    <>
      <div className="dailyWrapper">
        <div className="date">
          <p>{day}</p>
          <p>{date}</p>
        </div>
        <div className="icnDes">
          <Icn.icon fontSize={"30px"} style={{ color: "white" }} />
          <p>{data.weather[0].description}</p>
        </div>
        <div className="right">
          <h3>
            {data.temp.max}℃/{data.temp.min}℃
          </h3>
        </div>
      </div>
    </>
  );
};

export default Weekly;
