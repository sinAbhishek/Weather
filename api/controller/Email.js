import express from "express";
import twilio from "twilio";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cron from "node-cron";
import User from "../model/User.js";
import axios from "axios";
const router = express.Router();
dotenv.config();
const openapi = process.env.OpenApi;

const getUsers = async () => {
  try {
    const users = await User.find({ notifications: true });
    users && users.map((user) => getweather(user));
  } catch (err) {
    console.log(err);
  }
};
const crontask = async (req, res, next) => {
  try {
    const res = await axios.get(
      "https://weather-34iw.onrender.com/api/auth/64550011bc99c670ea3c42ce"
    );
    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
};
export const test = async (req, res, next) => {
  console.log("hehe");
  res.status(200).json({ response: "success" });
};
const getweather = async (User) => {
  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${User.coordinates[0]}&lon=${User.coordinates[1]}&units=metric&appid=${openapi}`;
    const temp = await axios.get(url);
    const sky = temp.data.hourly[5].weather[0].main;
    console.log(sky);
    if (sky === "Rain") {
      const res = await sendEmail(User.email);
    } else {
      console.log("no rain");
    }
  } catch (err) {
    console.log(err);
  }
};

cron.schedule("*/50 * * * * ", getUsers);
cron.schedule("*/10 * * * * ", crontask);

export const sendEmail = async (email) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "weatherservice95@gmail.com",
      pass: process.env.AppPass,
    },
  });

  let mailDetails = {
    from: "weatherservice95@gmail.com",
    to: email,
    subject: "Rain Alert",
    text: "Hey there! Just wanted to give you a friendly heads-up about the weather forecast in your area. It seems like rain is on its way to grace us with its presence. Remember to grab your umbrella, put on a cozy jacket, and stay dry!",
  };
  try {
    const res = mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent successfully");
      }
    });
  } catch (err) {
    console.log(err);
  }
};
