import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import UserCard from "../components/UserCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../utils/AuthContext";

const UsersPage = () => {
  const navigate = useNavigate();
  const { listUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersResponse = await listUsers();
        setUsers(usersResponse);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <>
      <div className="h-screen mx-auto md:mx-5 mt-4 flex flex-col" id="app">
        <header className="shrink-0 px-6 pt-12 pb-4 mb-1">
          <h1 className="text-3xl font-bold text-slate-900">
            App Users - {users.length && users.length}
          </h1>
        </header>

        <main className="grow overflow-y-auto px-6">
          <ul className="space-y-5">
            {loading ? (
              <Spinner />
            ) : (
              users.length &&
              users.map((user) => <UserCard key={user.$id} user={user} />)
            )}
          </ul>
        </main>

        <div className="fixed bottom-24 right-8">
          <button
            onClick={() => navigate("/users/create")}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <span className="text-3xl">+</span>
          </button>
        </div>
      </div>

      <NavBar />
    </>
  );
};

export default UsersPage;
