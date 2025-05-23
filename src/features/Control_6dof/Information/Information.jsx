import React, { useEffect, useRef, useState } from 'react';
import ROSLIB from 'roslib';
import './Information.css'
import Menu from '@components/Control_6dof/Menu/Menu'
import HeaderControl from '@components/Control_6dof/Header/Header'

const Information = () => {
    const canvasRef = useRef(null);
    const [mapData, setMapData] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
    const [odomPosition, setOdomPosition] = useState({ x: 0, y: 0, z: 0 });
    const [goalPosition, setGoalPosition] = useState(null);
    const [planData, setPlanData] = useState(null);

    useEffect(() => {
        const ros = new ROSLIB.Ros({
        url: 'ws://localhost:9090', // đổi nếu ROS chạy trên máy khác
        });

        ros.on('connection', () => {
        console.log('Connected to rosbridge');
        });

        ros.on('error', (error) => {
        console.error('Error connecting to rosbridge:', error);
        });

        const mapTopic = new ROSLIB.Topic({
            ros: ros,
            name: '/map',
            messageType: 'nav_msgs/msg/OccupancyGrid',
        });

        mapTopic.subscribe((message) => {
            setMapData(message);
        });

        const odom_pose = new ROSLIB.Topic({
            ros: ros,
            name: '/odom_pose',
            messageType: 'geometry_msgs/msg/PoseStamped',
        });

        odom_pose.subscribe((message) => {
            setOdomPosition(message.pose.position);
        });

        const robot_pose = new ROSLIB.Topic({
            ros: ros,
            name: '/robot_pose',
            messageType: 'geometry_msgs/msg/PoseStamped',
        });

        robot_pose.subscribe((message) => {
            setPosition(message.pose.position);
        });

        const goal_pose = new ROSLIB.Topic({
            ros: ros,
            name: '/goal_pose',
            messageType: 'geometry_msgs/msg/PoseStamped',
        });
        
        goal_pose.subscribe((message) => {
            setGoalPosition(message.pose.position);
        });

        const planTopic = new ROSLIB.Topic({
            ros: ros,
            name: '/plan',
            messageType: 'nav_msgs/msg/Path',
        });
        
        planTopic.subscribe((message) => {
            setPlanData(message);
        });
        

        return () => {
            mapTopic.unsubscribe();
            odom_pose.unsubscribe();
            robot_pose.unsubscribe();
            goal_pose.unsubscribe();
            planTopic.unsubscribe();
            ros.close();
        };
    }, []);

    useEffect(() => {
        if (!mapData) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const width = mapData.info.width;
        const height = mapData.info.height;
        const data = mapData.data;

        canvas.width = width;
        canvas.height = height;

        const imageData = ctx.createImageData(width, height);

        for (let i = 0; i < data.length; i++) {
            let val = data[i];
            let color;

            if (val === -1) color = 127;       // Unknown -> xám
            else if (val === 0) color = 255;   // Free -> trắng
            else color = 0;                    // Occupied -> đen

            imageData.data[i * 4 + 0] = color; // R
            imageData.data[i * 4 + 1] = color; // G
            imageData.data[i * 4 + 2] = color; // B
            imageData.data[i * 4 + 3] = 255;   // A
        }

        // Lật ảnh theo chiều dọc để khớp RViz
        ctx.putImageData(imageData, 0, 0);
        ctx.translate(0, height);
        ctx.scale(1, -1);
        ctx.drawImage(canvas, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform

        const resolution = mapData.info.resolution;
        const origin = mapData.info.origin.position;

        
        // Vẽ robot dạng hình tròn đỏ
        if (goalPosition) {
            const dx = position.x - goalPosition.x;
            const dy = position.y - goalPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
        
            if (distance > 0.2) {
                const goalX = (goalPosition.x - origin.x) / resolution;
                const goalY = (goalPosition.y - origin.y) / resolution;
        
                ctx.beginPath();
                ctx.arc(goalX, height - goalY, 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'green';
                ctx.fill();

                ctx.beginPath();

                for (let i = 0; i < planData.poses.length; i++) {
                    const pose = planData.poses[i].pose.position;
            
                    const px = (pose.x - origin.x) / resolution;
                    const py = (pose.y - origin.y) / resolution;
            
                    if (i === 0) {
                        ctx.moveTo(px, height - py);
                    } else {
                        ctx.lineTo(px, height - py);
                    }
                }
            
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            else {
                setGoalPosition(null);
            }
        }    

        const x0 = (odomPosition.x - origin.x) / resolution;
        const y0 = (odomPosition.y - origin.y) / resolution;
        
        ctx.beginPath();
        ctx.arc(x0, height - y0, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        
        const x = (position.x - origin.x) / resolution;
        const y = (position.y - origin.y) / resolution;

        ctx.beginPath();
        ctx.arc(x, height - y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.restore();
    }, [mapData, position]);

    return (
    <div>
        <HeaderControl />
        <Menu />
        <div className='troll'>
            <canvas ref={canvasRef} style={{ border: '1px solid black', width: '600px', height: '600px' }} />    
        </div>
    </div>
    )
}

export default Information