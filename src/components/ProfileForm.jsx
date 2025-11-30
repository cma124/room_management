import { FaRegUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuth } from "../utils/AuthContext";

const ProfileForm = () => {
  const { user, logoutUser, deleteUser } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();

    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account?"
      )
    ) {
      return false;
    }

    try {
      await deleteUser(user.$id);
      toast.success("Account is deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="space-y-6" id="profile-form">
      <div className="relative">
        <FaRegUser className="absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          className="text-base w-full h-14 pl-12 pr-4 bg-gray-100 border-transparent rounded-lg text-gray-900"
          type="email"
          defaultValue={user.email ? user.email : ""}
          readOnly
        />
      </div>

      <div className="pt-4 flex-col space-y-8">
        <button
          onClick={handleLogout}
          className="w-full h-14 bg-primary text-white font-bold text-lg rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-red-600 transition-colors"
          type="button"
        >
          Logout
        </button>

        <button
          onClick={handleDeleteUser}
          className="w-full h-14 bg-red-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-primary transition-colors"
          type="button"
        >
          Delete Account
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
