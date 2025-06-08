
const CompanyListItem = ({ company }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-xl font-semibold text-gray-800">{company.name}</h3>
      <p className="text-gray-600 text-sm mt-1">NIT: {company.nit}</p>
      <p className="text-gray-600 text-sm">Dirección: {company.address}</p>
      <p className="text-gray-600 text-sm">Teléfono: {company.phone}</p>
      {/* Si tuviera una vista de detalle para la empresa, podrías añadir un TextLink aquí */}
      {/* <TextLink to={`/companies/${company.id}`} className="mt-2 inline-block">Ver detalles</TextLink> */}
    </div>
  );
};

export default CompanyListItem;