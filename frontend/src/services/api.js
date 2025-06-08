import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Crea una instancia de Axios sin el token inicialmente
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variable para almacenar la función que dará el token.
// Se inicializará desde el AuthProvider.
let getAuthAccessToken = () => null;

// Variable para almacenar la función que refrescará el token
// Inicializada con una función que lanza un error si no se setea (para depuración)
let callRefreshAccessToken = () => Promise.reject(new Error("Refresh token function not set in API interceptor."));


// Función para setear la función que obtendrá el token
export const setAuthInterceptor = (getAccessTokenFn) => {
  getAuthAccessToken = getAccessTokenFn;
};

// Nueva función para setear la función que refrescará el token
export const setRefreshAuthInterceptor = (refreshAccessTokenFn) => {
  callRefreshAccessToken = refreshAccessTokenFn;
};

// Añade un interceptor de solicitud (sin cambios aquí)
api.interceptors.request.use(
  (config) => {
    const token = getAuthAccessToken(); // Obtiene el token usando la función proporcionada
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores de token (ej. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si la respuesta es 401, no es una solicitud de refresh token ya intentada
    // y tenemos un refresh token disponible (implícito por callRefreshAccessToken)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca la solicitud como reintentada
      try {
        // Llama a la función de refresco de token que fue inyectada desde AuthContext
        const newAccessToken = await callRefreshAccessToken();

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Re-envía la solicitud original con el nuevo token
        }
      } catch (refreshError) {
        console.error("Error al refrescar el token en interceptor, redirigiendo a login:", refreshError);        
        return Promise.reject(refreshError); // Propaga el error
      }
    }
    return Promise.reject(error);
  }
);

export default api;