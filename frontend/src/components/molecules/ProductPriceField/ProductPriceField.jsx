
import FormField from '../FormField/FormField';
import Select from '../../atoms/Select/Select'; 
import IconButton from '../../atoms/IconButton/IconButton';

const RemoveIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

const ProductPriceField = ({ priceItem, onPriceChange, onRemovePrice, currencies, errors = {} }) => {
  const handleCurrencyChange = (e) => {
    onPriceChange(priceItem.uniqueKey, 'currency', e.target.value);
  };

  const handlePriceChange = (e) => {
    onPriceChange(priceItem.uniqueKey, 'price', e.target.value);
  };

  const currencyOptions = currencies.map(c => ({
    value: c.id, // El backend espera el Id de la moneda para guardar
    label: `${c.iso_code}` 
  }));

  // Añadir una opción vacía para "Seleccionar moneda"
  currencyOptions.unshift({ value: '', label: '--- Seleccionar Moneda ---' });

  return (
    <div className="flex items-end space-x-2 mb-4 bg-gray-50 p-3 rounded-md border border-gray-200">
      <div className="flex-grow">
        <label htmlFor={`currency-${priceItem.uniqueKey}`} className="block text-sm font-medium text-gray-700 mb-1">
          Moneda
        </label>
        <Select
          id={`currency-${priceItem.uniqueKey}`}
          value={priceItem.currency}
          onChange={handleCurrencyChange}
          options={currencyOptions}
          className={errors.currency ? 'border-red-500' : ''}
          required
        />
        {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency}</p>}
      </div>
      <FormField
        label="Precio"
        id={`price-${priceItem.uniqueKey}`}
        type="number"
        value={priceItem.price}
        onChange={handlePriceChange}
        placeholder="Ej: 100.00"
        error={errors.price}
        min="0"
        step="0.01"
        className="flex-grow"
        required
      />
      <IconButton onClick={() => onRemovePrice(priceItem.uniqueKey)} className="mb-1 text-red-600 hover:bg-red-100">
        <RemoveIcon />
      </IconButton>
    </div>
  );
};

export default ProductPriceField;