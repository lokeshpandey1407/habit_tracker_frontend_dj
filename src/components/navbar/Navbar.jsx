import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (token && token != "") {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [token]);

  return (
    <nav className="bg-gray-800 p-4 sticky right-0 left-0 top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          {/* Logo or Brand */}
          <Link to="/" className="text-white text-2xl font-bold">
            Habit Tracker
          </Link>
        </div>

        <div>
          {isAuth && (
            <button
              className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
