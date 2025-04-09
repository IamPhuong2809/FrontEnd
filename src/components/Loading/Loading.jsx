import React from "react";
import "./Loading.css";

const Loading = ({ message = "Đang kết nối với server..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="css-spinner"></div>

        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default Loading;