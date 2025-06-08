// Importa la instancia de Axios configurada
import api from './api'; 

const API_AUTH_URL = '/api/v1/users/'; 

export const loginUser = async (email, password) => {
    try {
        const response = await api.post(`${API_AUTH_URL}login/`, { email, password }); // Usa `api` aquí
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const refreshToken = async (refresh) => {
    try {
        const response = await api.post(`${API_AUTH_URL}token/refresh/`, { refresh }); 
        return response.data;
    } catch (error) {
        throw error;
    }
};