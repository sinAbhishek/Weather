import React, { useState, useEffect } from "react";
import { Icon } from "../Icons/Icon";
import "./slider.css";

const Slider = ({ data, diff }) => {
  const [time, settime] = useState("");
  const [Icn, seticon] = useState({ icon: Icon.clearSun });
  const [hour, sethour] = useState("");
  const [minute, setminute] = useState("");
  const [Day, setDay] = useState("");
  const convert = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  useEffect(() => {
    data && fn();
  }, [data, Day]);
  useEffect(() => {
    const call = () => {
      console.log(hour);
      if (hour < 6) {
        setDay(false);
      } else if (hour > 18) {
        setDay(false);
      } else {
        setDay(true);
      }
    };
    hour && call();
  }, [hour]);
  useEffect(() => {
    console.log(diff);
    const call = () => {
      const time = new Date(data.dt * 1000).toTimeString().split(":");

      if (diff != 100) {
        const diffhr = Math.floor(diff / 60);
        const diffmin = diff % 60;
        console.log(time);
        var hr = Number(time[0]) + diffhr;
        var min = Number(time[1]) + diffmin;
        if (hr < 0) {
          sethour(hr + 24);
          console.log(hr + 24);
        } else {
          sethour(hr);
          console.log(hr);
        }
      } else {
        var hr = Number(time[0]);
        var min = Number(time[1]);
        sethour(hr);
      }
    };

    diff && call();
  }, [diff]);
  useEffect(() => {
    settime(hour + ":" + "00");
  }, [hour]);
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
    <div className="slidericon">
      {data && (
        <div className="hourlyWrapper">
          <div className="iconT">
            <p>{data.temp}</p>
            <Icn.icon fontSize={"30px"} style={{ color: "white" }} />
          </div>

          <p>{data.weather[0].description}</p>
          {time && <p>{time}</p>}
        </div>
      )}
    </div>
  );
};

export default Slider;
