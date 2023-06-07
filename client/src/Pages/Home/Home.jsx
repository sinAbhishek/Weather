import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BiBell, BiExit } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  faCloudMoon,
  faSearch,
  faGear,
  falo,
} from "@fortawesome/free-solid-svg-icons";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { ImLocation } from "react-icons/im";
import { GiHamburgerMenu } from "react-icons/gi";
import { useContext } from "react";
import { AuthContext } from "../../Hook/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { useEffect } from "react";
import Card from "../Card/card";
import Slider from "../SliderCard/Slider";
import { NavLink } from "react-router-dom";
import Weekly from "../weekly/Weekly";
import Login from "../login/Login";
import { useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import LogoutIcon from "@mui/icons-material/Logout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BounceLoader from "react-spinners/BounceLoader";
import Switch from "react-switch";
import "swiper/css";
import "./home.css";
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
  const [open, setOpen] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [place, setplace] = useState("");
  const [location, setlocation] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onClose = () => setisOpen(false);
  const onOpen = () => setisOpen(true);
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
      console.log(temp.data);
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
  const submit = async (e) => {
    e.preventDefault();
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
    <div className="main w-screen h-screen bg-slate-950 flex justify-center">
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
      <div
        style={{ width: "88%" }}
        className="right-cont bg-slate-800 m-2 rounded-md flex flex-col"
      >
        <div className="h-20 w-full  relative">
          <form
            action=""
            onSubmit={submit}
            className="sm-searchBar flex justify-center items-center relative top-4"
          >
            <div className=" search-m w-1/3 h-12 bg-slate-900 rounded-full flex items-center">
              <div className=" ml-4">
                <FontAwesomeIcon icon={faSearch} color="#6e6c69" />
              </div>
              <input
                className="searchDesk w-full h-full rounded-full bg-slate-900 p-4 text-slate-200 outline-none"
                type="text"
                placeholder="Search for city"
                onChange={handlechange}
              />
            </div>
          </form>
          <button
            onClick={onOpen}
            className="  px-2 w-max h-6 absolute top-0 right-0 m-4 "
          >
            <GiHamburgerMenu color="white" size={"2rem"} />
          </button>
        </div>
        <div className=" secOne w-full h-1/2 flex justify-between px-12 py-4">
          <div className="undersec1 w-1/3 h-full">
            <div className="curr w-full h-full">
              <Card data={Weather} Day={Day} diff={diff} />
            </div>
          </div>
          <p className="hideTitle text-lg mb-2 text-slate-300 font-semibold">
            Daily forecast
          </p>
          <div className="undersec2 w-6/12 h-full  bg-no-repeat bg-cover  rounded-md relative bg-[url(https://wallpaperaccess.com/full/4157519.jpg)]">
            <div
              style={{ backgroundColor: "rgba(0, 0, 0, 0.529)" }}
              className="blur absolute top-0 bottom-0 left-0 right-0 z-20 w-full h-full backdrop-blur-md"
            ></div>
            <div className="dailyContainer h-full overflow-hidden absolute top-0 bottom-0 left-0 right-0 z-30 ">
              {Weather && Weather.daily.map((cr) => <Weekly data={cr} />)}
            </div>
          </div>
        </div>
        <div className="w-full h-1/4 bg-slate-800 flex flex-col justify-between ">
          <h2 className=" text-slate-200 mb-2 mt-2 ml-2 font-semibold">
            Hourly Forecast
          </h2>
          <div className="hourlyCont w-full h-full overflow-hidden">
            <Swiper
              spaceBetween={10}
              slidesPerView={4}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {Weather &&
                Weather.hourly.map((cr) => (
                  <SwiperSlide>
                    <Slider
                      diff={diff}
                      data={cr}
                      timezone={Weather.timezone}
                      sunset={Weather.current.sunset}
                      sunrise={Weather.current.sunrise}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"xs"}>
        <DrawerOverlay />
        <DrawerContent>
          <div className="left-cont h-screen  bg-slate-800 m-1 flex flex-col justify-between">
            <div className="absolute left-0 top-0 my-2">
              <button className="w-max px-2" onClick={onClose}>
                <BiExit color="red" size={"2rem"} />
              </button>
            </div>
            {user_details && (
              <div className="flex items-center flex-col justify-center mt-8">
                <button
                  onClick={handleOpen}
                  className=" text-slate-200 flex items-center bg-blue-500 p-2 rounded-md mt-4 mb-4"
                >
                  <ImLocation />
                  Set Location
                </button>
                <div className="togBtn flex items-center justify-between bg-slate-900 w-full">
                  <div className="flex items-center ">
                    <BiBell color=" red" size={"1.5rem"} />
                    <p className=" text-slate-100 mx-2 my-4 text-lg">
                      Rain Alerts
                    </p>
                  </div>

                  <Switch checked={checked} onChange={changeNotification} />
                </div>
              </div>
            )}
            {user_details ? (
              <div className=" flex items-center  flex-col mb-4">
                <div className="flex items-center mb-8">
                  <img
                    className=" w-16 h-16 rounded-full mr-2"
                    src={user_details.profileImg}
                    alt=""
                  />
                  <h3 className="usr text-slate-50">{user_details.username}</h3>
                </div>

                <div onClick={logout} className="logOut w-max px-2 bg-red-600">
                  Logut
                </div>
              </div>
            ) : (
              <div className="Login flex items-center justify-center h-screen">
                <button
                  className=" bg-green-600 px-2 rounded-md text-lg text-slate-100"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {open && (
        <div className="openModal">
          <Modal isOpen={open} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
              <div className=" flex justify-center items-center flex-col bg-slate-900 border-sky-200 m-1 border-spacing-2 ">
                <div className="h-12 w-72 mb-6">
                  <form
                    action=""
                    onSubmit={yourplace}
                    className="sm-searchBar w-full flex justify-center items-center relative top-4"
                  >
                    <div className="w-full h-12 bg-slate-800 rounded-full flex items-center">
                      <div className=" ml-4">
                        <FontAwesomeIcon icon={faSearch} color="#6e6c69" />
                      </div>
                      <input
                        className="searchDesk w-full h-full rounded-full bg-slate-800 p-4 text-slate-200 outline-none"
                        type="text"
                        placeholder="Search for city"
                        onChange={handle}
                      />
                    </div>
                  </form>
                </div>

                <span className=" text-slate-100 font-semibold">OR</span>
                <button
                  className=" bg-green-400 px-2 py-2 rounded-md mt-2"
                  onClick={fetchCord}
                >
                  Get Your Current Location
                </button>
                {location && (
                  <p className=" text-slate-300">
                    Your Coordinates:
                    <span className=" text-cyan-400 text-sm font-semibold">
                      Latitude:{location.latitude} Longitude:
                      {location.longitude}
                    </span>
                  </p>
                )}
                {err && location.length == 0 && (
                  <label className=" italic text-red-400 text-sm">
                    Set Your Location
                  </label>
                )}
                <button
                  className=" bg-teal-700 text-slate-100 rounded-md px-2 mt-8 mb-4"
                  onClick={sendCoordinates}
                >
                  Submit
                </button>
              </div>
            </ModalContent>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Home;
