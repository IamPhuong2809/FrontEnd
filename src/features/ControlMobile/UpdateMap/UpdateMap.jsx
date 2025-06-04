import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import ROSLIB from 'roslib';
import toast from 'react-hot-toast';
import HeaderControl from "@components/Header/Header";
import Menu from "@components/ControlMobile/Menu/Menu"
import { useMapContext } from '@components/ControlMobile/MapContext';
import './UpdateMap.css'

const UpdateMap = () => {
    const { selectedMap, selectedSite, updateSelection } = useMapContext(); 
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

    const tools = [
        { id: 'select', name: 'Select', icon: '🎯', description: 'Select objects' },
        { id: 'position', name: 'Positions', icon: '📍', description: 'Add robot positions' },
        { id: 'marker', name: 'Markers', icon: '🚩', description: 'Add waypoint markers' },
        { id: 'wall', name: 'Walls', icon: '🧱', description: 'Mark wall areas' },
        { id: 'floor', name: 'Floors', icon: '⬜', description: 'Define floor areas' },
        { id: 'preferred', name: 'Preferred Areas', icon: '💚', description: 'Preferred navigation areas' },
        { id: 'forbidden', name: 'Forbidden Areas', icon: '🚫', description: 'No-go zones' },
        { id: 'critical', name: 'Critical Areas', icon: '⚠️', description: 'Critical zones' },
        { id: 'speed', name: 'Speed Restrictions', icon: '🐌', description: 'Speed limit zones' },
        { id: 'blink', name: 'Blink Restrictions', icon: '⚡', description: 'Blinking light zones' }
    ];

    const areaTypes = [
        { id: 'beep', name: 'Beep Restrictions', color: '#00ff00' },
        { id: 'disable', name: 'Disable Localization', color: '#ff9800' },
        { id: 'lockahead', name: 'Lock-ahead Restrictions', color: '#ff5722' },
        { id: 'bluetooth', name: 'Bluetooth Areas', color: '#9c27b0' },
        { id: 'fleet', name: 'Fleet Area Lock', color: '#607d8b' }
    ];

    const [positions, setPositions] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedTool, setSelectedTool] = useState([]);

        useEffect(() => {
        if (!selectedMap || !selectedSite) {
            toast.error('Please select a site and map first!', {
                style: {border: '1px solid red'}
            });
            navigate('/ControlMobile/Maps');
            return;
        }

        //#region connect
        const ros = new ROSLIB.Ros({
            url: 'ws://localhost:9090', // đổi nếu ROS chạy trên máy khác
        });

        ros.on('connection', () => {
            console.log('Connected to rosbridge');
            setIsROSConnected(true); 
            toast.success("Successfully connect, you can modify map now!", {
                style: {border: '1px solid green'}});
        });

        ros.on('error', (error) => {
            console.error('Error connecting to rosbridge:', error);
            setIsROSConnected(false);
            toast.error("Failed to connect ros!", {
                style: {border: '1px solid red'}});
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
            name: '/diff_cont/cmd_vel_unstamped',
            messageType: 'geometry_msgs/msg/Twist',
        });

        //#endregion
        
        // //#region Service
        // //Start Mapping
        // const setMappingMode = new ROSLIB.Service({
        //     ros: ros,
        //     name: '/rtabmap/set_mode_mapping',
        //     serviceType: 'std_srvs/Empty'
        // });

        // startMappingRef.current = () => {
        //     const request = new ROSLIB.ServiceRequest({});
        //     setMappingMode.callService(request, (result) => {
        //         console.log('Bắt đầu ghi bản đồ!', result);
        //     });
        // };

        // // Service Pause
        // const pauseService = new ROSLIB.Service({
        //     ros: ros,
        //     name: '/rtabmap/pause',
        //     serviceType: 'std_srvs/Empty'
        // });

        // pauseMappingRef.current = () => {
        //     const request = new ROSLIB.ServiceRequest({});
        //     pauseService.callService(request, (result) => {
        //         console.log('Tạm dừng mapping!', result);
        //     });
        // };

        // // Service Resume
        // const resumeService = new ROSLIB.Service({
        //     ros: ros,
        //     name: '/rtabmap/resume',
        //     serviceType: 'std_srvs/Empty'
        // });

        // resumeMappingRef.current = () => {
        //     const request = new ROSLIB.ServiceRequest({});
        //     resumeService.callService(request, (result) => {
        //         console.log('Tiếp tục mapping!', result);
        //     });
        // };

        // // Service Reset
        // const resetService = new ROSLIB.Service({
        //     ros: ros,
        //     name: '/rtabmap/reset',
        //     serviceType: 'std_srvs/Empty'
        // });

        // resetMappingRef.current = () => {
        //     const request = new ROSLIB.ServiceRequest({});
        //     resetService.callService(request, (result) => {
        //         console.log('Reset bản đồ thành công!', result);
        //     });
        // };

        // //Backup service
        // const backupService = new ROSLIB.Service({
        //     ros: ros,
        //     name: '/rtabmap/backup',
        //     serviceType: 'std_srvs/Empty'
        // });

        // backupMapRef.current = (filePath) => {
        //     const request = new ROSLIB.ServiceRequest({});
        //     backupService.callService(request, (result) => {
        //         console.log('Bản đồ đã được lưu tại:', filePath);
        //     });
        // };

        // //const changetype
        // const setLocalizationMode = new ROSLIB.Service({
        //     ros: ros,
        //     name: '/rtabmap/set_mode_localization',
        //     serviceType: 'std_srvs/Empty'
        // });

        // startLocalizationRef.current = () => {
        //     const request = new ROSLIB.ServiceRequest({});
        //     setLocalizationMode.callService(request, (result) => {
        //         console.log('Set mode localization success!');
        //     });
        // };
        // //#endregion

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
    const handleToolSelect = (toolId) => {
        if (selectedTool) {
            setSelectedTool(toolId);
        }
    };

    const handleSaveAnnotations = () => {
        console.log('Saving annotations...', { positions, markers, areas });
        // Implement save logic here
    };

    const handleExportMap = () => {
        console.log('Exporting map...');
        // Implement export logic here
    };

    const handleClearAll = () => {
        setPositions([]);
        setMarkers([]);
        setAreas([]);
        if (selectedTool) {
            setSelectedTool([]);
        }
    };

    const handleBack = () => {
        console.log('Going back to maps...');
        // Implement navigation logic here
    };

    const getSelectedToolInfo = () => {
        const tool = tools.find(t => t.id === selectedTool);
        const area = areaTypes.find(a => a.id === selectedTool);
        return tool || area;
    };
    //#endregion

    return (
        <div>
            <HeaderControl />
            <Menu />
            <div className='position-marker-container'>
                <div className="map-container">
                    <canvas 
                        ref={canvasRef} 
                        style={{ 
                            border: '1px solid black', 
                            width: '600px', 
                            height: 'auto' 
                        }}
                    />
                </div>
                <div className="control-button-panel">
                    <div className="site-map-info">
                        <div>Site: <strong>{selectedSite?.name || 'N/A'}</strong></div>
                        <div>Map: <strong>{selectedMap?.name || 'N/A'}</strong></div>
                    </div>
                    <div className="section">
                        <h3 className="section-title">Tools</h3>
                        <div className="tools-grid">
                            {tools.slice(0, 4).map((tool) => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleToolSelect(tool.id)}
                                    className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
                                >
                                <div className="tool-icon">{tool.icon}</div>
                                <div className="tool-name">{tool.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Area Types */}
                    <div className="section">
                        <h3 className="section-title">Area Types</h3>
                        <div className="area-types">
                        {tools.slice(4).map((tool) => (
                            <button
                            key={tool.id}
                            onClick={() => handleToolSelect(tool.id)}
                            className={`area-button ${selectedTool === tool.id ? 'active' : ''}`}
                            >
                            <div className="area-content">
                                <span className="area-icon">{tool.icon}</span>
                                <div className="area-info">
                                <div className="area-name">{tool.name}</div>
                                <div className="area-description">{tool.description}</div>
                                </div>
                            </div>
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* Special Areas */}
                    <div className="section">
                        <h3 className="section-title">Special Areas</h3>
                        <div className="special-areas">
                        {areaTypes.map((area) => (
                            <button
                            key={area.id}
                            onClick={() => handleToolSelect(area.id)}
                            className={`special-area-button ${selectedTool === area.id ? 'active' : ''}`}
                            >
                            <div className="special-area-content">
                                <div 
                                className="color-indicator"
                                style={{ backgroundColor: area.color }}
                                ></div>
                                <span className="special-area-name">{area.name}</span>
                            </div>
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* Object List */}
                    <div className="section">
                        <h3 className="section-title">Current Selection</h3>
                        <div className="object-list">
                        {selectedTool.length > 0 ? (
                            <div className="selection-info">
                            <div className="selected-tool">Selected: {getSelectedToolInfo()?.name}</div>
                            <div className="instruction">Click on the map to add {selectedTool}</div>
                            </div>
                        ) : (
                            <div className="no-selection">
                            Select a tool to start annotating
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="action-btn save-btn" onClick={handleSaveAnnotations}>
                        Save Annotations
                        </button>
                        <button className="action-btn export-btn" onClick={handleExportMap}>
                        Export Map
                        </button>
                        <button className="action-btn clear-btn" onClick={handleClearAll}>
                        Clear All
                        </button>
                        <button className="action-btn back-btn" onClick={handleBack}>
                        Back to Maps
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateMap;