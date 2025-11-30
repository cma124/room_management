import { FaRegCircleUser } from "react-icons/fa6";

const UserCard = ({ user }) => {
  return (
    <li className="flex flex-col items-start space-y-3 md:flex-row md:justify-between md:items-center md:space-y-0 p-4 rounded-lg bg-white shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100">
          <FaRegCircleUser className="text-slate-400 text-3xl" />
        </div>
        <span className="text-lg font-medium text-slate-800">{user.email}</span>
      </div>
    </li>
  );
};

export default UserCard;
