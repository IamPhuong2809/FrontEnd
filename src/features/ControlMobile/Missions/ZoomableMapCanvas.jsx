import React, { useRef, useEffect, useState, useCallback } from 'react';

const ZoomableMapCanvas = ({ mapData, position, odomPosition, goalPosition, planData, missions, setGoalPosition, scanData }) => {
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        const zoomFactor = 1.1;
        let newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
        
        newScale = Math.max(0.2, Math.min(newScale, 10));
    
        if (newScale === scale) return;
    
        // Chỉ tính toán offset khi scale thực sự thay đổi
        const worldX = (mouseX - offset.x) / scale;
        const worldY = (mouseY - offset.y) / scale;
    
        const newOffset = {
            x: mouseX - worldX * newScale,
            y: mouseY - worldY * newScale,
        };
    
        setScale(newScale);
        setOffset(newOffset);
    }, [scale, offset]);

        // Thêm event listener một cách thủ công
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const options = { passive: false };
        canvas.addEventListener('wheel', handleWheel, options);

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        let panMultiplier = 3;
        const dx = (e.clientX - lastMousePos.x) * panMultiplier;
        const dy = (e.clientY - lastMousePos.y) * panMultiplier;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (!mapData) return;
        console.log(position)

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = mapData.info.width;
        const height = mapData.info.height;
        const data = mapData.data;

        canvas.width = width;
        canvas.height = height;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(offset.x, offset.y); // pan
        ctx.scale(scale, scale);           // zoom

        ctx.fillStyle = 'rgb(127,127,127)';
        ctx.fillRect(-offset.x / scale, -offset.y / scale, canvas.width / scale, canvas.height / scale);

        const imageData = ctx.createImageData(width, height);
        for (let i = 0; i < data.length; i++) {
            let val = data[i];
            let color = val === -1 ? 127 : val === 0 ? 255 : 0;
            imageData.data[i * 4 + 0] = color;
            imageData.data[i * 4 + 1] = color;
            imageData.data[i * 4 + 2] = color;
            imageData.data[i * 4 + 3] = 255;
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.translate(0, height);
        ctx.scale(1, -1);

        const resolution = mapData.info.resolution;
        const origin = mapData.info.origin.position;

        //#region goalpose
        if (goalPosition) {
            const dx = position.x - goalPosition.position.x;
            const dy = position.y - goalPosition.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0.15) {
                const q = goalPosition.orientation;
                const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
                const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
                const yaw = Math.atan2(siny_cosp, cosy_cosp);

                const goalX = (goalPosition.position.x - origin.x) / resolution;
                const goalY = (goalPosition.position.y - origin.y) / resolution;

                const arrowLength = 3;
                const arrowWidth = 5;   // Độ rộng mũi tên

                ctx.save();
                ctx.translate(goalX, height - goalY);
                ctx.rotate(-yaw); // Quay theo hướng yaw
                
                
                ctx.beginPath();
                ctx.moveTo(arrowLength, 0);
                ctx.lineTo(arrowLength - arrowWidth, -arrowWidth/2);
                ctx.lineTo(arrowLength - arrowWidth/2, 0);
                ctx.lineTo(arrowLength - arrowWidth, arrowWidth/2);
                ctx.closePath();
                
                const arrowGradient = ctx.createLinearGradient(
                    arrowLength - arrowWidth, 0, 
                    arrowLength, 0
                );
                arrowGradient.addColorStop(0, '#00ff00'); // Xanh lá nhạt
                arrowGradient.addColorStop(1, '#009900'); // Xanh lá đậm
                
                ctx.fillStyle = arrowGradient;
                ctx.fill();
                ctx.strokeStyle = '#006600';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.restore();

                if (planData?.poses) {
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
            } else {
                setGoalPosition(null);
            }
        }
        //#endregion

        if (missions && missions.length > 0) {
            missions.forEach((mission) => {
                const mx = (mission.x - origin.x) / resolution;
                const my = (mission.y - origin.y) / resolution;
        
                ctx.save();
                
                ctx.translate(mx, height - my);
                
                const yawRad = mission.yaw * Math.PI / 180;
                ctx.rotate(-yawRad);
        
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, 2 * Math.PI);
                
                const pointGradient = ctx.createRadialGradient(-1, -1, 0, 0, 0, 3);
                pointGradient.addColorStop(0, '#cc00ff'); // Tím nhạt
                pointGradient.addColorStop(1, '#9900cc'); // Tím đậm
                
                // Vẽ mũi tên chỉ hướng (màu tím)
                const arrowLength = 3;
                const arrowWidth = 5;
                
                ctx.beginPath();
                ctx.moveTo(arrowLength, 0);
                ctx.lineTo(arrowLength - arrowWidth, -arrowWidth/2);
                ctx.lineTo(arrowLength - arrowWidth/2, 0);
                ctx.lineTo(arrowLength - arrowWidth, arrowWidth/2);
                ctx.closePath();
                
                // Gradient cho mũi tên
                const arrowGradient = ctx.createLinearGradient(
                    arrowLength - arrowWidth, 0, 
                    arrowLength, 0
                );
                arrowGradient.addColorStop(0, '#cc00ff'); // Tím nhạt
                arrowGradient.addColorStop(1, '#9900cc'); // Tím đậm
                
                ctx.fillStyle = arrowGradient;
                ctx.fill();
                ctx.strokeStyle = '#660099';
                ctx.lineWidth = 1;
                ctx.stroke();
        
                ctx.restore();
        
                ctx.save(); // Lưu trạng thái hiện tại
                ctx.translate(0, canvas.height); // Di chuyển gốc tọa độ xuống dưới
                ctx.scale(1, -1); // Flip trục Y
                
                ctx.font = 'bold 10px Arial';
                ctx.fillStyle = 'purple';
                ctx.fillText(mission.goal_id.toString(), mx + 5, my + 5);
                
                ctx.restore(); // Khôi phục trạng thái
            });
        }
        
        // const x0 = (odomPosition.x - origin.x) / resolution;
        // const y0 = (odomPosition.y - origin.y) / resolution;
        // ctx.beginPath();
        // ctx.arc(x0, height - y0, 2, 0, 2 * Math.PI);
        // ctx.fillStyle = 'red';
        // ctx.fill();

        const x = (position.x - origin.x) / resolution;
        const y = (position.y - origin.y) / resolution;

        drawEnhancedRobot(ctx, x, y, position.theta, width, height);

        ctx.restore();
    }, [mapData, position, odomPosition, goalPosition, planData, missions, offset, scale]);

    const drawEnhancedRobot = (ctx, x, y, theta, width, height) => {
        ctx.save();
        
        // Di chuyển context đến vị trí robot
        ctx.translate(x, height - y);
        ctx.rotate(-theta * Math.PI / 180); // Rotate theo hướng robot
        
        // Vẽ bánh xe
        const wheelLength = 4;
        const wheelWidth = 2;
        const robotSize = 5; // Kích thước robot
        
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

    return (
        <canvas
            ref={canvasRef}
            // onWheelCapture={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
                border: '1px solid black',
                width: 'auto',
                maxWidth: '800px',
                height: '90%',
                touchAction: 'none',
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
        />
    );
};

export default ZoomableMapCanvas;
