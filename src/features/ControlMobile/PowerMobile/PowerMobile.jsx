import React, { useEffect, useRef } from 'react';
import HeaderControl from "@components/Header/Header";
import Menu from "@components/ControlMobile/Menu/Menu"

const ControlMobile = () => {
    return (
        <div>
            <HeaderControl />
            <Menu />
        </div>
    )
};

export default ControlMobile;