import TableHeader from '../../atoms/TableHeader/TableHeader';
import Spinner from '../../atoms/Spinner/Spinner';
import TableRow from '../../molecules/TableRow/TableRow';
import EmptyState from '../../organisms/EmptyState/EmptyState'; // Reutiliza EmptyState

const CompanyTable = ({ companies, isLoading, error, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner size="lg" />
        <p className="ml-4 text-gray-600">Cargando mis empresas...</p>
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
    return <EmptyState message="No has registrado ninguna empresa aún." />;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <TableHeader>NIT</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Dirección</TableHeader>
            <TableHeader>Teléfono</TableHeader>
            <TableHeader className="text-center">Acciones</TableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <TableRow key={company.nit} company={company} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;