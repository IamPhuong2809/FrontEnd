import React from "react";
import "./Loading.css";

const Loading = ({ message }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="css-spinner"></div>

        <p className="loading-text">  
          Loading data...<br/>
          Try reload page if stalling time too long
        </p>
      </div>
    </div>
  );
};

export default Loading;