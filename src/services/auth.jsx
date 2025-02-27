import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const removeToken = () => {
    localStorage.removeItem("token");
};

export const getUser = () => {
    const token = getToken();
    if (token) {
        try {
            return jwtDecode(token);
        } catch (error) {
            removeToken();
            return null;
        }
    }
    return null;
};

export const isAuthenticated = () => {
    const token = getToken();
    if (token) {
        const user = jwtDecode(token);
        // Kiểm tra token có hết hạn chưa
        const currentTime = Date.now() / 1000;
        return user.exp > currentTime;
    }
    return false;
};
