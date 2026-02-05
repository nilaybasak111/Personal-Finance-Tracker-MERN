import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">💰 SmartTracker</Link>
      </div>

      <div className="flex gap-6">
        <Link to="/dashboard" className="hover:text-blue-200">
          Dashboard
        </Link>

        <Link to="/add" className="hover:text-blue-200">
          Add
        </Link>

        <Link to="/analytics" className="hover:text-blue-200">
          Analytics
        </Link>

        <Link to="/budgets" className="hover:text-blue-200">
          Budgets
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
