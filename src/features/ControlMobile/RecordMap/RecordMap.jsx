import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from 'react-router-dom'; 
import ROSLIB from 'roslib';
import toast from 'react-hot-toast';
import HeaderControl from "@components/Header/Header";
import Menu from "@components/ControlMobile/Menu/Menu"
import { useMapContext } from '@components/ControlMobile/MapContext';
import { API_URL } from '@utils/config';
import './RecordMap.css'

const RecordMaps = () => {
    const { selectedMap, selectedSite} = useMapContext(); 
    const navigate = useNavigate();

    const [isROSConnected, setIsROSConnected] = useState(false);
    const canvasRef = useRef(null);
    const [mapData, setMapData] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0, theta: 0 });
    const [odomPosition, setOdomPosition] = useState({ x: 0, y: 0, z: 0 });
    const [goalPosition, setGoalPosition] = useState(null);
    const [planData, setPlanData] = useState(null);
    const cmdVelPublisher = useRef(null);
    const [isControlling, setIsControlling] = useState(false);
    const lastTwist = useRef(null);

    const [isStartRecord, setIsStartRecord] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [currentDirection, setCurrentDirection] = useState('');
    const [joystickIntensity, setJoystickIntensity] = useState(0);
    const [dragging, setDragging] = useState(false);
    const baseRef = useRef(null);
    const knobRef = useRef(null);

    const startMappingRef = useRef(null);
    const pauseMappingRef = useRef(null);
    const resumeMappingRef = useRef(null);
    const resetMappingRef = useRef(null);
    const backupMapRef = useRef(null);
    const startLocalizationRef = useRef(null);

    useEffect(() => {
        const savedMap = localStorage.getItem('selectedMap');
        const savedSite = localStorage.getItem('selectedSite');

        if (!savedMap || !savedSite) {
            toast.error('Please select a site and map first!', {
                style: {border: '1px solid red'}
            });
            navigate('/ControlMobile/Maps');
            return;
        }

        //#region connect
        const ros = new ROSLIB.Ros({
            url: 'ws://192.168.5.110:9090', // đổi nếu ROS chạy trên máy khác
        });

        ros.on('connection', () => {
            console.log('Connected to rosbridge');
            setIsROSConnected(true); 
            toast.success("Successfully connect, you can record now!", {
                style: {border: '1px solid green'}});
        });

        ros.on('error', (error) => {
            console.error('Error connecting to rosbridge:', error);
            setIsROSConnected(false);
        });

        ros.on('close', () => {
            console.log('Connection to rosbridge closed');
        });
        //#endregion

        //#region Sub
        //Map
        const mapTopic = new ROSLIB.Topic({
            ros: ros,
            name: '/map',
            messageType: 'nav_msgs/msg/OccupancyGrid',
        });

        mapTopic.subscribe((message) => {
            setMapData(message);
        });

        //Odom
        const odom_pose = new ROSLIB.Topic({
            ros: ros,
            name: '/odom_pose',
            messageType: 'geometry_msgs/msg/PoseStamped',
        });

        odom_pose.subscribe((message) => {
            setOdomPosition(message.pose.position);
        });

        //Robot pose
        const robot_pose = new ROSLIB.Topic({
            ros: ros,
            name: '/robot_pose',
            messageType: 'geometry_msgs/msg/Pose2D',
        });

        robot_pose.subscribe((message) => {
            setPosition({ x: message.x, y: message.y, theta: message.theta });
        });

        //Pose
        const goal_pose = new ROSLIB.Topic({
            ros: ros,
            name: '/goal_pose',
            messageType: 'geometry_msgs/msg/PoseStamped',
        });
        
        goal_pose.subscribe((message) => {
            setGoalPosition(message.pose.position);
        });
        
        //Plan
        const planTopic = new ROSLIB.Topic({
            ros: ros,
            name: '/plan',
            messageType: 'nav_msgs/msg/Path',
        });
        
        planTopic.subscribe((message) => {
            setPlanData(message);
        });
        //#endregion

        //#region Pub
        //Vel pub
        cmdVelPublisher.current = new ROSLIB.Topic({
            ros: ros,
            name: '/diff_base_controller/cmd_vel_unstamped',
            messageType: 'geometry_msgs/msg/Twist',
        });

        //#endregion
        
        //#region Service
        //Start Mapping
        const setMappingMode = new ROSLIB.Service({
            ros: ros,
            name: '/rtabmap/set_mode_mapping',
            serviceType: 'std_srvs/Empty'
        });

        startMappingRef.current = () => {
            const request = new ROSLIB.ServiceRequest({});
            setMappingMode.callService(request, (result) => {
                console.log('Bắt đầu ghi bản đồ!', result);
            });
        };

        // Service Pause
        const pauseService = new ROSLIB.Service({
            ros: ros,
            name: '/rtabmap/pause',
            serviceType: 'std_srvs/Empty'
        });

        pauseMappingRef.current = () => {
            const request = new ROSLIB.ServiceRequest({});
            pauseService.callService(request, (result) => {
                console.log('Tạm dừng mapping!', result);
            });
        };

        // Service Resume
        const resumeService = new ROSLIB.Service({
            ros: ros,
            name: '/rtabmap/resume',
            serviceType: 'std_srvs/Empty'
        });

        resumeMappingRef.current = () => {
            const request = new ROSLIB.ServiceRequest({});
            resumeService.callService(request, (result) => {
                console.log('Tiếp tục mapping!', result);
            });
        };

        // Service Reset
        const resetService = new ROSLIB.Service({
            ros: ros,
            name: '/rtabmap/reset',
            serviceType: 'std_srvs/Empty'
        });

        resetMappingRef.current = () => {
            const request = new ROSLIB.ServiceRequest({});
            resetService.callService(request, (result) => {
                console.log('Reset bản đồ thành công!', result);
            });
        };

        //Backup service
        const backupService = new ROSLIB.Service({
            ros: ros,
            name: '/rtabmap/backup',
            serviceType: 'std_srvs/Empty'
        });

        backupMapRef.current = (filePath) => {
            const request = new ROSLIB.ServiceRequest({});
            backupService.callService(request, (result) => {
                console.log('Bản đồ đã được lưu tại:', filePath);
            });
        };

        //const changetype
        const setLocalizationMode = new ROSLIB.Service({
            ros: ros,
            name: '/rtabmap/set_mode_localization',
            serviceType: 'std_srvs/Empty'
        });

        startLocalizationRef.current = () => {
            const request = new ROSLIB.ServiceRequest({});
            setLocalizationMode.callService(request, (result) => {
                console.log('Set mode localization success!');
            });
        };
        //#endregion

        return () => {
            mapTopic?.unsubscribe();
            odom_pose?.unsubscribe();
            robot_pose?.unsubscribe();
            goal_pose?.unsubscribe();
            planTopic?.unsubscribe();
            cmdVelPublisher.current?.unadvertise();
            ros?.close();
        };

    }, [selectedMap, selectedSite, navigate]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Nếu đang trong quá trình record thì cảnh báo
            if (isRecording) {
                event.preventDefault();
                event.returnValue = ''; // Dòng này là bắt buộc cho Chrome
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isRecording]);

    //#region Map
    const drawEnhancedRobot = (ctx, x, y, theta, width, height) => {
        ctx.save();
        
        // Di chuyển context đến vị trí robot
        ctx.translate(x, height - y);
        ctx.rotate(-theta * Math.PI / 180); // Rotate theo hướng robot
        
        const robotSize = 6; // Kích thước robot
        
        // Vẽ thân robot (hình ellipse)
        ctx.beginPath();
        ctx.ellipse(0, 0, robotSize, robotSize - 2, 0, 0, 2 * Math.PI);
        
        // Gradient cho thân robot
        const bodyGradient = ctx.createRadialGradient(-2, -2, 0, 0, 0, robotSize);
        bodyGradient.addColorStop(0, '#4a90e2');
        bodyGradient.addColorStop(0.7, '#357abd');
        bodyGradient.addColorStop(1, '#2c5aa0');
        
        ctx.fillStyle = bodyGradient;
        ctx.fill();
        
        // Viền thân robot
        ctx.strokeStyle = '#1e3a5f';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Vẽ đầu robot (phần trước)
        ctx.beginPath();
        ctx.arc(robotSize - 2, 0, 3, 0, 2 * Math.PI);
        
        const headGradient = ctx.createRadialGradient(-1, -1, 0, 0, 0, 3);
        headGradient.addColorStop(0, '#ff6b6b');
        headGradient.addColorStop(0.8, '#e55555');
        headGradient.addColorStop(1, '#cc4444');
        
        ctx.fillStyle = headGradient;
        ctx.fill();
        ctx.strokeStyle = '#aa3333';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Vẽ mắt robot
        ctx.beginPath();
        ctx.arc(robotSize - 2, -1, 1, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(robotSize - 2, 1, 1, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Vẽ bánh xe
        const wheelLength = 6;
        const wheelWidth = 2;
        
        // Bánh xe trái
        ctx.beginPath();
        ctx.rect(-wheelLength/2, robotSize - 1, wheelLength, wheelWidth);
        ctx.fillStyle = '#2c3e50';
        ctx.fill();
        ctx.strokeStyle = '#1a252f';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Bánh xe phải
        ctx.beginPath();
        ctx.rect(-wheelLength/2, -robotSize + 1 - wheelWidth, wheelLength, wheelWidth);
        ctx.fillStyle = '#2c3e50';
        ctx.fill();
        ctx.strokeStyle = '#1a252f';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Vẽ mũi tên chỉ hướng (stylized)
        ctx.beginPath();
        ctx.moveTo(robotSize + 12, 0);
        ctx.lineTo(robotSize + 4, -3);
        ctx.lineTo(robotSize + 6, 0);
        ctx.lineTo(robotSize + 4, 3);
        ctx.closePath();
        
        const arrowGradient = ctx.createLinearGradient(robotSize + 4, 0, robotSize + 12, 0);
        arrowGradient.addColorStop(0, '#ff9500');
        arrowGradient.addColorStop(1, '#ff6b00');
        
        ctx.fillStyle = arrowGradient;
        ctx.fill();
        ctx.strokeStyle = '#cc5500';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Vẽ trail nhẹ phía sau robot
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(-robotSize - (i * 3), 0, robotSize * (0.3 - i * 0.08), 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(74, 144, 226, ${0.15 - i * 0.04})`;
            ctx.fill();
        }
        
        ctx.restore();
    };

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

        
        // Vẽ robot dạng hình tròn xanh
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
                if (planData?.poses){
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
            }
            else {
                setGoalPosition(null);
            }
        }    

        const x0 = (odomPosition.x - origin.x) / resolution;
        const y0 = (odomPosition.y - origin.y) / resolution;
        
        ctx.beginPath();
        ctx.arc(x0, height - y0, 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        
        const x = (position.x - origin.x) / resolution;
        const y = (position.y - origin.y) / resolution;

        drawEnhancedRobot(ctx, x, y, position.theta, width, height);

        ctx.restore();
    }, [mapData, position, odomPosition, goalPosition, planData]);

    //#endregion

    //#region Control
    const handleMouseDown = () => {
        setDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;

        const base = baseRef.current;
        const knob = knobRef.current;
        const rect = base.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.min(Math.sqrt(dx*dx + dy*dy), 50);

        const angle = Math.atan2(dy, dx);
        let intensity = distance / 50;

        const deg = angle * 180 / Math.PI;
        let direction = '';
        if (deg >= -22.5 && deg < 45) direction = 'right';
        else if (deg >= -67.5 && deg < -22.5) direction = 'turn-right'
        else if (deg >= -112.5 && deg < -67.5) direction = 'forward';
        else if (deg >= -157.5 && deg < -112.5) direction = 'turn-left'
        else if (deg >= 135 || deg < -157.5) direction = 'left';
        else {
            direction = 'rear';
        }

        handleJoystickMove(direction, intensity);

        knob.style.left = `${50 + (dx / rect.width) * 100}%`;
        knob.style.top = `${50 + (dy / rect.height) * 100}%`;
        knob.style.transform = 'translate(-50%, -50%)';
    };

    const handleMouseUp = () => {
        setDragging(false);
        handleJoystickStop();

        const knob = knobRef.current;
        if (knob) {
            knob.style.left = '50%';
            knob.style.top = '50%';
            knob.style.transform = 'translate(-50%, -50%)';
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragging]);

    const handleJoystickMove = (direction, intensity) => {
        setCurrentDirection(direction);
        setJoystickIntensity(intensity);
        setIsControlling(true);

        const twist = new ROSLIB.Message({
            linear: { x: 0, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: 0 }
        });

        switch (direction) {
            case 'forward':
                twist.linear.x = 0.05;
                break;
            case 'turn-left':
                twist.linear.x = 0.025;
                twist.angular.z = 0.05;
                break;
            case 'turn-right':
                twist.linear.x = 0.025;
                twist.angular.z = -0.05;
                break;
            case 'left':
                twist.angular.z = 0.0015;
                break;
            case 'right':
                twist.angular.z = -0.0015;
                break;
            case 'rear':
                twist.linear.x = -0.05;
                break;
            default:
                break;
                
        }

        lastTwist.current = twist;
        cmdVelPublisher.current.publish(twist);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (isControlling && lastTwist.current && cmdVelPublisher.current) {
                cmdVelPublisher.current.publish(lastTwist.current);
            }
        }, 100); // Publish mỗi 100ms

        return () => clearInterval(interval);
    }, [isControlling]);

    const handleJoystickStop = () => {
        setCurrentDirection('');
        setJoystickIntensity(0);
        setIsControlling(false);

        const stopTwist = new ROSLIB.Message({
            linear: { x: 0, y: 0, z: 0 },
            angular: { x: 0, y: 0, z: 0 }
        });

        cmdVelPublisher.current.publish(stopTwist);
        lastTwist.current = stopTwist;
    };

    const handleToggleRecord = () => {
        if(isStartRecord){
            setIsStartRecord(false);
            startMappingRef.current?.();
        }
        else{
            if(isRecording)
            {
                pauseMappingRef.current?.();
            }
            else{
                resumeMappingRef.current?.();
            }
        }
        setIsRecording(!isRecording);
    };

    const handleFinish = async () => {
        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}` +
                        `${now.getDate().toString().padStart(2, '0')}_` +
                        `${now.getHours().toString().padStart(2, '0')}` +
                        `${now.getMinutes().toString().padStart(2, '0')}` +
                        `${now.getSeconds().toString().padStart(2, '0')}`;
        const fileName = `map_${timestamp}.db`;

        // Tiếp tục logic nếu cần
        // backupMapRef.current?.();
        startLocalizationRef.current?.();

        try {
            const response = await fetch(API_URL + 'save_map/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName, id_parent:selectedSite.id, id:selectedMap.id }),
            });

            const result = await response.json();
            if(result.success){
                toast.success("Successfully save map!", {
                style: {border: '1px solid green'}});
                handleBack();
            } else {
                toast.error("Failed to save: " + data.error, {
                style: {border: '1px solid red'}});
            }
        } catch (error) {
            console.error('Error sending fileName:', error);
        }
    };

    const handleReset = () => {
        resetMappingRef.current?.();
    };

    const handleBack = () => {
        localStorage.removeItem('selectedMap');
        localStorage.removeItem('selectedSite');

        navigate('/ControlMobile/Maps', {
            state: {
                selectedMapBack: selectedMap,
                selectedSiteBack: selectedSite
            }
        });
    };
    //#endregion

    return (
        <div>
            <HeaderControl />
            <Menu />
            <div className='record-maps-container'>
                <div className="map-container">
                    <canvas 
                        ref={canvasRef} 
                        style={{ 
                            border: '1px solid black', 
                            width: '700px', 
                            maxHeight:'600px',
                            height: 'auto' 
                        }}
                    />
                </div>
                <div className={`control-button-panel ${!isROSConnected ? 'disabled' : ''}`}>
                    <div className="site-map-info">
                        <div>Site: <strong>{selectedSite?.name || 'N/A'}</strong></div>
                        <div>Map: <strong>{selectedMap?.name || 'N/A'}</strong></div>
                    </div>
                    <div className="joystick-container">
                        <div className={`joystick-base ${!isRecording ? 'disabled' : ''}`} ref={baseRef}>
                            <div className="joystick-direction up">↑</div>
                            <div className="joystick-direction down">↓</div>
                            <div className="joystick-direction left">←</div>
                            <div className="joystick-direction right">→</div>
                            <div 
                                className="joystick-knob"
                                ref={knobRef}
                                onMouseDown={handleMouseDown} 
                            />
                        </div>
                    </div>
                    <div className={`joystick-status ${currentDirection ? 'active' : ''}`}>
                        <div>Direction: {currentDirection || 'Stopped'}</div>
                        <div>Power: {(joystickIntensity * 100).toFixed(0)}%</div>
                    </div>
                    <div className="action-btns">
                        <button 
                            className={`action-btn record-btn ${isRecording ? 'active' : ''}`}
                            onClick={handleToggleRecord}
                        >
                            {isRecording ? 'Stop Recording' : 'Recording'}
                        </button>
                        <button className="action-btn finish-btn" onClick={handleFinish} disabled={isRecording}>
                            Finish
                        </button>
                        <button className="action-btn reset-btn" onClick={handleReset} disabled={isRecording}>
                            Reset to Initial State
                        </button>
                        <button className="action-btn back-btn" onClick={handleBack} disabled={isRecording}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecordMaps;
