import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudMoon,
  faSearch,
  faGear,
  falo,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { AuthContext } from "../../Hook/AuthContext";
import "./home.css";
import axios from "axios";
import { useEffect } from "react";
import Card from "../Card/card";
import Slider from "../SliderCard/Slider";
import { NavLink } from "react-router-dom";
import Weekly from "../weekly/Weekly";
import Login from "../login/Login";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import LogoutIcon from "@mui/icons-material/Logout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BounceLoader from "react-spinners/BounceLoader";

const Home = () => {
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [data, setdata] = useState("");
  const [latitude, setlatitude] = useState("");
  const [longitude, setlongitude] = useState("");
  const [Weather, setweather] = useState("");
  const [totalmin, settotalmin] = useState("");
  const [diff, setdiff] = useState("");
  const [hr, sethr] = useState("");
  const [min, setmin] = useState("");
  const [file, setfile] = useState("");
  const [meridiem, setmeridiem] = useState("");
  const { user_details, dispatch } = useContext(AuthContext);
  const [notification, setnotification] = useState("");
  const [User, setUser] = useState("");
  const [active, setactive] = useState(false);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [place, setplace] = useState("");
  const [location, setlocation] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [err, seterr] = useState(false);
  const [Day, setDay] = useState("");
  const [Loading, setloading] = useState(true);
  const Apikey = process.env.REACT_APP_OpenApi;
  const Url = process.env.REACT_APP_Url;
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
  useEffect(() => {
    Weather && setloading(false);
  }, [Weather]);
  useEffect(() => {
    const call = async () => {
      setlatitude(data[0].lat);
      setlongitude(data[0].lon);
      latitude && weather();
    };

    data && call();
  }, [data]);
  useEffect(() => {
    const call = () => {
      if (hr < 6) {
        setDay(false);
      } else if (hr > 18) {
        setDay(false);
      } else {
        setDay(true);
      }
    };
    hr && call();
  }, [meridiem]);

  useEffect(() => {
    const call = async () => {
      const res = await axios.post(`${Url}/Auth/${user_details._id}`);
      setUser(res.data[0]);

      setnotification(res.data[0].notifications);
    };
    user_details && call();
  }, [checked]);
  useEffect(() => {
    setChecked(notification);
  }, [notification]);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };
  useEffect(() => {
    const call = async () => {
      setloading(true);
      await weather();
      setloading(false);
      setlatitude("");
    };

    latitude && call();
  }, [latitude]);
  useEffect(() => {
    const zone = new Date().toTimeString().split(" ")[1];
    const hr = Number(zone.slice(4, 6));
    const min = Number(zone.slice(6, 8));
    settotalmin(hr * 60 + min);
  }, []);
  useEffect(() => {
    const offset = Weather.timezone_offset / 60;
    if (offset !== totalmin) {
      setdiff(offset - totalmin);
    } else {
      setdiff(100);
    }
  }, [Weather]);
  useEffect(() => {
    const call = () => {
      const array = new Date().toTimeString().split(":");
      const time = Number(array[0]) * 60 + Number(array[1]) + diff;
      const hour = Math.floor(time / 60);
      sethr(hour);
      setmin(time % 60);
      console.log(hour + "" + min);
      if (hour >= 12 && hour < 24) {
        setmeridiem("P.M");
      } else {
        setmeridiem("A.M");
      }
    };
    diff && call();
  }, [diff]);

  useEffect(() => {
    const interval = setInterval(() => weather(), 2000000);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log(position);
          setlatitude(position.coords.latitude);
          setlongitude(position.coords.longitude);
          weather();
        },
        (err) => {
          console.log(err);
          setlatitude(28.7041);
          setlongitude(77.1025);
          toast.error(
            "Location was denied,pls allow location.Currently showing weather data of Delhi",
            {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
      );
    } else {
    }
    return () => clearInterval(interval);
  }, []);
  const fetchCord = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const la = await position.coords.latitude;
      const lo = await position.coords.longitude;
      setlocation({ latitude: la, longitude: lo });
    });
  };

  const weather = async () => {
    try {
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${Apikey}`;
      const temp = await axios.get(url);
      const sky = temp.data.current.weather[0].main;

      setweather(temp.data);
      setdata("");
    } catch (err) {
      throw err;
    }
  };

  const yourplace = async () => {
    try {
      console.log(search);
      const res = await axios.get(
        "https://forward-reverse-geocoding.p.rapidapi.com/v1/forward",
        {
          params: {
            street: `${place}`,
            "accept-language": "en",
            polygon_threshold: "0.0",
          },
          headers: {
            "X-RapidAPI-Key": process.env.REACT_APP_GeoApi,
            "X-RapidAPI-Host": process.env.REACT_APP_GeoKey,
          },
        }
      );
      setlocation({ latitude: res.data[0].lat, longitude: res.data[0].lon });
    } catch (error) {
      console.error(error);
    }
  };
  const submit = async () => {
    try {
      const res = await axios.get(
        "https://forward-reverse-geocoding.p.rapidapi.com/v1/forward",
        {
          params: {
            street: `${search}`,
            "accept-language": "en",
            polygon_threshold: "0.0",
          },
          headers: {
            "X-RapidAPI-Key": process.env.REACT_APP_GeoApi,
            "X-RapidAPI-Host": process.env.REACT_APP_GeoKey,
          },
        }
      );
      setdata(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const test1 = () => {
    setactive(!active);
  };
  const handle = (e) => {
    setplace(e.target.value);
  };

  const handlechange = (e) => {
    setsearch(e.target.value);
  };

  const sendCoordinates = async () => {
    if (location.length == 0) {
      seterr(true);
    } else {
      const res = await axios.post(
        `${Url}/Auth/coordinates/${user_details._id}`,
        {
          coordinates: [location.latitude, location.longitude],
        }
      );
      toast.success("Your location has been updated", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      seterr(false);
      handleClose();
    }
  };
  const changeNotification = async () => {
    const res = await axios.post(
      `${Url}/Auth/notifications/${user_details._id}`,
      {
        notifications: !checked,
      }
    );

    setnotification(!notification);
  };
  return (
    <div className="main">
      {Loading && (
        <div className="loadAnim">
          <BounceLoader
            color={"red"}
            loading={Loading}
            size={35}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
      <div className="navbar">
        <div className="logo">
          <img
            src="https://cdn.dribbble.com/users/915711/screenshots/5827243/weather_icon3.png"
            alt=""
          />
        </div>
        <div className="searchBar">
          <input
            className="searchDesk"
            type="text"
            placeholder="Search for city"
            onChange={handlechange}
          />
          <button onClick={submit}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {user_details !== null ? (
          <div className="userDetails">
            <div className={active ? "setting" : "hidesetting"}>
              <div className="openModal">
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="modal-mui">
                    <div className="mainWraap">
                      <div className="search-wrap1">
                        <input
                          className="search"
                          type="text"
                          placeholder="Type your city name"
                          onChange={handle}
                        />
                        <button className="btnSrc" onClick={yourplace}>
                          <FontAwesomeIcon icon={faSearch} />
                        </button>
                      </div>

                      <span>OR</span>
                      <button className="crLoBtn" onClick={fetchCord}>
                        Get Your Current Location
                      </button>
                      {location && (
                        <p>
                          Your Coordinates:
                          <span>
                            Latitude:{location.latitude} Longitude:
                            {location.longitude}
                          </span>
                        </p>
                      )}
                      {err && location.length == 0 && (
                        <label className="locLabel">Set Your Location</label>
                      )}
                      <button onClick={sendCoordinates}>Submit</button>
                    </div>
                  </Box>
                </Modal>
              </div>
              <div className="toggleNotif">
                <div className="togBtn">
                  <h4>Weather Notifications</h4>
                  <Switch checked={checked} onChange={changeNotification} />
                </div>
                <div className="locate">
                  <button className="locateBtn" onClick={handleOpen}>
                    Set your location
                  </button>
                </div>
                <div onClick={logout} className="logOut">
                  Logut
                </div>
              </div>
            </div>
            <div className="userProfile">
              <img src={user_details.profileImg} alt="" />
              <h3 className="usr">{user_details.username}</h3>

              <div className="arrowDown" onClick={test1}>
                <FontAwesomeIcon
                  icon={faGear}
                  fontSize="1.3rem"
                  style={{ color: "#383735" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="Login">
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
        )}
      </div>
      <div className="sm-search">
        <div className="sm-searchBar">
          <input
            className="searchDesk"
            type="text"
            placeholder="Search for city"
            onChange={handlechange}
          />
          <button onClick={submit}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      <div className="curr">
        <div className="bar">
          <h3>Current Weather</h3>
        </div>
        <Card data={Weather.current} Day={Day} diff={diff} />
      </div>
      <div className="hourly">
        <div className="bar">
          <h3>Hourly Forecast</h3>
        </div>
        <div className="hourlyCont">
          {Weather &&
            Weather.hourly.map((cr) => <Slider diff={diff} data={cr} />)}
        </div>
      </div>
      <div className="daily">
        <div className="bar">
          <h3>Daily Forecast</h3>
        </div>
        <div className="dailyContainer">
          {Weather && Weather.daily.map((cr) => <Weekly data={cr} />)}
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Home;
