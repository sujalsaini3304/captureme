import { Outlet } from "react-router-dom";
import SecondaryNavbar from "../components/created_ui/SecondaryNavbar" 

const SecondaryLayout = ({ name }) => {
  return (
    <>
      <SecondaryNavbar name={name} />
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default SecondaryLayout;