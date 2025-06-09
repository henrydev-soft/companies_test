// src/pages/InventoryView/InventoryView.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Importa la nueva función para descargar el PDF
import { getCompanyByNit, downloadInventoryPdf, sendInventoryPdfByEmail  } from '../services/companiesService'; // <-- Añade downloadInventoryPdf
import { getProductsByCompanyNit } from '../services/productsService';
import { useAuth } from '../context/AuthContext';
import GeneralPageTemplate from '../templates/GeneralPageTemplate/GeneralPageTemplate';
import CompanyDetailsSection from '../components/organisms/CompanyDetailsSection/CompanyDetailsSection';
import ProductTable from '../components/organisms/ProductTable/ProductTable';
import Loader from '../components/atoms/Spinner/Spinner';
import Alert from '../components/molecules/AlertMessage/AlertMessage';
import IconButton from '../components/atoms/IconButton/IconButton';
import Modal from '../components/organisms/Modal/Modal';


const PdfIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
);

const EmailIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-17 0a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path>
    </svg>
);

const InventoryView = () => {
  const { companyNit } = useParams();
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailToSend, setEmailToSend] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const { user } = useAuth(); // <-- Esto es perfecto para la visibilidad

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const companyData = await getCompanyByNit(companyNit);
        setCompany(companyData);
        const productsData = await getProductsByCompanyNit(companyNit);
        setProducts(productsData.results || []);
      } catch (err) {
        console.error("Error fetching inventory data:", err);
        setError("Error al cargar los datos del inventario. Por favor, verifica el NIT o intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    if (companyNit) {
      fetchInventoryData();
    }
  }, [companyNit]);

  // --- Función para descargar el PDF (ahora simplificada) ---
  const handleDownloadPdf = async () => {
    if (!companyNit) {
      alert("NIT de la empresa no disponible.");
      return;
    }

    // user de useAuth ya valida si hay sesión iniciada
    if (!user) {
        alert("Necesitas iniciar sesión para descargar el PDF.");
        return;
    }

    try {
        // Llama a la nueva función de tu servicio
        const pdfBlob = await downloadInventoryPdf(companyNit); 

        // Procede con la descarga del blob
        const url = window.URL.createObjectURL(pdfBlob); 
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventario_${company ? company.name.replace(/\s+/g, '_') : companyNit}.pdf`; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        alert("PDF generado y descargado exitosamente.");

    } catch (err) {
        console.error("Error descargando PDF:", err);
        alert(err.message || "No se pudo descargar el PDF. Inténtalo de nuevo.");
    }
  };

  // --- Funciones para el envío de correo ---
  const handleSendEmailClick = () => {
    if (!user) {
      alert("Necesitas iniciar sesión para enviar el PDF por correo.");
      return;
    }
    setIsEmailModalOpen(true);
    setEmailToSend(''); // Limpia el campo cada vez que se abre
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSendingEmail(true);

    if (!companyNit) {
      alert("NIT de la empresa no disponible para enviar el PDF.");
      setIsSendingEmail(false);
      return;
    }
    if (!emailToSend || !/\S+@\S+\.\S+/.test(emailToSend)) { // Validación básica de email
      alert("Por favor, ingresa un correo electrónico válido.");
      setIsSendingEmail(false);
      return;
    }

    try {
      await sendInventoryPdfByEmail(companyNit, emailToSend);
      alert(`PDF enviado exitosamente a ${emailToSend}.`);
      setIsEmailModalOpen(false); // Cierra el modal
    } catch (err) {
      console.error("Error enviando PDF por correo:", err);
      alert(err.message || "No se pudo enviar el PDF por correo. Inténtalo de nuevo.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Estado de Carga
  if (loading) {
    return (
      <GeneralPageTemplate title="Cargando Inventario...">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader />
          <p className="mt-4 text-lg text-gray-700">Cargando inventario...</p>
        </div>
      </GeneralPageTemplate>
    );
  }

  // Estado de Error
  if (error) {
    return (
      <GeneralPageTemplate title="Error de Inventario">
        <div className="flex flex-col items-center justify-center py-16">
          <Alert type="error" message={error} />
        </div>
      </GeneralPageTemplate>
    );
  }

  // Estado de "Empresa no encontrada"
  if (!company) {
    return (
      <GeneralPageTemplate title="Inventario no encontrado">
        <div className="flex flex-col items-center justify-center py-16">
          <Alert type="info" message={`No se encontró información para la empresa con NIT: ${companyNit}`} />
        </div>
      </GeneralPageTemplate>
    );
  }

  // Estado de éxito (datos cargados)
  return (
    <GeneralPageTemplate title={`Inventario de ${company.name}`}>
      {/* Contenedor flexbox para CompanyDetailsSection y el botón de PDF */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Sección de detalles de la empresa (ocupa la mayor parte del espacio) */}
        <div className="flex-grow">
          <CompanyDetailsSection company={company} />
        </div>

        {/* Botón de Descarga PDF */}
        {user && (
          <div className="flex flex-col gap-2 flex-shrink-0 mt-4 md:mt-0"> {/* flex-col para apilar verticalmente los botones */}
            <IconButton
              onClick={handleDownloadPdf}
              title="Descargar Inventario (PDF)"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md flex items-center justify-center w-full text-base"
            >
              <PdfIcon />
              <span className="ml-2">Descargar PDF</span>
            </IconButton>

                {/* Nuevo botón para enviar por correo */}
            <IconButton
              onClick={handleSendEmailClick}
              title="Enviar Inventario por Correo"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md flex items-center justify-center w-full text-base"
            >
              <EmailIcon />
              <span className="ml-2">Enviar por Correo</span>
            </IconButton>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Productos Asociados</h2>
        <ProductTable 
          products={products} 
          isLoading={false} 
          error={null}
          showActions={false}
        />
      </div>
      
      <Modal
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            title="Enviar Inventario por Correo"
        >
            <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Correo del destinatario:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={emailToSend}
                        onChange={(e) => setEmailToSend(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="ejemplo@dominio.com"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsEmailModalOpen(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                        disabled={isSendingEmail}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={isSendingEmail}
                    >
                        {isSendingEmail ? 'Enviando...' : 'Enviar Correo'}
                    </button>
                </div>
            </form>
        </Modal>

    </GeneralPageTemplate>
  );
};

export default InventoryView;