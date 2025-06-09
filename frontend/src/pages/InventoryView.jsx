// src/pages/InventoryView/InventoryView.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyByNit } from '../services/companiesService';
import { getProductsByCompanyNit } from '../services/productsService';
import GeneralPageTemplate from '../templates/GeneralPageTemplate/GeneralPageTemplate'; // Importa el template
import CompanyDetailsSection from '../components/organisms/CompanyDetailsSection/CompanyDetailsSection';
import ProductTable from '../components/organisms/ProductTable/ProductTable';
import Loader from '../components/atoms/Spinner/Spinner'; // Asumiendo Spinner es tu Loader
import Alert from '../components/molecules/AlertMessage/AlertMessage';

const InventoryView = () => {
  const { companyNit } = useParams();
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Estado de Carga
  if (loading) {
    return (
      <GeneralPageTemplate title="Cargando Inventario..."> {/* Pasamos el título al template */}
        {/* El contenido de carga se centra dentro del área de contenido del template */}
        <div className="flex flex-col items-center justify-center py-16"> {/* Usamos py-16 para espacio, no h-screen */}
          <Loader />
          <p className="mt-4 text-lg text-gray-700">Cargando inventario...</p>
        </div>
      </GeneralPageTemplate>
    );
  }

  // Estado de Error
  if (error) {
    return (
      <GeneralPageTemplate title="Error de Inventario"> {/* Pasamos el título al template */}
        {/* El mensaje de error se muestra dentro del área de contenido del template */}
        <div className="flex flex-col items-center justify-center py-16">
          <Alert type="error" message={error} />
        </div>
      </GeneralPageTemplate>
    );
  }

  // Estado de "Empresa no encontrada"
  if (!company) {
    return (
      <GeneralPageTemplate title="Inventario no encontrado"> {/* Pasamos el título al template */}
        {/* El mensaje de información se muestra dentro del área de contenido del template */}
        <div className="flex flex-col items-center justify-center py-16">
          <Alert type="info" message={`No se encontró información para la empresa con NIT: ${companyNit}`} />
        </div>
      </GeneralPageTemplate>
    );
  }

  // Estado de éxito (datos cargados)
  return (
    <GeneralPageTemplate title={`Inventario de ${company.name}`}> {/* Pasamos el título al template */}
      {/* El h1 de la página ya no es necesario aquí si lo maneja el template */}
      {/* <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Inventario de {company.name}</h1> */}

      <CompanyDetailsSection company={company} />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Productos Asociados</h2>
        <ProductTable 
          products={products} 
          isLoading={false} 
          error={null}     
          showActions={false}
        />
      </div>
    </GeneralPageTemplate>
  );
};

export default InventoryView;