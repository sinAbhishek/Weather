import React, { useState, useEffect } from "react";
import { Icon } from "../Icons/Icon";
import {
  WiSunrise,
  WiSunset,
  WiThermometer,
  WiWindy,
  WiTime1,
} from "react-icons/wi";

// import "./card.css";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Card = ({ data, Day, diff }) => {
  const [time, settime] = useState("");
  const [sunset, setsunset] = useState("");
  const [sunrise, setsunrise] = useState("");
  const [Icn, seticon] = useState({ icon: Icon.clearSun });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const call = () => {
      console.log(data);
      const current = getTime(data.timezone);
      settime(current.hr + " " + current.meri);
      const suns = getTime(data.timezone, data.current.sunset);
      setsunset(suns.hr + " " + suns.meri);
      const sunr = getTime(data.timezone, data.current.sunrise);
      setsunrise(sunr.hr + " " + sunr.meri);
    };
    data && call();
  }, [data]);
  useEffect(() => {
    data && fn();
    console.log(data);
  }, [data, Day]);
  const fn = () => {
    switch (data.current.weather[0].main) {
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

  return (
    <div className="currentWrapper h-full w-full flex justify-between">
      <div
        style={{ backgroundPosition: "center center" }}
        className=" w-full h-full bg-no-repeat bg-cover  rounded-md relative bg-[url(https://wallpaperaccess.com/full/4157519.jpg)]"
      >
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.529)" }}
          className="blur absolute top-0 bottom-0 left-0 right-0 z-20 w-full h-full backdrop-blur-md "
        ></div>
        {data && (
          <div className="icon pt-4 absolute top-0 bottom-0 left-0 right-0 z-30 ">
            <Icn.icon fontSize={"100px"} color="white" />
            <h2 className=" ml-4 text-2xl md:text-4xl text-slate-100">
              {" "}
              {data.current.temp}℃
            </h2>
            <p className="ml-4 mt-4 italic text-slate-100">
              {data.current.weather[0].description}
            </p>
            <h5>
              <p className="ml-4 font-semibold text-slate-300 text-base md:text-xl mt-4">
                {time}
              </p>
            </h5>
            <hr
              style={{ height: "1px" }}
              className=" w-4/5 bg-slate-400 mx-auto mt-4"
            />
            <div className="main-des m-2">
              <div className="flex">
                <div className="flex items-center">
                  <WiSunrise size={"40px"} color="#e8d333" />
                  <p className="ml-4 font-semibold text-slate-100">{sunrise}</p>
                </div>
                <div className="flex items-center ml-8">
                  <WiSunset size={"40px"} color="#fa7211" />
                  <p className="ml-4 font-semibold text-slate-100">{sunset}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
