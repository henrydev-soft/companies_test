// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser as apiLoginUser, refreshToken as apiRefreshToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { setAuthInterceptor, setRefreshAuthInterceptor } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null); // {access: ..., refresh: ...}
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // 1. Define logout PRIMERO, ya que otras funciones dependen de ella.
    const logout = useCallback(() => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        setAuthInterceptor(() => null); // Limpia el token del interceptor al cerrar sesión
        // Limpia también la de refresh, importante para evitar llamadas a funciones no definidas
        setRefreshAuthInterceptor(() => Promise.reject(new Error("Refresh token function not set.")));
        navigate('/login');
    }, [navigate]); // navigate es la única dependencia real aquí

    // Función que api.js usará para obtener el token de acceso actual (sin cambios)
    const getAccessToken = useCallback(() => {
        return authToken?.access;
    }, [authToken]);

    // 2. Ahora define refreshAccessToken, que puede llamar a logout.
    const refreshAccessToken = useCallback(async () => {
        if (authToken && authToken.refresh) {
            try {
                const data = await apiRefreshToken(authToken.refresh);
                setAuthToken(prevTokens => ({ ...prevTokens, access: data.access }));
                localStorage.setItem('authToken', JSON.stringify({ ...authToken, access: data.access }));
                setAuthInterceptor(() => data.access); // Actualiza el interceptor con el nuevo token
                return data.access;
            } catch (error) {
                console.error("Failed to refresh token in AuthContext:", error);
                logout(); // Aquí 'logout' ya está definido
                throw error;
            }
        }
        logout(); // Aquí 'logout' ya está definido
        throw new Error("No refresh token available to refresh.");
    }, [authToken, logout]); // 'logout' es una dependencia para useCallback

    // 3. Define login, que puede usar refreshAccessToken (que a su vez usa logout).
    const login = useCallback(async (email, password) => {
        try {
            const data = await apiLoginUser(email, password);
            setAuthToken(data);
            setUser({ email: email });
            localStorage.setItem('authToken', JSON.stringify(data));
            setAuthInterceptor(() => data.access);
            // Asegúrate de que el interceptor de refresh siempre use la función refreshAccessToken actual.
            // Para evitar ciclos de dependencia, es mejor pasarla directamente o no regenerar si es la misma.
            // Una forma simple es que se configure en el useEffect inicial.
            // setRefreshAuthInterceptor(refreshAccessToken); // Esto podría causar un ciclo si refreshAccessToken tiene 'login' como dependencia
            return data;
        } catch (error) {
            console.error("Login context error:", error);
            throw error;
        }
    }, []); // Dependencias: no depende directamente de refreshAccessToken para su propia definición inicial.

    // Establece los interceptores de Axios una vez al inicio
    useEffect(() => {
        setAuthInterceptor(getAccessToken);
        setRefreshAuthInterceptor(refreshAccessToken); // Ambas funciones deben estar definidas aquí
    }, [getAccessToken, refreshAccessToken]);


    // Cargar tokens al inicio (sin cambios aquí)
    useEffect(() => {
        const loadTokens = () => {
            const storedTokens = localStorage.getItem('authToken');
            if (storedTokens) {
                const tokens = JSON.parse(storedTokens);
                setAuthToken(tokens);
                setUser({ email: "usuario@ejemplo.com" });
            }
            setLoading(false);
        };
        loadTokens();
    }, []);

    const value = {
        user,
        authToken,
        loading,
        login,
        logout,
        refreshAccessToken
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div>Cargando autenticación...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};