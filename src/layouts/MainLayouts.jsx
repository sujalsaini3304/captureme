import { Outlet } from "react-router-dom";
import Navbar from "../components/created_ui/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;