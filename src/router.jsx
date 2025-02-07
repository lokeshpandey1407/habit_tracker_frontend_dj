import { createBrowserRouter } from "react-router-dom";
import Signup from "./components/auth/Signup";
import Signin from "./components/auth/Signin";
import Habits from "./components/habits/Habits";
import App from "./App";
import HabitPage from "./components/habits/HabitDetails";
import ProtectedRoute from "./utils/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Signin /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/habit",
        element: (
          <ProtectedRoute>
            <Habits />
          </ProtectedRoute>
        ),
      },
      {
        path: "habit/:id",
        element: (
          <ProtectedRoute>
            <HabitPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "*", element: <div>Not found</div> }, // Catch-all for unknown routes
]);
