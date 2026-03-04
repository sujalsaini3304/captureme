import { Outlet } from "react-router-dom";
import SecondaryNavbar from "../components/created_ui/SecondaryNavbar" 
import Footer from "../components/created_ui/Footer";

const SecondaryLayout = ({ name }) => {
  return (
    <>
      <SecondaryNavbar name={name} />
      <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-14">
        <Outlet />
      </div>
      </div>
      <Footer/>
    </>
  );
};

export default SecondaryLayout;