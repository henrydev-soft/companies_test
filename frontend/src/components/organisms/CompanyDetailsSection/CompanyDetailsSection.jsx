
import Card from '../Card/Card';

const CompanyDetailsSection = ({ company }) => {
  if (!company) {
    return null;
  }

  return (
    <Card className="p-6 mb-8 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Información de la Empresa</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <p className="font-medium">NIT:</p>
          <p className="text-gray-900">{company.nit}</p>
        </div>
        <div>
          <p className="font-medium">Nombre:</p>
          <p className="text-gray-900">{company.name}</p>
        </div>
        <div>
          <p className="font-medium">Dirección:</p>
          <p className="text-gray-900">{company.address}</p>
        </div>
        <div>
          <p className="font-medium">Teléfono:</p>
          <p className="text-gray-900">{company.phone}</p>
        </div>
      </div>
    </Card>
  );
};

export default CompanyDetailsSection;