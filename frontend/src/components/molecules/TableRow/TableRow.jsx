
import { Link } from 'react-router-dom';
import TableCell from '../../atoms/TableCell/TableCell';
import IconButton from '../../atoms/IconButton/IconButton';

// Iconos para las acciones de editar, eliminar e inventario
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

// Nuevo icono para el inventario (ejemplo de icono de caja o almacén)
const InventoryIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-8-4l8 4m-8-4V7m0 10h16v-4m-16 0H4"></path>
    </svg>
);


const TableRow = ({ company, onEdit, onDelete }) => {
  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <TableCell>{company.nit}</TableCell>
      <TableCell>{company.name}</TableCell>
      <TableCell>{company.address}</TableCell>
      <TableCell>{company.phone}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {/* Botón/Enlace para ver el Inventario */}
          {/* Usamos Link para navegar a la ruta de inventario de la empresa */}
          <Link to={`/inventory/${company.nit}`}>
            <IconButton>
              <InventoryIcon />
            </IconButton>
          </Link>

          {/* Botón de Editar */}
          <IconButton onClick={() => onEdit(company)}>
            <EditIcon />
          </IconButton>
          
          {/* Botón de Eliminar */}
          <IconButton onClick={() => onDelete(company)}>
            <DeleteIcon />
          </IconButton>
        </div>
      </TableCell>
    </tr>
  );
};

export default TableRow;