import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const userObj = { username, password };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userObj
      );
      if (response.data.success) {
        localStorage.setItem("authToken", JSON.stringify(response.data.token));
        navigate("/habit");
        toast.success("Signin Successful.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to Signin. Please try again."
      );
    }
  };

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/habit");
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-100 min-w-full">
      <div className="w-full max-w-md p-8 bg-white dark:bg-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">
          Sign In
        </h2>

        <form className="mt-6" onSubmit={handleSignin}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="w-full px-4 py-2 border rounded-lg mt-2 bg-white text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full px-4 py-2 border rounded-lg mt-2 bg-white text-black"
            required
          />

          <button
            type="submit"
            className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
