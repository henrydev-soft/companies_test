import TableHeader from '../../atoms/TableHeader/TableHeader';
import TableCell from '../../atoms/TableCell/TableCell';
import IconButton from '../../atoms/IconButton/IconButton';
import Spinner from '../../atoms/Spinner/Spinner';
import EmptyState from '../../organisms/EmptyState/EmptyState';


const EditIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);

// Añadimos la prop `showActions` con valor por defecto `true`
const ProductTable = ({ products, isLoading, error, onEdit, onDelete, showActions = true }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner size="lg" />
        <p className="ml-4 text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <p className="font-semibold text-lg">Error al cargar productos:</p>
        <p>{error.message || 'Ocurrió un error inesperado.'}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState message="No hay productos registrados aún." />;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <TableHeader>Código</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Características</TableHeader>
            {/* Solo muestra la columna "Empresa" si las acciones están visibles (o si no es una vista pública dedicada a una empresa) */}
            {showActions && <TableHeader>Empresa</TableHeader>}
            <TableHeader>Precios</TableHeader>
            {/* Solo muestra la columna "Acciones" si showActions es true */}
            {showActions && <TableHeader className="text-center">Acciones</TableHeader>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.code} className="bg-white border-b hover:bg-gray-50">
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.characteristics}</TableCell>
              {/* Solo muestra la celda "Empresa" si las acciones están visibles */}
              {showActions && <TableCell>{product.company_name}</TableCell>}
              <TableCell>
                {product.prices && product.prices.length > 0 ? (
                  <ul className="list-disc list-inside text-sm">
                    {product.prices.map((priceItem, index) => (
                      <li key={priceItem.id || index}>
                        {priceItem.currency.iso_code}: {priceItem.currency.symbol} {priceItem.price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </TableCell>
              {/* Solo muestra la celda "Acciones" si showActions es true */}
              {showActions && (
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <IconButton onClick={() => onEdit(product)} title="Editar Producto">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(product)} title="Eliminar Producto">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;