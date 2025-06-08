
const SectionTitle = ({ title, className = '' }) => {
  return (
    <h2 className={`text-3xl font-bold text-gray-800 mb-6 text-center ${className}`}>
      {title}
    </h2>
  );
};

export default SectionTitle;