import React, { useEffect, useState } from "react";
import axios from "axios";
import "./register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudMoon,
  faSearch,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { FaUpload, FaLocationArrow } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [value, setvalue] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    email: "",
    file: "",
    coordinates: "",
  });
  const [open, setOpen] = React.useState(false);
  const [place, setplace] = useState("");
  const [image, setimage] = useState("Upload Image");
  const [active, setActive] = useState(false);
  const [err, seterr] = useState(false);
  const [location, setlocation] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [Loading, setloading] = useState(false);
  const Url = process.env.REACT_APP_Url;
  const locModal = () => {
    if (location.length == 0) {
      seterr(true);
    } else {
      handleClose();
      seterr(false);
    }
  };
  const navigate = useNavigate();
  const [Day, setDay] = useState("");

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
    location &&
      setvalue((prev) => ({
        ...prev,
        coordinates: [location.latitude, location.longitude],
      }));
  }, [location]);

  const yourplace = async () => {
    try {
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
  const fetchCord = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const la = await position.coords.latitude;
      const lo = await position.coords.longitude;
      setlocation({ latitude: la, longitude: lo });
    });
  };
  const handlechange = (e) => {
    setvalue((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const uploadImage = (e) => {
    setvalue((prev) => ({ ...prev, [e.target.id]: e.target.files[0] }));
    setimage(e.target.files[0].name);
  };
  const SendImage = async () => {
    if (
      value.email.length == 0 ||
      value.username.length == 0 ||
      value.firstname.length == 0 ||
      value.lastname.length == 0 ||
      value.password.length == 0 ||
      value.coordinates.length == 0 ||
      value.file.length == 0
    ) {
      setActive(true);
    } else {
      const formdata = new FormData();
      formdata.append("username", value.username);
      formdata.append("firstname", value.firstname);
      formdata.append("lastname", value.lastname);
      formdata.append("password", value.password);
      formdata.append("email", value.email);
      formdata.append("file", value.file);
      console.log(...formdata);
      const call = async () => {
        setloading(true);
        const res = await axios.post(`${Url}/auth/img`, formdata);
        setloading(false);
        toast.success("registered successfully", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      };
      call();
      navigate("/login");
    }
  };
  const handle = (e) => {
    setplace(e.target.value);
  };

  return (
    <div className="registerContainer">
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
                    Latitude:{location.latitude} Longitude:{location.longitude}
                  </span>
                </p>
              )}
              {err && location.length == 0 && (
                <label className="locLabel">Set Your Location</label>
              )}
              <button onClick={locModal} className="CloseClo">
                Submit
              </button>
            </div>
          </Box>
        </Modal>
      </div>
      <h1 className="log-h1">REGISTER</h1>
      <form action="submit">
        <div className="form">
          <input
            type="text"
            id="username"
            placeholder="Username"
            onChange={handlechange}
          />
          {active && value.username.length == 0 && (
            <label>Username cannot be empty</label>
          )}
          <input
            type="text"
            id="firstname"
            placeholder="First Name"
            onChange={handlechange}
          />
          {active && value.firstname.length == 0 && (
            <label>Firstname cannot be empty</label>
          )}
          <input
            type="text"
            id="lastname"
            placeholder="Last Name"
            onChange={handlechange}
          />
          {active && value.lastname.length == 0 && (
            <label>Lastname cannot be empty</label>
          )}
          <input
            type="text"
            id="password"
            placeholder="Password"
            onChange={handlechange}
          />
          {active && value.password.length == 0 && (
            <label>Password cannot be empty</label>
          )}
          <input
            type="email"
            id="email"
            placeholder="Email"
            onChange={handlechange}
          />
          {active && value.email.length == 0 && (
            <label>Email cannot be empty</label>
          )}
          <input
            className="fileInp"
            onChange={uploadImage}
            id="file"
            type="file"
            name="image"
          />
        </div>
        <div className="fileSelect">
          <label htmlFor="file">
            <FaUpload /> {image}
          </label>
        </div>
      </form>
      <div onClick={handleOpen} className="openCLose">
        <FaLocationArrow />
        Set Your Location
      </div>
      {active && value.coordinates.length == 0 && (
        <label className="locLabel">Set Your Location</label>
      )}
      <button onClick={SendImage}> Register</button>
      <ClipLoader
        color={"red"}
        loading={Loading}
        size={17}
        aria-label="Loading Spinner"
        data-testid="loader"
        className="cliplod"
      />
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

export default Register;
