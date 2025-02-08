import { useEffect, useState } from "react";
import { Icon } from "@iconify/react"; // Make sure to install Iconify
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../loader/Loader";

const Habits = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habitAdding, setHabitAdding] = useState(false);
  const [habitModal, setHabitModal] = useState(false);

  const fetchHabit = async () => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("authToken"));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/habits`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setHabits(response.data.data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("Session Expired. Please login again to continue");
        localStorage.clear();
        navigate("/");
      }
      console.error("Error fetching habit:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleCreateHabit(e) {
    setHabitAdding(true);
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("authToken"));
    const formData = new FormData(e.target);
    const habitObj = {};
    habitObj.title = formData.get("title");
    habitObj.description = formData.get("description");
    habitObj.unit = formData.get("unit");
    habitObj.count = formData.get("count");
    habitObj.startDate = formData.get("startDate");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/habits`,
        habitObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setHabits((prev) => [response?.data?.data, ...prev]);
        closeModal();
        toast.success("Habit created successfully.");
      }
    } catch (error) {
      toast.error("Unable to create habit");
      console.log(error);
    }
  }

  const handleDeleteHabit = async (id) => {
    const token = JSON.parse(localStorage.getItem("authToken"));
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/habits/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setHabits((prev) => prev.filter((habit) => habit._id != id));
        toast.success("Habit deleted successfully.");
      }
    } catch (error) {
      toast.error("Unable to delete habit");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHabit();
  }, []);

  const openModal = () => {
    setHabitModal(true);
  };

  const closeModal = () => {
    setHabitModal(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex justify-center px-3 pt-4 pb-5">
      <div className="w-full max-w-full">
        <div className="flex flex-row items-baseline mx-auto justify-between max-w-7xl">
          <h2 className="text-2xl font-semibold text-left text-gray-800 mb-6">
            Your Habits
          </h2>
          <button
            className="rounded-md px-3 py-2 bg-[#318CE7]"
            title="Add Habit"
            onClick={openModal}
          >
            Add New Habit
          </button>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {habits.length > 0 ? (
            habits.map((habit, index) => (
              <div
                key={index}
                className="flex flex-col p-2 rounded-lg border-black border-2 shadow-sm text-gray-800 w-full sm:w-full md:max-w-[400px] min-h-16 dark:border-2 dark:border-sky-400 dark:bg-black"
              >
                <div className="flex-1">
                  <h3 className="text-md font-medium dark:text-white">
                    {habit.title}
                  </h3>
                  <p className="text-xs text-gray-400">{habit.description}</p>
                  <p className="text-black text-xs dark:text-white">
                    Current Goal: {habit?.habitGoal.count}{" "}
                    {habit?.habitGoal.unit}
                  </p>
                  {/* <p className="text-sky-800 text-[10px]">
                    Current Progress: {habit.progress}/{habit.goal}
                  </p> */}
                </div>

                <div className="flex space-x-3 justify-end mt-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    title="View"
                    onClick={() => navigate(`/habit/${habit._id}`)}
                  >
                    <Icon icon="akar-icons:eye" width={22} height={22} />
                  </button>

                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteHabit(habit._id)}
                    title="Delete"
                  >
                    <Icon icon="mdi:delete" width={22} height={22} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center w-full">
              <p className="text-black text-center dark:text-white">
                Oops! Your habit list is feeling lonely. Give it some company!
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Modal content */}
      {habitModal && (
        <div
          className="bg-[rgba(0,0,0,0.4)] fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 rounded-full hover:bg-slate-400 hover:text-white text-black"
            >
              <Icon
                icon="material-symbols:close-rounded"
                width="24"
                height="24"
              />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-black">
              Add a New Habit
            </h2>
            <form className="space-y-4" onSubmit={handleCreateHabit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Habit Name*
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300 bg-slate-300 text-gray-900"
                  placeholder="e.g. Running"
                  name="title"
                  required
                />
              </div>

              {/* <!-- Description --> */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full border resize-y max-h-40 overflow-auto rounded-md p-2 focus:ring focus:ring-blue-300  bg-slate-300 text-gray-900"
                  rows={3}
                  name="description"
                  placeholder="e.g. Running is good for health"
                ></textarea>
              </div>

              {/* <!-- Habit Goal --> */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Goal*
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300  bg-slate-300 text-gray-900"
                    placeholder="e.g. 10"
                    name="count"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit*
                  </label>
                  <input
                    className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300  bg-slate-300 text-gray-900"
                    type="text"
                    name="unit"
                    placeholder="e.g. Minutes"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date*
                </label>
                <input
                  type="date"
                  required
                  name="startDate"
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300  bg-slate-300 text-gray-900"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#318CE7] text-white py-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
                disabled={habitAdding}
              >
                {habitAdding ? "Adding..." : "Add Habit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;
