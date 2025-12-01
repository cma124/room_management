import { NavLink } from "react-router-dom";
import { FaCouch, FaCalendarDays, FaUsers, FaUser } from "react-icons/fa6";

const NavBar = () => {
  const navClass = ({ isActive }) =>
    isActive
      ? "flex flex-col items-center gap-y-2 text-primary"
      : "flex flex-col items-center gap-y-2";

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto md:mx-5 min-h-20 bg-card-light border-t border-gray-200 flex justify-around items-center">
      <NavLink to="/" className={navClass}>
        <FaCouch />
        <span className="text-sm font-medium">Rooms</span>
      </NavLink>

      <NavLink to="/calendar" className={navClass}>
        <FaCalendarDays />
        <span className="text-sm font-medium">Calendar</span>
      </NavLink>

      <NavLink to="/users" className={navClass}>
        <FaUsers />
        <span className="text-sm font-medium">Users</span>
      </NavLink>

      <NavLink to="/users/my_profile" className={navClass}>
        <FaUser />
        <span className="text-sm font-medium">Profile</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;
