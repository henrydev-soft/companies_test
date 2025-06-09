// Importa la instancia de Axios configurada
import api from './api';

const PRODUCTS_URL = '/api/v1/products/';

export const getMyProducts = async () => {
    try {
        const response = await api.get(`${PRODUCTS_URL}my_products/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProductsByCompanyNit = async (companyNit) => {
  try {
    const response = await api.get(`${PRODUCTS_URL}?company__nit=${companyNit}`);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching products for company NIT ${companyNit}:`, error);
    throw error;
  }
};

export const createProduct = async (productData) => {
    try {
        const response = await api.post(PRODUCTS_URL, productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (code, productData) => {
    try {
        const response = await api.put(`${PRODUCTS_URL}${code}/`, productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (code) => {
    try {
        const response = await api.delete(`${PRODUCTS_URL}${code}/`);
        return response.status === 204;
    } catch (error) {
        throw error;
    }
};


// Nueva función para generar el post de publicidad
export const generateProductAd = async (productCode) => {
    try {
        const response = await api.post(`${PRODUCTS_URL}${productCode}/generate_post/`);
        return response.data; // Esperamos { "generated_ad": "..." }
    } catch (error) {
        if (error.response) {
            // El backend puede enviar un mensaje de error específico
            throw new Error(error.response.data.detail || error.response.data.error || `Error ${error.response.status}: No se pudo generar la publicidad.`);
        } else if (error.request) {
            throw new Error("No se recibió respuesta del servidor al intentar generar la publicidad.");
        } else {
            throw new Error("Error en la configuración de la solicitud para generar la publicidad: " + error.message);
        }
    }
};