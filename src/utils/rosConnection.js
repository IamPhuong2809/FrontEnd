// rosConnection.js
import ROSLIB from 'roslib';
import toast from 'react-hot-toast';

export const initializeROSConnection = (callbacks) => {
  const ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090', // đổi nếu ROS chạy trên máy khác
  });

  ros.on('connection', () => {
    console.log('Connected to rosbridge');
    callbacks.setIsROSConnected(true);
    toast.success("Successfully connect ros!", {
      style: { border: '1px solid green' }
    });
  });

  ros.on('error', (error) => {
    console.error('Error connecting to rosbridge:', error);
    callbacks.setIsROSConnected(false);
    toast.error("Failed to connect ros!", {
      style: { border: '1px solid red' }
    });
  });

  ros.on('close', () => {
    console.log('Connection to rosbridge closed');
  });

  // Khởi tạo các Topic và Service
  const mapTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/map',
    messageType: 'nav_msgs/msg/OccupancyGrid',
  });

  const odomPoseTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/odom_pose',
    messageType: 'geometry_msgs/msg/PoseStamped',
  });

  const robotPoseTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/robot_pose',
    messageType: 'geometry_msgs/msg/Pose2D',
  });

  const goalPoseTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/goal_pose',
    messageType: 'geometry_msgs/msg/PoseStamped',
  });

  const planTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/plan',
    messageType: 'nav_msgs/msg/Path',
  });

  const cmdVelPublisher = new ROSLIB.Topic({
    ros: ros,
    name: '/diff_cont/cmd_vel_unstamped',
    messageType: 'geometry_msgs/msg/Twist',
  });

  // Các Service
  const setMappingMode = new ROSLIB.Service({
    ros: ros,
    name: '/rtabmap/set_mode_mapping',
    serviceType: 'std_srvs/Empty'
  });

  const pauseService = new ROSLIB.Service({
    ros: ros,
    name: '/rtabmap/pause',
    serviceType: 'std_srvs/Empty'
  });

  const resumeService = new ROSLIB.Service({
    ros: ros,
    name: '/rtabmap/resume',
    serviceType: 'std_srvs/Empty'
  });

  const resetService = new ROSLIB.Service({
    ros: ros,
    name: '/rtabmap/reset',
    serviceType: 'std_srvs/Empty'
  });

  const backupService = new ROSLIB.Service({
    ros: ros,
    name: '/rtabmap/backup',
    serviceType: 'std_srvs/Empty'
  });

  const setLocalizationMode = new ROSLIB.Service({
    ros: ros,
    name: '/rtabmap/set_mode_localization',
    serviceType: 'std_srvs/Empty'
  });

  return {
    ros,
    topics: {
      mapTopic,
      odomPoseTopic,
      robotPoseTopic,
      goalPoseTopic,
      planTopic,
      cmdVelPublisher
    },
    services: {
      setMappingMode,
      pauseService,
      resumeService,
      resetService,
      backupService,
      setLocalizationMode
    }
  };
};