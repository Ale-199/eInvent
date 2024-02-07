import "./Sidebar.css";

import { SiCoda } from "react-icons/si";
import { HiMenuAlt3 } from "react-icons/hi";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar__topSection">
          <div className="sidebar__logo">
            <SiCoda
              color="white"
              size={35}
              style={{ cursor: "pointer" }}
              onClick={navigateToHome}
            />
          </div>
          <div className="bars__button">
            <HiMenuAlt3 onClick={toggle} />
          </div>
        </div>
      </div>
    </div>
  );
}
