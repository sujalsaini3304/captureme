import { Outlet } from "react-router-dom";
import Navbar from "../components/created_ui/Navbar";
import Footer from "../components/created_ui/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col" >
      <div className="flex-1 pt-14">
        <Outlet />
      </div>
      </div>
      <Footer/>
    </>
  );
};

export default MainLayout;