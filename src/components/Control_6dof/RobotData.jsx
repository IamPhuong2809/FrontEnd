import { createContext, useState, useContext, useEffect } from "react";
import { API_URL } from '@utils/config';

const RobotContext = createContext();

export const ReceiveRobotData = ({ children }) => {
    
    const [robotData, setRobotData] = useState({
        Power: false,
        S: false,
        I: true,
        AUX: false,
        busy: false,
        error: false,
        ee:false,
        abort:false,
        override: 0,
        tool: 0,
        work: 0,
        positionCurrent: { x:0, y:0, z:60, rl:0, pt:0, yw:0 },
        jointCurrent: {t1:0, t2:0, t3:0, t4:0, t5:0, t6:0}
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL + "I1001/"); // Gọi API
                const data = await response.json();
                setRobotData(data);
            } catch (error) {
                console.error("Error when receive data", error);
            }
        };

        const interval = setInterval(fetchData, 330); // Gọi API mỗi 330ms
        return () => clearInterval(interval); // Cleanup khi component unmount
    }, []);

    return (
        <RobotContext.Provider value={{robotData, setRobotData}}>
            {children}
        </RobotContext.Provider>
    );
};

export const useRobotData = () => useContext(RobotContext);
