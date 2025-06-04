import React, { useEffect, useRef, useState } from 'react';
import ROSLIB from 'roslib';
import './Information.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Header/Header'

const Information = () => {
    const canvasRef = useRef(null);
    const [scanData, setScanData] = useState([]);

    useEffect(() => {
        const ros = new ROSLIB.Ros({
            url: 'ws://localhost:9090',
        });

        ros.on('connection', () => console.log('Connected to ROS'));

        const scanListener = new ROSLIB.Topic({
            ros,
            name: '/scan',
            messageType: 'sensor_msgs/msg/LaserScan',
        });

        scanListener.subscribe((message) => {
            const ranges = message.ranges;
            const angle_min = message.angle_min;
            const angle_increment = message.angle_increment;

            const points = [];

            for (let i = 0; i < ranges.length; i++) {
            const r = ranges[i];
            if (r < message.range_min || r > message.range_max) continue;

            const angle = angle_min + i * angle_increment;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            points.push({ x, y });
            }

            setScanData(points);
        });

        return () => {
            scanListener.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Chuyển hệ tọa độ gốc ra giữa canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);

        ctx.fillStyle = 'red';
        scanData.forEach((point) => {
            const scale = 50; // scale to pixels
            const x = point.x * scale;
            const y = -point.y * scale; // lật trục y

            ctx.fillRect(x, y, 2, 2);
        });

        // Reset transform để tránh bị cộng dồn
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }, [scanData]);

    return (
    <div>
        <HeaderControl />
        <Menu />
        <div className='troll'>
            <canvas
                ref={canvasRef}
                width={700}
                height={700}
                style={{ border: '1px solid black', background: '#eee' }}
            />
        </div>
    </div>
    )
}

export default Information