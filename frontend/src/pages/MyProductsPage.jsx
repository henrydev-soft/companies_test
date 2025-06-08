
import GeneralPageTemplate from '../templates/GeneralPageTemplate/GeneralPageTemplate';

const MyProductsPage = () => {
  return (
    <GeneralPageTemplate title="Mis Productos">
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold text-gray-800">Contenido de Mis Productos (Solo Admin)</h2>
        <p className="mt-4 text-gray-600">Aquí se mostrarán los productos registrados por el usuario logueado.</p>
      </div>
    </GeneralPageTemplate>
  );
};

export default MyProductsPage;