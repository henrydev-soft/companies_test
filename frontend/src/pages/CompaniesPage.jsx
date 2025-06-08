// src/pages/CompaniesPage.jsx
import{ useState, useEffect } from 'react';
import GeneralPageTemplate from '../templates/GeneralPageTemplate/GeneralPageTemplate';
import CompanyList from '../components/organisms/CompanyList/CompanyList';
import SectionTitle from '../components/organisms/SectionTitle/SectionTitle';
import { getCompanies } from '../services/companiesService'; // Importa el servicio

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const responseData  = await getCompanies();
        if (responseData && responseData.results && Array.isArray(responseData.results)) {
            setCompanies(responseData.results);
        } else if (Array.isArray(responseData)) {
            // Si la API devuelve un Array sin Paginación.
            setCompanies(responseData);
        } else {
            // Manejar un formato inesperado
            console.error("Formato de respuesta de empresas inesperado:", responseData);
            setError(new Error("Formato de datos de empresas inesperado."));
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching companies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  return (
    <GeneralPageTemplate title="Nuestras Empresas">
      <SectionTitle title="Explora las Empresas Registradas" />
      <CompanyList companies={companies} isLoading={isLoading} error={error} />
    </GeneralPageTemplate>
  );
};

export default CompaniesPage;