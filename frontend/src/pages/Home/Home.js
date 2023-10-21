import React from "react";

import "./Home.css";
import homeImg from "../../assets/landingPageImg.png";

import { SiCoda } from "react-icons/si";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home__bg">
      <div className="nav__bar">
        <SiCoda color="white" size={40} />
        <div className="homeButton__container">
          <Link className="homeBtn btn" to="/register">
            Register
          </Link>
          <Link className="btn" to="/login">
            Login
          </Link>
        </div>
      </div>
      <div className="home__content">
        <div className="homeContent__left">
          <h2>Inventory & Stock Management solution</h2>
          <h3>
            Inventory system to control and mange products in the warehouse in
            real time and integrated to make it easier to develop your business.
          </h3>
          <h3>Free Trial 1 Month</h3>
          <div className="homeContent__number">
            <NumberText num="14K" text="Brand Owners" />
            <NumberText num="23K" text="Active Users" />
            <NumberText num="500+" text="Partners" />
          </div>
        </div>
        <div className="homeContent__right">
          <img src={homeImg} alt="home Image" className="home__image"/>
        </div>
      </div>
    </div>
  );
};

const NumberText = ({ num, text }) => {
  return (
    <div className="numberText__container">
      <h3>{num}</h3>
      <p>{text}</p>
    </div>
  );
};

export default Home;
