import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [mode, setMode] = useState(
    localStorage.getItem("user_mode") || "light"
  );
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };
  const token = localStorage.getItem("authToken");

  const handleUserMode = (mode) => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("user_mode", "dark");
      setMode("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("user_mode", "light");
      setMode("light");
    }
  };

  useEffect(() => {
    if (token && token != "") {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [token]);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return (
    <nav className="bg-gray-800 dark:bg-black p-4 sticky right-0 left-0 top-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          {/* Logo or Brand */}
          <Link to="/" className="text-white text-2xl font-bold">
            Habit Tracker
          </Link>
        </div>

        <div className="flex gap-1">
          {isAuth && (
            <button
              className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          {mode === "dark" ? (
            <button onClick={() => handleUserMode("light")}>
              <Icon icon="ix:light-dark" width="24" height="24" />
            </button>
          ) : (
            <button onClick={() => handleUserMode("dark")}>
              <Icon icon="circum:dark" width="24" height="24" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
