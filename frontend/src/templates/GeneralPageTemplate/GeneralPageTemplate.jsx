import Navbar from '../../components/organisms/Navbar/Navbar';

const GeneralPageTemplate = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {title && <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600">{title}</h1>}
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default GeneralPageTemplate;