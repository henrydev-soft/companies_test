// src/components/organisms/ProductForm/ProductForm.jsx
import { useState, useEffect } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Select from '../../atoms/Select/Select';
import Button from '../../atoms/Button/Button';
import ProductPriceField from '../../molecules/ProductPriceField/ProductPriceField';
import { getMyCompanies } from '../../../services/companiesService'; // Para obtener empresas del usuario
import { getCurrencies } from '../../../services/currencyService'; // Para obtener monedas

const ProductForm = ({ onSubmit, initialData = null, onClose }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    characteristics: '',
    company: '', // NIT de la empresa
    prices: [], // Array de { id (opcional), currency (ID de moneda), price }
  });
  const [errors, setErrors] = useState({});
  const [companies, setCompanies] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  // Usaremos un contador para `uniqueKey` de los precios para React (no es el ID de DB)
  const [priceFieldCounter, setPriceFieldCounter] = useState(0); 

  // Determinar si estamos en modo de edición
  const isEditing = initialData !== null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await getMyCompanies();
        setCompanies(companiesData.results || companiesData); // Manejar paginación
        const currenciesData = await getCurrencies();
        setCurrencies(currenciesData.results || currenciesData);
      } catch (err) {
        console.error("Error fetching companies or currencies:", err);
        // Mostrar un mensaje de error al usuario
        alert("Error al cargar empresas o monedas. Por favor, recarga la página.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        name: initialData.name || '',
        characteristics: initialData.characteristics || '',
        company: initialData.company_nit || '', // El NIT de la empresa del producto
        // Mapear los precios existentes a un formato manejable para el formulario
        prices: initialData.prices.map(p => ({
          id: p.id, // ID de la relación ProductCurrencyPrice (si existe)
          currency: p.currency.id, // ID de la moneda (para el Select)
          price: p.price,
          uniqueKey: p.id || Math.random(), // Usar ID existente o generar para key de React
        })),
      });
      // Asegurar que el contador de precios no colisione con IDs existentes
      setPriceFieldCounter(initialData.prices.length > 0 ? Math.max(...initialData.prices.map(p => p.id || 0)) + 1 : 0);
    } else {
      setFormData({ code: '', name: '', characteristics: '', company: '', prices: [] });
      setPriceFieldCounter(0);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setErrors({ ...errors, [id]: '' }); // Limpiar error al cambiar
  };

  const handlePriceChange = (uniqueKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.map(priceItem =>
        priceItem.uniqueKey === uniqueKey ? { ...priceItem, [field]: value } : priceItem
      ),
    }));
  };

  const handleAddPrice = () => {
    setPriceFieldCounter(prev => prev + 1);
    setFormData(prev => ({
      ...prev,
      prices: [...prev.prices, { uniqueKey: priceFieldCounter, currency: '', price: '' }],
    }));
  };

  const handleRemovePrice = (uniqueKey) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.filter(priceItem => priceItem.uniqueKey !== uniqueKey),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.code) newErrors.code = 'El código es obligatorio.';
    if (!formData.name) newErrors.name = 'El nombre es obligatorio.';
    if (!formData.characteristics) newErrors.characteristics = 'Las características son obligatorias.';
    if (!isEditing && !formData.company) newErrors.company = 'La empresa es obligatoria.';

    formData.prices.forEach((priceItem, index) => {
      if (!priceItem.currency) {
        newErrors[`prices[${index}].currency`] = 'Seleccione una moneda para este precio.';
      }
      if (isNaN(parseFloat(priceItem.price)) || parseFloat(priceItem.price) <= 0) {
        newErrors[`prices[${index}].price`] = 'Ingrese un precio válido y mayor que cero.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      alert('Por favor, corrige los errores del formulario.');
      return;
    }

    // Transformar los datos de prices para el backend (solo currency ID y price)
    const productDataToSend = {
      ...formData,
      ...(isEditing ? {} : { company: parseInt(formData.company) }),
      prices: formData.prices.map(p => ({
        id: p.id,
        currency_id: parseInt(p.currency),
        price: parseFloat(p.price),
      })),
    };
    onSubmit(productDataToSend);
  };

  // Opciones para el select de empresas
  const companyOptions = companies.map(c => ({ value: c.nit, label: c.name }));
  companyOptions.unshift({ value: '', label: '--- Seleccione una empresa ---' });


  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h2>
      <FormField
        label="Código del Producto"
        id="code"
        value={formData.code}
        onChange={handleChange}
        placeholder="Ingrese el código"
        error={errors.code}
        type="number"
        readOnly={!!initialData} // El código no debe ser editable al actualizar
        required
      />
      <FormField
        label="Nombre del Producto"
        id="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ingrese el nombre"
        error={errors.name}
        required
      />
      <FormField
        label="Características"
        id="characteristics"
        value={formData.characteristics}
        onChange={handleChange}
        placeholder="Describa las características"
        error={errors.characteristics}
        type="textarea" // Asume que tu FormField puede renderizar un textarea
        rows="3"
        required
      />

      <div className="mb-4">
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Empresa
        </label>
        <Select
          id="company"
          value={formData.company}
          onChange={handleChange}
          options={companyOptions}
          className={errors.company ? 'border-red-500' : ''}
          required
          disabled={isEditing}
        />
        {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Precios por Moneda</h3>
      {formData.prices.length === 0 && (
        <p className="text-gray-500 text-sm mb-4">Aún no hay precios. Haz clic en "Agregar Precio".</p>
      )}
      {formData.prices.map((priceItem, index) => (
        <ProductPriceField
          key={priceItem.uniqueKey}
          priceItem={priceItem}
          onPriceChange={handlePriceChange}
          onRemovePrice={handleRemovePrice}
          currencies={currencies}
          errors={{
            currency: errors[`prices[${index}].currency`],
            price: errors[`prices[${index}].price`],
          }}
        />
      ))}
      <Button type="button" variant="outline" onClick={handleAddPrice} className="mt-2 w-full justify-center">
        + Agregar Precio
      </Button>

      <div className="flex justify-end space-x-4 mt-8">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {isEditing ? 'Actualizar Producto' : 'Registrar Producto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;