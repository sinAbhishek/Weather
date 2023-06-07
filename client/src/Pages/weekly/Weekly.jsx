import React, { useState, useEffect } from "react";
import { Icon } from "../Icons/Icon";
// import "./weekly.css";
const Weekly = ({ data }) => {
  const [Icn, seticon] = useState({ icon: Icon.clearSun });
  const [date, setdate] = useState("");
  const [mon, setmon] = useState("");
  const Day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const month = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "November",
    "December",
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
      setdate(dt);
      setmon(month);
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
      <div className="dailyWrapper w-full h-20 flex justify-between">
        <div className="icnDes flex w-1/3 items-center">
          <div className="icnC">
            <Icn.icon fontSize={"40px"} style={{ color: "white" }} />
          </div>
          <div className=" text-white ml-2">
            <p className=" text-white text-base md:text-xl inline-block">
              {data.temp.max}
            </p>
            /
            <p className="inline-block text-sm md:text-base text-slate-400">
              {data.temp.min}
            </p>
          </div>
        </div>
        <div className="date flex w-1/3 justify-center items-center">
          <p className=" text-slate-400 mr-2">{date}</p>
          <p className=" text-slate-400">{month[mon]}</p>
        </div>

        <div className="right w-1/3 flex justify-center items-center">
          <div className="w-1/2 flex ">
            <p className=" text-slate-300">{day}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Weekly;
