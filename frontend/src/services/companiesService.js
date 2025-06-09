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

export const getCompanyByNit = async (nit) => {
  try {
    const response = await api.get(`${COMPANIES_PUBLIC_URL}${nit}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching company with NIT ${nit}:`, error);
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

// Nueva función para descargar el PDF del inventario
export const downloadInventoryPdf = async (companyNit) => {
    try {
        // La instancia 'api' de Axios ya debería manejar la adición del token de autenticación
        // gracias a tus interceptores configurados en AuthContext y api.js.
        const response = await api.get(`${COMPANIES_PUBLIC_URL}${companyNit}/pdf/`, {
            responseType: 'blob', // MUY IMPORTANTE: Indicar a Axios que esperamos un blob (archivo)
        });
        return response.data; // Retorna el blob de datos del PDF
    } catch (error) {
        // Axios errores ya vienen con la respuesta del servidor en error.response
        if (error.response) {
            // Intentar leer el mensaje de error del backend si no es un blob
            const contentType = error.response.headers['content-type'];
            if (contentType && contentType.includes("application/json")) {
                const errorData = await new Response(error.response.data).json(); // Convertir blob de error a JSON
                throw new Error(errorData.detail || errorData.error || `Error ${error.response.status}: Error del servidor.`);
            } else {
                 throw new Error(`Error ${error.response.status}: La solicitud falló. ` + (error.response.status === 401 ? 'No autorizado.' : ''));
            }
        } else if (error.request) {
            throw new Error("No se recibió respuesta del servidor. Verifica tu conexión.");
        } else {
            throw new Error("Error en la configuración de la solicitud: " + error.message);
        }
    }
};

// Nueva función para enviar el PDF del inventario por correo
export const sendInventoryPdfByEmail = async (companyNit, emailTo) => {
    try {
        const response = await api.post(`${COMPANIES_PUBLIC_URL}${companyNit}/send_pdf_email/`, {
            email_to: emailTo,
        });
        return response.data; // Devuelve el mensaje de éxito del backend
    } catch (error) {
        if (error.response) {
            // Intentar leer el mensaje de error del backend
            throw new Error(error.response.data.detail || error.response.data.error || `Error ${error.response.status}: Error al enviar el correo.`);
        } else if (error.request) {
            throw new Error("No se recibió respuesta del servidor al intentar enviar el correo.");
        } else {
            throw new Error("Error en la configuración de la solicitud para enviar el correo: " + error.message);
        }
    }
};