import React, { useEffect, useRef, useState } from 'react';
import ROSLIB from 'roslib';
import './Information.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Header/Header'

const Information = () => {
    return (
    <div>
        <HeaderControl />
        <Menu />
    </div>
    )
}

export default Information