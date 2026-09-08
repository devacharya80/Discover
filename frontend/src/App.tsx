import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import CompanyDetails from "./pages/companyPages/CompanyDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="company/:companyId" element={<CompanyDetails />} />
      </Route>
    </Routes>
  );
}

export default App;