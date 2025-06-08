
import CompanyListItem from '../../molecules/CompanyListItem/CompanyListItem';
import Spinner from '../../molecules/Spinner/Spinner';
import EmptyState from '../EmptyState/EmptyState';

const CompanyList = ({ companies, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner size="lg" />
        <p className="ml-4 text-gray-600">Cargando empresas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <p className="font-semibold text-lg">Error al cargar empresas:</p>
        <p>{error.message || 'Ocurrió un error inesperado.'}</p>
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return <EmptyState message="No hay empresas registradas aún." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyListItem key={company.nit} company={company} />
      ))}
    </div>
  );
};

export default CompanyList;