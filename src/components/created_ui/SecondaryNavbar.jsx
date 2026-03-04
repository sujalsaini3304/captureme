import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SecondaryNavbar = ({ name }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div
      className="
        fixed top-0 left-0 w-full h-14
        bg-white dark:bg-[#0f172a]
        text-gray-900 dark:text-gray-200
        border-b border-gray-200 dark:border-gray-800
        shadow-sm
        z-50
        flex items-center
        px-4
        transition-colors duration-300
      "
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="
        cursor-pointer
          p-2 rounded-full
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition-all duration-200
          flex items-center justify-center
        "
      >
        <ArrowLeft size={20} />
      </button>

      {/* Title (Centered Properly) */}
      <div className="absolute left-1/2 -translate-x-1/2 text-lg font-medium">
        {name}
      </div>
    </div>
  );
};

export default SecondaryNavbar;