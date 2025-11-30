import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../utils/AuthContext";
import { FaRegUser, FaLock } from "react-icons/fa6";
import ImageHeader from "../components/ImageHeader";

const LoginPage = () => {
  const loginForm = useRef(null);
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;

    const userInfo = { email, password };

    try {
      await loginUser(userInfo);
    } catch (error) {
      toast.error(error.message || "User Email or Password is incorrect");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <ImageHeader />

      <main className="w-full mx-auto max-w-md mt-6">
        <form
          ref={loginForm}
          onSubmit={handleSubmit}
          className="w-full space-y-6"
          id="login-form"
          autoComplete="on"
        >
          <div className="relative">
            <FaRegUser className="absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              className="text-base w-full h-14 pl-12 pr-4 bg-gray-100 border-transparent focus:border-primary focus:ring-primary rounded-lg text-gray-900 placeholder-gray-500"
              placeholder="User Email"
              type="email"
              name="email"
              required
              autoComplete="on"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              className="text-base w-full h-14 pl-12 pr-4 bg-gray-100 border-transparent focus:border-primary focus:ring-primary rounded-lg text-gray-900 placeholder-gray-500"
              placeholder="Password"
              type="password"
              minLength="8"
              name="password"
              required
              autoComplete="on"
            />
          </div>

          <button
            type="submit"
            className="w-full h-14 bg-primary text-white font-bold text-lg rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-light transition-opacity duration-200"
          >
            Login
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
