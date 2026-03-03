import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const SecondaryNavbar = ({name}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate("/", { replace: true });
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-14 bg-white sm:gap-2 shadow-sm z-50 flex items-center px-4">
                <div
                    onClick={handleBack}
                    className=" p-1 cursor-pointer"
                >
                    <ArrowLeft />
                </div>
                <div className="flex items-center gap-2 mx-auto sm:mx-0 text-xl font-sans">
                    <span>{name}</span>
                </div>
            </div>
        </>
    );
}

export default SecondaryNavbar