import React from "react";
import { useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Hook/AuthContext.js";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import ClipLoader from "react-spinners/ClipLoader";

const Url = process.env.REACT_APP_Url;
const Login = () => {
  const navigate = useNavigate();
  const { loading, error, dispatch } = useContext(AuthContext);
  const [Loading, setloading] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    username: undefined,
    password: undefined,
  });
  const handleChange = (e) => {
    setLoginDetails((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      setloading(true);
      const res = await axios.post(`${Url}/auth/login`, loginDetails);
      setloading(false);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      console.log(err);
      setloading(false);
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.message });
      toast.error(err.response.data.message, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log(err);
    }
  };
  return (
    <div className="login-container">
      <h1 className="log-h1">LOGIN</h1>
      <div className="login-form">
        <input
          className="login-input"
          placeholder="Enter username"
          type="text"
          id="username"
          onChange={handleChange}
        />
        <input
          className="login-input"
          placeholder="Enter password"
          type="text"
          id="password"
          onChange={handleChange}
        />
        <button onClick={handleClick}>
          {" "}
          <ClipLoader
            color={"red"}
            loading={Loading}
            size={17}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="cliplod"
          />
          LOGIN
        </button>
        <div className="direct">
          New User?{" "}
          <NavLink to={"/register"}>
            <p> Register here</p>
          </NavLink>
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
    </div>
  );
};

export default Login;
