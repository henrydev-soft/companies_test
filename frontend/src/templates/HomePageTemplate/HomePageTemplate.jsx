
import Navbar from '../../components/organisms/Navbar/Navbar';

const HomePageTemplate = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">     
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default HomePageTemplate;