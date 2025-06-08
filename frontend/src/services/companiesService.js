// Importa la instancia de Axios configurada
import api from './api'; 

const COMPANIES_PUBLIC_URL = '/api/v1/companies/';
const COMPANIES_URL = '/api/v1/my-companies/';

//Obtener listado publico de empresas
export const getCompanies = async () => {
    try {
        const response = await api.get(COMPANIES_PUBLIC_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Obtener empresas creadas por usuario
export const getMyCompanies = async () => {
    try {
        const response = await api.get(COMPANIES_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Crear Empresa
export const createCompany = async (companyData) => {
    try {
        const response = await api.post(COMPANIES_URL, companyData);
        return response.data;
    } catch (error) {
        // Muestra los detalles del error de la respuesta de Django si están disponibles
        if (error.response) {
            console.error("Error al crear empresa (respuesta del servidor):", error.response.data);
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
            throw new Error(JSON.stringify(error.response.data) || "Error desconocido al crear empresa.");
        } else if (error.request) {
            console.error("Error al crear empresa (no se recibió respuesta):", error.request);
            throw new Error("No se recibió respuesta del servidor.");
        } else {
            console.error("Error al crear empresa (configuración de la solicitud):", error.message);
            throw new Error("Error en la configuración de la solicitud.");
        }
    }
};

//Actualizar Empresa
export const updateCompany = async (nit, companyData) => {
    try {
        const response = await api.put(`${COMPANIES_URL}${nit}/`, companyData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Eliminar Empresa
export const deleteCompany = async (nit) => {
    try {
        const response = await api.delete(`${COMPANIES_URL}${nit}/`); // Asumiendo NIT es la PK
        return response.status === 204; // No Content en caso de éxito
    } catch (error) {
        throw error;
    }
};