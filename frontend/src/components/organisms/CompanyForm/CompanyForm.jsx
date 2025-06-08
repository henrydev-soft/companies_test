import  { useState, useEffect } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';

const CompanyForm = ({ onSubmit, initialData = null, onClose }) => {
  const [formData, setFormData] = useState({
    nit: '',
    name: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ nit: '', name: '', address: '', phone: '' }); // Resetear para nuevo registro
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setErrors({
      ...errors,
      [id]: '', // Limpiar error cuando el usuario escribe
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nit) newErrors.nit = 'El NIT es obligatorio.';
    if (!formData.name) newErrors.name = 'El nombre es obligatorio.';
    if (!formData.address) newErrors.address = 'La dirección es obligatoria.';
    if (!formData.phone) newErrors.phone = 'El teléfono es obligatorio.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <FormField
        label="NIT"
        id="nit"
        value={formData.nit}
        onChange={handleChange}
        placeholder="Ingrese el NIT"
        error={errors.nit}
        type="text"
        // Deshabilitar NIT si estamos editando
        className={initialData ? 'pointer-events-none opacity-50' : ''}
        readOnly={!!initialData}
      />
      <FormField
        label="Nombre de la empresa"
        id="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ingrese el nombre"
        error={errors.name}
      />
      <FormField
        label="Dirección"
        id="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Ingrese la dirección"
        error={errors.address}
      />
      <FormField
        label="Teléfono"
        id="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Ingrese el teléfono"
        error={errors.phone}
        type="tel"
      />
      <div className="flex justify-end space-x-4 mt-6">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Actualizar Empresa' : 'Registrar Empresa'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;