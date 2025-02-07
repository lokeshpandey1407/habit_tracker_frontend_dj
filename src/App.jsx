import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen ">
      <Toaster />
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
