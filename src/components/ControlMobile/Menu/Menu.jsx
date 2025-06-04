import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Menu.css'
import logo1 from '@images/PowerRobot.png'
import logo2 from '@images/Configuration.png'
import logo3 from '@images/PositioningList.png'
import logo4 from '@images/TeachPath.png'
import logo6 from '@images/information.png'

const Menu = () => {
    const location = useLocation();
    const tooltipsLink = [
        "/ControlMobile/PowerMobile",
        "/ControlMobile/Maps",
        "/ControlMobile/Missions",
        "/ControlMobile/RecordMap",
        "/ControlMobile/UpdateMap",
        "/ControlMobile/Infomation",
    ]

    const getActiveIndex = () => {
        return tooltipsLink.findIndex(link => location.pathname === link);
    };
    
    const logos = [logo1, logo4, logo2, logo6, logo6, logo6];
    // Mảng chứa nội dung tooltip cho từng button
    const tooltips = [
        "Power Mobile",
        "Maps",
        "Missions",
        "RecordMap",
        "UpdateMap",
        "Information"
        ];

    const formatPath = (text) => {
        return text.replace(/\s+/g, '');
    };

    return (
        <nav className='control-menu'>
          {logos.map((logo, index) => (
            <div key={index} className="button-wrapper">
              <Link to={`/ControlMobile/${formatPath(tooltips[index])}`}>
                <img 
                  src={logo} 
                  alt={`Button ${index + 1}`} 
                  className={`control-button ${getActiveIndex() === index ? 'active' : ''}`} 
                />
              </Link>
              <span className="tooltip">{tooltips[index]}</span>
            </div>
          ))}
        </nav>
    );
}

export default Menu