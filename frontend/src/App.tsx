import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import CompanyDetails from "./pages/companyPages/CompanyDetails";
import JobDetails from "./pages/JobDetails"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="company/:companyId" element={<CompanyDetails />} >
          <Route path="job/:jobId" element={<JobDetails/>}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;