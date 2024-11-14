import PropTypes from "prop-types";

const TabButton = ({ label, value, setActiveTab, activeTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-4 py-2 font-semibold transition-colors duration-200 ${
      activeTab === value
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600 hover:text-blue-600"
    }`}
  >
    {label}
  </button>
);

TabButton.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default TabButton;
