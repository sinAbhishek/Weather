import React, { useState, useEffect } from "react";
import { Icon } from "../Icons/Icon";

const Slider = ({ data, diff, timezone, sunset, sunrise }) => {
  const [time, settime] = useState("");
  const [Icn, seticon] = useState({ icon: Icon.clearSun });
  const [hour, sethour] = useState("");
  const [minute, setminute] = useState("");
  const [Sunset, setsunset] = useState("");
  const [Sunrise, setsunrise] = useState("");
  const [Day, setDay] = useState("");
  const convert = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  useEffect(() => {
    data && fn();
  }, [data, Day]);

  useEffect(() => {
    const call = () => {
      const current = getTime(timezone, data.dt);
      settime(current.hr + " " + current.meri);
      const suns = getTime(data.timezone, sunset);
      setsunset(suns.hr);
      const sunr = getTime(data.timezone, sunrise);
      setsunrise(sunr.hr + " " + sunr.meri);
      console.log(suns.hr.slice(0, 1));
      if (current.hr.length === 5) {
        if (
          Number(current.hr.slice(0, 2)) < Number(sunr.hr.slice(0, 1)) &&
          current.meri === "AM"
        ) {
          setDay(false);
        } else if (
          Number(current.hr.slice(0, 2)) >= Number(suns.hr.slice(0, 1)) &&
          Number(current.hr.slice(0, 2)) < 12 &&
          current.meri === "PM"
        ) {
          setDay(false);
        } else {
          setDay(true);
        }
      } else {
        if (
          Number(current.hr.slice(0, 1)) < Number(sunr.hr.slice(0, 1)) &&
          current.meri === "AM"
        ) {
          setDay(false);
        } else if (
          Number(current.hr.slice(0, 1)) >= Number(suns.hr.slice(0, 1)) &&
          current.meri === "PM"
        ) {
          setDay(false);
        } else {
          setDay(true);
        }
      }
    };
    data && call();
  }, [data]);

  const getTime = (timezone, string) => {
    if (string) {
      const date = new Date(string * 1000).toLocaleTimeString("en-US", {
        timeZone: timezone,
      });
      if (date.length === 10) {
        const time = { hr: date.slice(0, 4), meri: date.slice(8, 10) };
        return time;
      } else {
        const time = { hr: date.slice(0, 5), meri: date.slice(9, 11) };
        return time;
      }
    } else {
      const date = new Date().toLocaleTimeString("en-US", {
        timeZone: timezone,
      });
      if (date.length === 10) {
        const time = { hr: date.slice(0, 4), meri: date.slice(8, 10) };
        return time;
      } else {
        const time = { hr: date.slice(0, 5), meri: date.slice(9, 11) };
        return time;
      }
    }
  };

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
        if (Day) {
          seticon({ icon: Icon.clearSun });
        } else {
          seticon({ icon: Icon.clearMoon });
        }
        break;
      default:
        seticon({ icon: Icon.fog });
        break;
    }
  };
  return (
    <div className="slidericon flex justify-center items-center  h-32 bg-no-repeat bg-cover  rounded-md bg-[url(https://images.template.net/wp-content/uploads/2017/01/18062722/200-Blurred-Backgrounds-Free-Download.jpg)] ">
      {data && (
        <div className="hourlyWrapper flex items-center justify-center  h-full ">
          <div className="iconT flex flex-col items-center justify-center  h-full  ">
            <p className=" text-xl text-white ">{data.temp}</p>
            <Icn.icon fontSize={"40px"} style={{ color: "white" }} />
            <p className=" italic text-gray-400">
              {data.weather[0].description}
            </p>
            {time && <p className=" text-lg text-slate-100">{time}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
