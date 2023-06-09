import axios from "src/api/axios";
import { API_URL } from "src/config";
import { Auth, AuthState, Credentials } from "src/models/auth";

const AUTH_API_URL = `${API_URL}/auth`;

async function login(credentials: Credentials): Promise<any> {
    try {
        const { data: response } = await axios.post(`${AUTH_API_URL}/login`, credentials);
        if (response) {
            localStorage.setItem("authToken", response.token);
            return response;
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
        return;
    }
}

async function register(credentials: Credentials): Promise<boolean> {
    try {
        const response = await axios.post(`${AUTH_API_URL}/signup`, credentials);
        if (response.status === 201) return true;
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function checkLog(): Promise<Auth> {
    try {
        
        const { data: user } = await axios.get(`${AUTH_API_URL}/checkLog`);
        return {
            state: AuthState.Logged,
            user,
        };
    } catch (error) {
        return {
            state: AuthState.Disconnected,
        };
    }
}

export const ApiAuth = {
    login,
    register,
    checkLog,
}
