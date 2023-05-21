import React, { useState, useEffect } from "react";
import { Icon } from "../Icons/Icon";
import {
  WiSunrise,
  WiSunset,
  WiThermometer,
  WiWindy,
  WiTime1,
} from "react-icons/wi";
import "./card.css";
const Card = ({ data, Day, diff }) => {
  const [hour, sethour] = useState([]);
  const [Icn, seticon] = useState({ icon: Icon.clearSun });
  useEffect(() => {
    data && fn();
  }, [data, Day]);
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
  useEffect(() => {
    const run = () => {
      call(data.sunrise);
      call(data.sunset);
      call(data.dt);
    };
    diff && run();
  }, [data, diff]);

  useEffect(() => {
    sethour([]);
  }, [data]);
  const call = (data) => {
    const time = new Date(data * 1000).toTimeString().split(":");

    if (diff != 100) {
      const diffhr = Math.floor(diff / 60);
      const diffmin = diff % 60;

      var hr = Number(time[0]) + diffhr;
      var min = Number(time[1]) + diffmin;
      if (hr < 0) {
        if (min < 0) {
          min = min * -1;
          sethour((prev) => [...prev, hr + 24 + ":" + min]);
        } else {
          sethour((prev) => [...prev, hr + 24 + ":" + min]);
        }
      } else if (hr > 24) {
        if (min < 0) {
          min = min * -1;
          sethour((prev) => [...prev, hr - 24 + ":" + min]);
        } else {
          sethour((prev) => [...prev, hr - 24 + ":" + min]);
        }
      } else {
        if (min < 0) {
          min = min * -1;
          sethour((prev) => [...prev, hr + ":" + min]);
        } else {
          sethour((prev) => [...prev, hr + ":" + min]);
        }
      }
    } else {
      var hr = Number(time[0]);
      var min = Number(time[1]);
      sethour((prev) => [...prev, hr + ":" + min]);
    }
  };

  return (
    <div className="currentWrapper">
      <div
        className="bg-img"
        style={{
          backgroundImage: Day ? "url(images/sun.jpg)" : "url(images/moon.jpg)",
          backgroundSize: "cover",
        }}
      ></div>
      {data && (
        <div className="icon">
          <Icn.icon
            fontSize={"100px"}
            color="white"
            style={{ margin: "0rem auto" }}
          />
          <p style={{ color: Day ? "black" : "#27ace9" }}>
            {data.weather[0].description}
          </p>
          <h2 style={{ color: Day ? "black" : "#27ace9" }}>{data.temp}℃</h2>
        </div>
      )}
      {data && (
        <div className="temp">
          <div className="main-des">
            <WiThermometer fontSize={"40px"} color="white" />
            <h5>
              Feels Like: <p>{data.feels_like}</p>
            </h5>
          </div>
          <div className="main-des">
            <WiWindy fontSize={"40px"} color="white" />
            <h5>
              Wind: <p>{data.wind_speed}</p>
            </h5>
          </div>

          <div className="main-des">
            <WiSunrise fontSize={"40px"} color="white" />
            <h5>
              Sunrise: <p>{hour[0]}</p>
            </h5>
          </div>
          <div className="main-des">
            <WiSunset fontSize={"40px"} color="white" />
            <h5>
              Sunset: <p>{hour[1]}</p>
            </h5>
          </div>
          <div className="main-des">
            <WiTime1 fontSize={"35px"} color="white" />
            <h5>
              Current Time: <p>{hour[2]}</p>
            </h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
