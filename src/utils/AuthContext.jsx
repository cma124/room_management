import { createContext, useContext, useState, useEffect } from "react";
import { ID } from "appwrite";
import account, { functions } from "./appwriteConfig.js";
import Spinner from "../components/Spinner.jsx";
import { ToastContainer } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const loginUser = async (userInfo) => {
    setLoading(true);

    try {
      await account.createEmailPasswordSession({
        email: userInfo.email,
        password: userInfo.password,
      });

      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userInfo) => {
    setLoading(true);

    try {
      await account.create({
        userId: ID.unique(),
        email: userInfo.email,
        password: userInfo.password,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);

    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch {
      // console.error(error);
    }
  };

  const deleteUser = async (userId) => {
    const DELETE_USER_FUNCTION_ID = import.meta.env
      .VITE_APPWRITE_DELETE_USER_FUNCTION_ID;
    setLoading(true);

    try {
      const payload = { userId };

      await account.deleteSessions();

      const execution = await functions.createExecution({
        functionId: DELETE_USER_FUNCTION_ID,
        body: JSON.stringify(payload),
      });

      const functionResponse = JSON.parse(execution.responseBody);

      if (functionResponse.success) {
        setUser(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const listUsers = async () => {
    const LIST_USER_FUNCTION_ID = import.meta.env
      .VITE_APPWRITE_LIST_USER_FUNCTION_ID;

    try {
      const execution = await functions.createExecution({
        functionId: LIST_USER_FUNCTION_ID,
      });

      const data = JSON.parse(execution.responseBody);

      if (data.success) {
        return data.users;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const contextData = {
    user,
    loginUser,
    registerUser,
    logoutUser,
    checkUserStatus,
    deleteUser,
    listUsers,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <Spinner /> : children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
