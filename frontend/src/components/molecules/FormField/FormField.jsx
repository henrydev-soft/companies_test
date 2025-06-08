
import Input from '../../atoms/Input/Input'; 
import Label from '../../atoms/Label/Label'; 

const FormField = ({ 
  label, 
  id, 
  type = 'text', // Valor por defecto 'text' si no se especifica
  value, 
  onChange, 
  placeholder, 
  error, 
  className = '', // Para permitir clases adicionales al contenedor del campo
  inputClassName = '', // Para permitir clases adicionales directamente al Input
  readOnly = false, // Para campos de solo lectura
  ...props // Para pasar cualquier otra prop adicional al input (ej. required, disabled)
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {/* Usamos el átomo Label */}
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </Label>
      {/* Usamos el átomo Input */}
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // Aplicamos estilos de error si existe y combinamos con inputClassName
        className={`${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} ${inputClassName}`}
        readOnly={readOnly}
        {...props} // Pasa props adicionales como 'required', 'disabled' etc.
      />
      {/* Mensaje de error unificado */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;