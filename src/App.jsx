import { Route, Routes } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Setting from "./screens/Setting";
import MainLayout from "./layouts/MainLayouts";
import SecondaryLayout from "./layouts/SecondaryLayout";


const App = () => {
  return (
    <Routes>
      {/* Routes using Main Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      {/* Routes using Secondary Navbar */}
      <Route element={<SecondaryLayout name={"Settings"} />}>
        <Route path="/setting" element={<Setting />} />
      </Route>
    </Routes>
  );
};

export default App;