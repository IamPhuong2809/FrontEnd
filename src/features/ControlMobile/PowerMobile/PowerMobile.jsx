// import React, { useEffect, useRef } from 'react';
// import HeaderControl from "@components/Header/Header";
// import Menu from "@components/ControlMobile/Menu/Menu"

// const ControlMobile = () => {
//     // return (
//     //     <div>
//     //         <HeaderControl />
//     //         <Menu />
//     //     </div>
//     // )
//   const containerRef = useRef(null);
//   const rosRef = useRef(null);

//   useEffect(() => {
//     // Khởi tạo ROS WebSocket
//     rosRef.current = new window.ROSLIB.Ros({
//       url: 'ws://196.169.1.253:9090' 
//     });

//     rosRef.current.on('connection', () => {
//       console.log('[ROS] Connected');

//         try {
//             const viewer = new window.ROS2D.Viewer({
//                 divID: 'nav-map',
//                 width: 800,
//                 height: 600
//             });

//             new window.NAV2D.OccupancyGridClientNav({
//                 ros: rosRef.current,
//                 rootObject: viewer.scene,
//                 viewer: viewer,
//                 serverName: '/move_base',
//                 topic: '/map'
//             });
//         } catch (error) {
//             console.error('[NAV2D] Error:', error);
//         }
//     });

//     rosRef.current.on('error', (err) => {
//       console.error('[ROS] Error', err);
//     });

//     rosRef.current.on('close', () => {
//       console.log('[ROS] Closed');
//     });

//     return () => {
//       if (rosRef.current) rosRef.current.close();
//     };
//   }, []);

//   return (
//     <div>
//       <h3>Robot Map View</h3>
//       <div
//         id="nav-map"
//         ref={containerRef}
//         style={{
//           width: '800px',
//           height: '600px',
//           border: '1px solid black'
//         }}
//       />
//     </div>
//   );
// };

// export default ControlMobile;