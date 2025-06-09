// Importa la instancia de Axios configurada
import api from './api';

const CURRENCIES_URL = '/api/v1/currencies/';

export const getCurrencies = async () => {
    try {
        const response = await api.get(CURRENCIES_URL);
        // Maneja paginación
        return response.data.results || response.data;
    } catch (error) {
        throw error;
    }
};