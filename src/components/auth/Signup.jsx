import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const username = formData.get("username");
    const password = formData.get("password");
    const userObj = { name, username, password };
    console.log(name, username, password);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        userObj
      );
      if (response.data.success) {
        navigate("/");
        toast.success("Signup Successful.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
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
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-black">
        <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">
          Sign Up
        </h2>

        <form className="mt-6" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="w-full px-4 py-2 border rounded-lg mt-2 bg-white text-black"
            required
          />
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
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
