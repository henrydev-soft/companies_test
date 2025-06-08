// src/pages/MyCompaniesPage.jsx
import { useState, useEffect, useCallback } from 'react';
import GeneralPageTemplate from '../templates/GeneralPageTemplate/GeneralPageTemplate';
import SectionTitle from '../components/organisms/SectionTitle/SectionTitle';
import CompanyTable from '../components/organisms/CompanyTable/CompanyTable';
import CompanyForm from '../components/organisms/CompanyForm/CompanyForm';
import Modal from '../components/organisms/Modal/Modal';
import ConfirmationDialog from '../components/molecules/ConfirmationDialog/ConfirmationDialog';
import Button from '../components/atoms/Button/Button';
import { getMyCompanies, createCompany, updateCompany, deleteCompany } from '../services/companiesService';

const MyCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null); // Para editar
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyCompanies();
      if (data && data.results && Array.isArray(data.results)) {
        setCompanies(data.results);
      } else if (Array.isArray(data)) {
        setCompanies(data); // Si la API no usa paginación
      } else {
        console.error("Formato de respuesta de empresas inesperado:", data);
        setError(new Error("Formato de datos de empresas inesperado."));
      }
    } catch (err) {
      setError(err);
      console.error("Error fetching my companies:", err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Sin dependencias, solo se crea una vez

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]); // Vuelve a cargar si fetchCompanies cambia (aunque con useCallback no debería a menos que sus deps cambien)

  const handleCreateOrUpdateCompany = async (companyData) => {
    setIsLoading(true); // Poner en carga mientras se guarda
    try {
      if (editingCompany) {
        // Actualizar
        await updateCompany(companyData.nit, companyData);
        alert('Empresa actualizada con éxito!');
      } else {
        // Crear
        await createCompany(companyData);
        alert('Empresa registrada con éxito!');
      }
      setIsModalOpen(false); // Cerrar modal
      setEditingCompany(null); // Limpiar modo edición
      fetchCompanies(); // Recargar la lista
    } catch (err) {
      console.error("Error saving company:", err);
      alert('Error al guardar la empresa. ' + (err.response?.data?.detail || err.message));
    } finally {
        setIsLoading(false); // Quitar carga
    }
  };

  const handleDeleteCompany = async (company) => {
    setCompanyToDelete(company);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;

    setIsLoading(true);
    try {
      await deleteCompany(companyToDelete.nit);
      alert('Empresa eliminada con éxito!');
      fetchCompanies(); // Recargar la lista
    } catch (err) {
      console.error("Error deleting company:", err);
      alert('Error al eliminar la empresa. ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsLoading(false);
      setCompanyToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  const openCreateModal = () => {
    setEditingCompany(null); // Asegurarse de que no estamos editando
    setIsModalOpen(true);
  };

  const openEditModal = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  return (
    <GeneralPageTemplate title="Mis Empresas">
      <SectionTitle title="Gestiona tus Empresas" />

      <div className="mb-6 flex justify-end">
        <Button onClick={openCreateModal}>
          Registrar Nueva Empresa
        </Button>
      </div>

      <CompanyTable
        companies={companies}
        isLoading={isLoading}
        error={error}
        onEdit={openEditModal}
        onDelete={handleDeleteCompany}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCompany(null); }}
        title={editingCompany ? 'Editar Empresa' : 'Registrar Nueva Empresa'}
      >
        <CompanyForm
          onSubmit={handleCreateOrUpdateCompany}
          initialData={editingCompany}
          onClose={() => { setIsModalOpen(false); setEditingCompany(null); }}
        />
      </Modal>

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar la empresa "${companyToDelete?.name}" con NIT "${companyToDelete?.nit}"? Esta acción no se puede deshacer.`}
      />
    </GeneralPageTemplate>
  );
};

export default MyCompaniesPage;