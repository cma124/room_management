import { FaRegUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../utils/AuthContext";

const NewUserForm = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [userAcc, setUserAcc] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser(userAcc);
      toast.success("User is created successfully");
      navigate("/users");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserAcc((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6" id="new-user-form">
      <div className="relative">
        <FaRegUser className="absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          onChange={handleChange}
          className="text-base w-full h-14 pl-12 pr-4 bg-gray-100 border-transparent focus:border-primary focus:ring-primary rounded-lg text-gray-900 placeholder-gray-500"
          placeholder="Enter New User Email"
          type="email"
          name="email"
          required
        />
      </div>

      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2" />
        {!showPassword ? (
          <input
            onChange={handleChange}
            className="text-base w-full h-14 pl-12 pr-4 bg-gray-100 border-transparent focus:border-primary focus:ring-primary rounded-lg text-gray-900 placeholder-gray-500"
            placeholder="Enter New Password"
            type="password"
            minLength="8"
            name="password"
            required
          />
        ) : (
          <input
            onChange={handleChange}
            className="text-base w-full h-14 pl-12 pr-4 bg-gray-100 border-transparent focus:border-primary focus:ring-primary rounded-lg text-gray-900 placeholder-gray-500"
            placeholder="Enter New Password"
            type="text"
            minLength="8"
            name="password"
            required
          />
        )}

        <button
          onClick={handleShowPassword}
          className="absolute inset-y-0 right-0 flex items-center pr-4"
          type="button"
        >
          {!showPassword ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>

      <button
        className="mt-4 w-full h-14 bg-primary text-white font-bold text-lg rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-primary transition-colors"
        type="submit"
      >
        Create New User
      </button>
    </form>
  );
};

export default NewUserForm;
