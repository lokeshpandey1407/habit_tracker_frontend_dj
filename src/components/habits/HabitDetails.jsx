import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../loader/Loader";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const HabitPage = () => {
  const { id } = useParams();
  const [habit, setHabit] = useState(null);
  const [habitUpdateModal, setHabitUpdateModal] = useState(false);
  const [barData, setBarData] = useState([]);
  const [habitUpdating, setHabitUpdating] = useState(false);
  const [progressUpdating, setProgressUpdating] = useState(false);
  const [progressUpdateModal, setProgressUpdateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHabit = async () => {
    const token = JSON.parse(localStorage.getItem("authToken"));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/habits/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        const chartData = configureChartData(response?.data?.data?.progress);
        setHabit(response.data.data);
        setBarData(chartData);
      }
    } catch (error) {
      console.error("Error fetching habit:", error);
    } finally {
      setLoading(false);
    }
  };

  const configureChartData = (data) => {
    let chartData = data.map((item) => {
      return {
        date: new Date(item.date).toLocaleDateString("en-Us"),
        count: item.count,
      };
    });
    chartData = chartData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return chartData;
  };

  useEffect(() => {
    fetchHabit();
  }, [id]);

  const openHabitUpdaetModal = () => {
    setHabitUpdateModal(true);
  };

  const closeHabitUpdaetModal = () => {
    setHabitUpdateModal(false);
  };

  const openProgressUpdaetModal = () => {
    setProgressUpdateModal(true);
  };

  const closeProgresssUpdaetModal = () => {
    setProgressUpdateModal(false);
  };

  const getBackgroundColor = (progress, goal) => {
    const goalCompletionPercentage = (progress / goal) * 100;
    return `linear-gradient(to right, #48BB78 ${goalCompletionPercentage}%, #E2E8F0 ${goalCompletionPercentage}%)`;
  };

  const getProgressPercentage = (progress) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in yyyy-mm-dd format
    const todaysProgress = progress.find(
      (item) => new Date(item?.date).toISOString().split("T")[0] === today
    );
    let progressPercentage = 0;
    if (todaysProgress) {
      progressPercentage =
        (todaysProgress?.count / habit.habitGoal.count) * 100;
    }
    let result = {};

    if (progressPercentage > 0 && progressPercentage <= 25) {
      result = {
        percentage: progressPercentage,
        message: "Keep going, you're getting started! 💪",
        color: "bg-red-500",
      };
    } else if (progressPercentage > 25 && progressPercentage <= 50) {
      result = {
        percentage: progressPercentage,
        message: "You're making progress! Stay focused! 🔥",
        color: "bg-yellow-500",
      };
    } else if (progressPercentage > 50 && progressPercentage <= 75) {
      result = {
        percentage: progressPercentage,
        message: "Great job! You're more than halfway there! 🌟",
        color: "bg-blue-500",
      };
    } else if (progressPercentage > 75 && progressPercentage <= 99) {
      result = {
        percentage: progressPercentage,
        message: "Almost there, just a little more effort! 🚀",
        color: "bg-green-500",
      };
    } else if (progressPercentage >= 99) {
      result = {
        percentage: progressPercentage,
        message: "You did it! Amazing job on completing your goal! 🎉",
        color: "bg-green-700",
      };
    } else {
      result = {
        percentage: progressPercentage,
        message: "Looks like you're just getting started! 🌱",
        color: "bg-white",
      };
    }
    return result;
  };

  async function handleUpdateHabit(e) {
    setHabitUpdating(true);
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("authToken"));
    const formData = new FormData(e.target);
    const habitObj = {};
    habitObj.title = formData.get("title");
    habitObj.description = formData.get("description");
    habitObj.unit = formData.get("unit");
    habitObj.count = formData.get("count");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/habits/${habit._id}`,
        habitObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setHabit(response.data.data);
        closeHabitUpdaetModal();
        toast.success("Habit updated successfully.");
      }
    } catch (error) {
      toast.error("Unable to update habit");
      console.log(error);
    } finally {
      setHabitUpdating(false);
    }
  }

  async function handleUpdateProgress(e) {
    setProgressUpdating(true);
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("authToken"));
    const formData = new FormData(e.target);
    const progressObj = {};
    progressObj.count = formData.get("count");
    progressObj.date = formData.get("date");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/habits/${habit._id}/progress`,
        progressObj,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setHabit(response.data.data);
        const chartData = configureChartData(response?.data?.data?.progress);
        console.log(chartData);
        setBarData(chartData);
        closeProgresssUpdaetModal();
        toast.success("Habit progresss updated successfully.");
      }
    } catch (error) {
      toast.error("Unable to update habit progress");
      console.log(error);
    } finally {
      setProgressUpdating(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-2">
      <button
        className="bg-red-500 px-2 py-1  rounded-md"
        onClick={() => navigate(-1)}
      >
        <Icon icon="ep:back" width="24" height="24" />
      </button>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 dark:bg-black">
        {/* Habit Title and Description */}
        <div className="mb-4 flex flex-row justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {habit?.title}
            </h1>
            {habit?.description && (
              <p className="text-gray-600 text-md mt-2 dark:text-white">
                {habit?.description || ""}
              </p>
            )}
          </div>
          <button
            className="bg-[#318CE7] hover:bg-blue-600 px-3 py-2 rounded-md"
            onClick={openHabitUpdaetModal}
          >
            Update Habit
          </button>
        </div>

        {/* Habit Goal */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Goal</h2>
          <p className="text-gray-600 dark:text-white">
            {habit?.habitGoal?.count || ""} {habit?.habitGoal?.unit || ""}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-6 ">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Progress</h2>
            <button
              className="bg-[#318CE7] hover:bg-blue-600 px-3 py-2 rounded-md"
              onClick={openProgressUpdaetModal}
            >
              Add/Update Progresss
            </button>
          </div>
          <ul className="space-y-2 max-h-40 overflow-auto">
            {habit && habit?.progress.length > 0 ? (
              habit?.progress.map((item, index) => (
                <li
                  key={index}
                  className="py-2 border rounded-md border-gray-300 p-2 mt-2"
                >
                  <span className="font-medium text-gray-800 dark:text-white">
                    {new Date(item.date).toLocaleDateString("en-Us", {
                      dateStyle: "medium",
                    })}
                  </span>
                  <div
                    className="flex items-center justify-between p-1 "
                    style={{
                      background: getBackgroundColor(
                        item.count,
                        habit.habitGoal.count
                      ),
                    }}
                  >
                    <p className="text-gray-600 dark:text-white">
                      {item.count} {habit.habitGoal.unit}
                    </p>
                    <p className="text-black font-bold dark:text-white">
                      {habit.habitGoal.count} {habit.habitGoal.unit}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-black text-sm dark:text-white">Oops! No Progress Yet.</p>
            )}
          </ul>
        </div>

        {/* Today's Goal Completion */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
            Today &apos;s Goal
          </h2>
          {habit?.progress && (
            <div
              className={`${
                getProgressPercentage(habit?.progress).color
              } p-2 rounded-lg mt-2 text-black shadow-md`}
            >
              <p className="text-sm">
                You have completed{" "}
                {getProgressPercentage(habit?.progress).percentage.toFixed(2)}%
                Goal.{" "}
              </p>
              {getProgressPercentage(habit.progress).message}
            </div>
          )}
        </div>

        {/* Habit Start Date */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Start Date</h2>
          <p className="text-gray-600 dark:text-white">
            {new Date(habit?.startDate).toLocaleDateString("en-Us", {
              dateStyle: "medium",
            })}
          </p>
        </div>
      </div>
      {/* Habit update modal */}
      {habitUpdateModal && (
        <div
          className="bg-[rgba(0,0,0,0.4)] fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center"
          onClick={closeHabitUpdaetModal}
        >
          <div
            className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeHabitUpdaetModal}
              className="absolute top-5 right-5 rounded-full hover:bg-slate-400 hover:text-white text-black"
            >
              <Icon
                icon="material-symbols:close-rounded"
                width="24"
                height="24"
              />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-black">
              Update Habit
            </h2>
            <form className="space-y-4" onSubmit={handleUpdateHabit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Habit Title*
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300 bg-slate-300 text-gray-900"
                  placeholder="e.g. Running"
                  defaultValue={habit.title}
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
                  defaultValue={habit.description}
                  name="description"
                  placeholder="e.g. Running is good for health"
                ></textarea>
              </div>

              {/* <!-- Habit Goal --> */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Goal Unit*
                  </label>
                  <input
                    className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300  bg-slate-300 text-gray-900"
                    type="text"
                    name="unit"
                    defaultValue={habit.habitGoal.unit}
                    placeholder="e.g. Minutes"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Goal Count*
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300  bg-slate-300 text-gray-900"
                    placeholder="e.g. 10"
                    name="count"
                    defaultValue={habit.habitGoal.count}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#318CE7] text-white py-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
                disabled={habitUpdating}
              >
                {habitUpdating ? "Updating..." : "Update Habit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Progress Update modal */}
      {progressUpdateModal && (
        <div
          className="bg-[rgba(0,0,0,0.4)] fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center"
          onClick={closeProgresssUpdaetModal}
        >
          <div
            className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeProgresssUpdaetModal}
              className=" absolute top-2 right-2 rounded-full hover:bg-slate-400 hover:text-white text-black"
            >
              <Icon
                icon="material-symbols:close-rounded"
                width="24"
                height="24"
              />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-black">
              Add/Update Habit Progress
            </h2>
            <form className="space-y-4" onSubmit={handleUpdateProgress}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date*
                </label>
                <input
                  type="date"
                  required
                  name="date"
                  min={new Date().toISOString().split("T")[0]}
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300  bg-slate-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Goal Count*
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
              <button
                type="submit"
                className="w-full bg-[#318CE7] text-white py-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
                disabled={progressUpdating}
              >
                {progressUpdating ? "Updating..." : "Add/Update Progress"}
              </button>
            </form>
          </div>
        </div>
      )}
      {barData.length > 0 && (
        <div className="max-w-4xl mx-auto h-96 mt-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default HabitPage;
