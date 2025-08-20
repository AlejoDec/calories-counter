import { useNavigate } from "react-router-dom";

const IconAccount = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/login");
    }

    return (
        <button onClick={handleClick} className="flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors duration-300 ">
            <p>A</p>
        </button>
    );
};

export default IconAccount;