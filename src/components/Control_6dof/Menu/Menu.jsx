import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Menu.css'
import logo1 from '@images/picture1.png'
import logo2 from '@images/picture2.png'
import logo3 from '@images/picture3.png'
import logo4 from '@images/picture4.png'
import logo5 from '@images/picture5.png'
import logo6 from '@images/picture6.png'

const Menu = () => {
    const location = useLocation();
    const tooltipsLink = [
        "/6dof/PowerRobot",
        "/6dof/Configuration",
        "/6dof/PositionList",
        "/6dof/TeachPath",
        "/6dof/MovePath",
        "/6dof/Move",
        "/6dof/Information"
    ]

    const getActiveIndex = () => {
        return tooltipsLink.findIndex(link => location.pathname === link);
    };
    
    const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo1];
    // Mảng chứa nội dung tooltip cho từng button
    const tooltips = [
        "Power Robot",
        "Configuration",
        "Position List",
        "Teach Path",
        "Move Path",
        "Move",
        "Information"
        ];

    const formatPath = (text) => {
        return text.replace(/\s+/g, '');
    };

    return (
        <nav className='control-menu'>
          {logos.map((logo, index) => (
            <div key={index} className="button-wrapper">
              <Link to={`/6dof/${formatPath(tooltips[index])}`}>
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