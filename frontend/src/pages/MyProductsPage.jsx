import { useState, useEffect, useCallback } from 'react';
import GeneralPageTemplate from '../templates/GeneralPageTemplate/GeneralPageTemplate';
import SectionTitle from '../components/organisms/SectionTitle/SectionTitle';
import ProductTable from '../components/organisms/ProductTable/ProductTable';
import ProductForm from '../components/organisms/ProductForm/ProductForm';
import Modal from '../components/organisms/Modal/Modal';
import ConfirmationDialog from '../components/molecules/ConfirmationDialog/ConfirmationDialog';
import Button from '../components/atoms/Button/Button';
import { getMyProducts, createProduct, updateProduct, deleteProduct } from '../services/productsService';
import AdModal from '../components/organisms/AdModal/AdModal';

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Para editar
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [selectedProductForAd, setSelectedProductForAd] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyProducts(); // Usa el nuevo servicio `getMyProducts`
      // Tu respuesta del servidor tiene paginación, así que accedemos a `results`
      setProducts(data.results || []); 
    } catch (err) {
      setError(new Error(err.response?.data?.detail || err.message || 'Error al cargar productos.'));
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateOrUpdateProduct = async (productData) => {
    setIsLoading(true); // Indica que la operación está en curso
    try {
      if (editingProduct) {
        await updateProduct(productData.code, productData);
        alert('Producto actualizado con éxito!');
      } else {
        await createProduct(productData);
        alert('Producto registrado con éxito!');
      }
      setIsModalOpen(false); // Cierra el modal
      setEditingProduct(null); // Limpia el producto en edición
      fetchProducts(); // Recarga la lista de productos
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      // Muestra un mensaje de error más útil desde el backend si está disponible
      alert('Error al guardar el producto. ' + (JSON.stringify(err.response?.data) || err.message));
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

  const handleDeleteProduct = async (product) => {
    setProductToDelete(product);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsLoading(true); // Indica que la operación de eliminación está en curso
    try {
      await deleteProduct(productToDelete.code);
      alert('Producto eliminado con éxito!');
      fetchProducts(); // Recarga la lista
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err.message);
      alert('Error al eliminar el producto. ' + (JSON.stringify(err.response?.data) || err.message));
    } finally {
      setIsLoading(false); // Finaliza la carga
      setProductToDelete(null); // Limpia el producto a eliminar
      setShowConfirmDialog(false); // Cierra el diálogo de confirmación
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null); // Asegura que el formulario esté vacío para creación
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product); // Carga los datos del producto a editar
    setIsModalOpen(true);
  };

  const handleGenerateAdClick = (product) => {
    setSelectedProductForAd(product);
    setIsAdModalOpen(true);
  };

  const handleAdGenerated = (productId, newAdContent) => {
    // Actualiza el estado de los productos con el nuevo texto generado
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, generated_ad: newAdContent } : p
      )
    );
    // También actualiza el producto seleccionado si es el mismo, para que el modal refleje el cambio
    setSelectedProductForAd(prevProduct =>
      prevProduct && prevProduct.id === productId ? { ...prevProduct, generated_ad: newAdContent } : prevProduct
    );
  };

  return (
    <GeneralPageTemplate title="Mis Productos">
      <SectionTitle title="Gestiona tus Productos" />

      <div className="mb-6 flex justify-end">
        <Button onClick={openCreateModal}>
          Registrar Nuevo Producto
        </Button>
      </div>

      <ProductTable
        products={products}
        isLoading={isLoading}
        error={error}
        onEdit={openEditModal}
        onDelete={handleDeleteProduct}
        onGenerateAdClick={handleGenerateAdClick}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        title={editingProduct ? 'Editar Producto' : 'Registrar Nuevo Producto'}
      >
        <ProductForm
          onSubmit={handleCreateOrUpdateProduct}
          initialData={editingProduct}
          onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        />
      </Modal>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar el producto "${productToDelete?.name}" con código "${productToDelete?.code}"? Esta acción no se puede deshacer.`}
      />
      {selectedProductForAd && ( // Solo renderiza si hay un producto seleccionado
        <AdModal
          isOpen={isAdModalOpen}
          onClose={() => {
            setIsAdModalOpen(false);
            setSelectedProductForAd(null); // Limpiar el producto seleccionado al cerrar
          }}
          product={selectedProductForAd}
          initialAd={selectedProductForAd.generated_add} // Pasa el texto actual del producto
          onAdGenerated={handleAdGenerated} // Callback para actualizar el texto en la tabla
        />
      )}
    </GeneralPageTemplate>
  );
};

export default MyProductsPage;