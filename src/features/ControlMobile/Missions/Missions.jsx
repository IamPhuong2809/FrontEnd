import React, { useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom'; 
import ROSLIB from 'roslib';
import toast from 'react-hot-toast';
import HeaderControl from "@components/Header/Header";
import Menu from "@components/ControlMobile/Menu/Menu"
import Rename from '@components/Rename/Rename'
import { useMapContext } from '@components/ControlMobile/MapContext';
import { API_URL } from '@utils/config';
import './Missions.css'
import ZoomableMapCanvas from './ZoomableMapCanvas';

const Missions = () => {
    const { selectedMap, selectedSite } = useMapContext(); 
    const navigate = useNavigate();

    const [isROSConnected, setIsROSConnected] = useState(false);
    const canvasRef = useRef(null);
    const [mapData, setMapData] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0, theta: 0 });
    const [odomPosition, setOdomPosition] = useState({ x: 0, y: 0, z: 0 });
    const [goalPosition, setGoalPosition] = useState(null);
    const [planData, setPlanData] = useState(null);
    const cmdVelPublisher = useRef(null);
    const GoalPosePublisher = useRef(null);
    const [isControlling, setIsControlling] = useState(false);
    const lastTwist = useRef(null);

    // const [isStartRecord, setIsStartRecord] = useState(true);
    // const [isRecording, setIsRecording] = useState(false);
    let isRecording = false;
    const [currentDirection, setCurrentDirection] = useState('');
    const [joystickIntensity, setJoystickIntensity] = useState(0);
    const [dragging, setDragging] = useState(false);
    const baseRef = useRef(null);
    const knobRef = useRef(null);

    const [selectedMissionId, setSelectedMissionId] = useState('');

    const [showRename, setShowRename] = useState(false);    
    const [missions, setMissions] = useState([]);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleRenameConfirm = async (newName) => {
        try {
            const response = await fetch(API_URL + 'position/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: selectedMap.id,
                    id_site: selectedSite.id,
                    name: newName,
                    pos: position,
                }),
            });
    
            const result = await response.json();
            if(result.success){
                toast.success("Saved position successfully!", {
                    style: {border: '1px solid green'}});

                try {
                    const missionsResponse = await fetch(API_URL + "missions/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: selectedMap.id,
                            id_site: selectedSite.id,
                        }),
                    });
                    const missionsResult = await missionsResponse.json();
                    setMissions(missionsResult);
                } catch (error) {
                    console.error("Failed to refresh missions:", error);
                }
            }
            else{
                toast.error("Failed to save", {
                    style: {border: '1px solid red'}});
            }
            setShowRename(false);
        } catch (error) {
            toast.error("Failed to save position");
            console.error(error);
        }
    };
    
    useEffect(() => {
        const savedMapRaw = localStorage.getItem('selectedMap');
        const savedSiteRaw = localStorage.getItem('selectedSite');
        
        const savedMap = savedMapRaw ? JSON.parse(savedMapRaw) : null;
        const savedSite = savedSiteRaw ? JSON.parse(savedSiteRaw) : null;

        if (!savedMapRaw || !savedSiteRaw) {
            toast.error('Please select a site and map first!', {
                style: {border: '1px solid red'}
            });
            navigate('/ControlMobile/Maps');
            return;
        }

        const fetchLoadData = async () => {
            try {
                const response = await fetch(API_URL + "missions/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: savedMap.id,
                        id_site: savedSite.id,
                    }),
                });
                const result = await response.json();
                setMissions(result);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchLoadData();

        //#region connect
        const ros = new ROSLIB.Ros({
            url: 'ws://192.168.5.111:9090', // đổi nếu ROS chạy trên máy khác
            transportOptions: {
                maxMessageSize: 30000000 // Tăng lên 100MB
            }
        });

        ros.on('connection', () => {
            console.log('Connected to rosbridge');
            setIsROSConnected(true); 
            toast.success("Successfully connect, you can give a mission now!", {
                style: {border: '1px solid green'}});

            const mapTopic = new ROSLIB.Topic({
                ros: ros,
                name: '/map',
                messageType: 'nav_msgs/msg/OccupancyGrid',
                throttle_rate: 500,
                queue_length: 1
            });
            
            const handleMapMessage = (message) => {
                setMapData(message);
                mapTopic.unsubscribe();
            };
            
            mapTopic.subscribe(handleMapMessage);
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
            setGoalPosition(message.pose);
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

        
        //Set goal
        GoalPosePublisher.current = new ROSLIB.Topic({
            ros: ros,
            name: '/goal_pose',
            messageType: 'geometry_msgs/msg/PoseStamped',
        });

        //#endregion

        return () => {
            odom_pose?.unsubscribe();
            robot_pose?.unsubscribe();
            goal_pose?.unsubscribe();
            planTopic?.unsubscribe();
            cmdVelPublisher.current?.unadvertise();
            GoalPosePublisher.current?.unadvertise();
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

    // useEffect(() => {
    //     if (!mapData) return;

    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext('2d');

    //     const width = mapData.info.width;
    //     const height = mapData.info.height;
    //     const data = mapData.data;

    //     canvas.width = width;
    //     canvas.height = height;


    //     ctx.save(); // Lưu trạng thái ban đầu

    //     ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform trước khi vẽ
    //     ctx.translate(offset.x, offset.y); // Pan
    //     ctx.scale(scale, scale);           // Zoom

    //     const imageData = ctx.createImageData(width, height);

    //     for (let i = 0; i < data.length; i++) {
    //         let val = data[i];
    //         let color;

    //         if (val === -1) color = 127;       // Unknown -> xám
    //         else if (val === 0) color = 255;   // Free -> trắng
    //         else color = 0;                    // Occupied -> đen

    //         imageData.data[i * 4 + 0] = color; // R
    //         imageData.data[i * 4 + 1] = color; // G
    //         imageData.data[i * 4 + 2] = color; // B
    //         imageData.data[i * 4 + 3] = 255;   // A
    //     }

    //     // Lật ảnh theo chiều dọc để khớp RViz
    //     ctx.putImageData(imageData, 0, 0);
    //     ctx.translate(0, height);
    //     ctx.scale(1, -1);
    //     ctx.drawImage(canvas, 0, 0);
    //     ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform

    //     const resolution = mapData.info.resolution;
    //     const origin = mapData.info.origin.position;

        
    //     if (goalPosition) {
    //         const dx = position.x - goalPosition.position.x;
    //         const dy = position.y - goalPosition.position.y;
    //         const distance = Math.sqrt(dx * dx + dy * dy);
        
    //         if (distance > 0.15) {
    //             const q = goalPosition.orientation;
    
    //             // Giả sử chỉ quay quanh trục Z (yaw)
    //             const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
    //             const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
    //             const yaw = Math.atan2(siny_cosp, cosy_cosp); // radian
            
    //             const goalX = (goalPosition.position.x - origin.x) / resolution;
    //             const goalY = (goalPosition.position.y - origin.y) / resolution;
            
    //             const arrowLength = 12;
    //             const arrowX = goalX + arrowLength * Math.cos(-yaw); // -yaw để đúng hướng trên canvas
    //             const arrowY = (height - goalY) + arrowLength * Math.sin(-yaw);
            
    //             ctx.beginPath();
    //             ctx.arc(goalX, height - goalY, 2, 0, 2 * Math.PI);
    //             ctx.fillStyle = 'red';
    //             ctx.fill();

    //             ctx.beginPath();
    //             ctx.moveTo(goalX, height - goalY);
    //             ctx.lineTo(arrowX, arrowY);
    //             ctx.strokeStyle = 'green';
    //             ctx.lineWidth = 2;
    //             ctx.stroke();
            
    //             if (planData?.poses){
    //                 for (let i = 0; i < planData.poses.length; i++) {
    //                     const pose = planData.poses[i].pose.position;
                
    //                     const px = (pose.x - origin.x) / resolution;
    //                     const py = (pose.y - origin.y) / resolution;
                
    //                     if (i === 0) {
    //                         ctx.moveTo(px, height - py);
    //                     } else {
    //                         ctx.lineTo(px, height - py);
    //                     }
    //                 }
                
    //                 ctx.strokeStyle = 'blue';
    //                 ctx.lineWidth = 1;
    //                 ctx.stroke();
    //             }
    //         }
    //         else {
    //             setGoalPosition(null);
    //         }
    //     }    

    //     // if (missions && missions.length > 0) {
    //     //     missions.forEach((mission) => {
    //     //         const mx = (mission.x - origin.x) / resolution;
    //     //         const my = (mission.y - origin.y) / resolution;
        
    //     //         // Chấm tròn màu tím
    //     //         ctx.beginPath();
    //     //         ctx.arc(mx, height - my, 3, 0, 2 * Math.PI);
    //     //         ctx.fillStyle = 'purple';
    //     //         ctx.fill();
        
    //     //         // Hiển thị goal_id
    //     //         ctx.font = 'bold 10px Arial';
    //     //         ctx.fillStyle = 'purple';
    //     //         ctx.fillText(mission.goal_id.toString(), mx + 5, height - my - 5);
        
    //     //         // Vẽ mũi tên hướng yaw
    //     //         const length = 10; // độ dài mũi tên
    //     //         const yawRad = mission.yaw * Math.PI / 180;
    //     //         const arrowX = mx + length * Math.cos(-yawRad);  // -yaw để khớp canvas lật y
    //     //         const arrowY = (height - my) + length * Math.sin(-yawRad);
        
    //     //         ctx.beginPath();
    //     //         ctx.moveTo(mx, height - my);
    //     //         ctx.lineTo(arrowX, arrowY);
    //     //         ctx.strokeStyle = 'purple';
    //     //         ctx.lineWidth = 2;
    //     //         ctx.stroke();
        
    //     //         // Vẽ đầu mũi tên nhỏ
    //     //         ctx.beginPath();
    //     //         ctx.arc(arrowX, arrowY, 2, 0, 2 * Math.PI);
    //     //         ctx.fillStyle = 'purple';
    //     //         ctx.fill();
    //     //     });
    //     // }

    //     const x0 = (odomPosition.x - origin.x) / resolution;
    //     const y0 = (odomPosition.y - origin.y) / resolution;
        
    //     ctx.beginPath();
    //     ctx.arc(x0, height - y0, 2, 0, 2 * Math.PI);
    //     ctx.fillStyle = 'red';
    //     ctx.fill();
        
    //     const x = (position.x - origin.x) / resolution;
    //     const y = (position.y - origin.y) / resolution;

    //     drawEnhancedRobot(ctx, x, y, position.theta, width, height);

    //     ctx.restore();
    // }, [mapData, position, odomPosition, goalPosition, planData, missions, scale, offset]);

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
                twist.linear.x = 0.09;
                break;
            case 'turn-left':
                twist.linear.x = 0.05;
                twist.angular.z = 0.1;
                break;
            case 'turn-right':
                twist.linear.x = 0.05;
                twist.angular.z = -0.1;
                break;
            case 'left':
                twist.angular.z = 0.1;
                break;
            case 'right':
                twist.angular.z = -0.1;
                break;
            case 'rear':
                twist.linear.x = -0.09;
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

    const handleMissionClick = (id) => {
        const goal = missions.find(m => Number(m.goal_id) === Number(id));
        const { x, y, yaw } = goal;

        // Chuyển yaw (deg) sang quaternion
        const quaternion = new ROSLIB.Quaternion({
            x: 0,
            y: 0,
            z: Math.sin((yaw * Math.PI / 180) / 2),
            w: Math.cos((yaw * Math.PI / 180) / 2)
        });

        const now = Date.now(); // milliseconds since epoch
        const secs = Math.floor(now / 1000);
        const nsecs = (now % 1000) * 1e6;
    
        const msg = new ROSLIB.Message({
            header: {
                stamp: {
                    sec: secs,
                    nanosec: nsecs
                },
                frame_id: "map"
            },
            pose: {
                position: { x, y, z: 0 },
                orientation: quaternion
            }
        });

        if (GoalPosePublisher.current) {
            GoalPosePublisher.current.publish(msg);
            // console.log(msg)
            toast.success(`Published goal: ${goal.name || id}`, {
                style: {border: '1px solid green'}});
        } else {
            toast.error("Goal publisher is not ready", {
                style: {border: '1px solid red'}});
        }
    }

    const handleSave = () => {
        setShowRename(true);
    }
    //#endregion

    return (
        <div>
            <HeaderControl />
            <Menu />
            <div className='record-maps-container'>
                <div className="map-container">
                    {/* <canvas 
                        ref={canvasRef} 
                        onWheel={handleWheel}
                        style={{ 
                            border: '1px solid black', 
                            width: 'auto',
                            maxWidth: '800px',
                            height: '90%',
                            touchAction: 'none',
                        }}
                    /> */}
                    <ZoomableMapCanvas
                        mapData={mapData}
                        position={position}
                        odomPosition={odomPosition}
                        goalPosition={goalPosition}
                        planData={planData}
                        missions={missions}
                        setGoalPosition={setGoalPosition}
                    />
                </div>
                <div className={`control-button-panel ${!isROSConnected ? 'disabled' : ''}`}>
                    <div className="site-map-info">
                        <div>Site: <strong>{selectedSite?.name || 'N/A'}</strong></div>
                        <div>Map: <strong>{selectedMap?.name || 'N/A'}</strong></div>
                    </div>
                    <div className="joystick-container-missions">
                        <div className={`joystick-base`} ref={baseRef}>
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
                    <div className={`joystick-status-missions ${currentDirection ? 'active' : ''}`}>
                        <div>Direction: {currentDirection || 'Stopped'}</div>
                        <div>Power: {(joystickIntensity * 100).toFixed(0)}%</div>
                    </div>

                    <div className="missions-container">
                        <h1 className="missions-title">Missions</h1>

                        <div className="missions-description">
                            Select and move position
                        </div>

                        <div className="mission-selector">
                            {/* <input
                                type="text"
                                placeholder="Enter label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)} */}
                            {/* /> */}
                            <button
                                className="go-to-mission-btn"
                                onClick={() => {
                                        handleSave();
                                }}
                                // disabled={!selectedMissionId}
                            >
                                Save Label
                            </button>
                            <select
                                className="mission-select"
                                value={selectedMissionId}
                                onChange={(e) => setSelectedMissionId(e.target.value)}
                            >
                                <option value="">-- Select a label --</option>
                                {missions.map((mission) => (
                                    <option key={mission.goal_id} value={mission.goal_id}>
                                        {mission.goal_id}. {mission.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="go-to-mission-btn"
                                onClick={() => {
                                    if (selectedMissionId) {
                                        handleMissionClick(selectedMissionId);
                                    }
                                }}
                                disabled={!selectedMissionId}
                            >
                                Go to node
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showRename && (
                <Rename
                    title="Enter Position Name"
                    initialName=""
                    onCancel={() => setShowRename(false)}
                    onConfirm={handleRenameConfirm}
                />
            )}
        </div>
    )
}

export default Missions;
