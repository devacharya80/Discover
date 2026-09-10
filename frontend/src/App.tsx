import { Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import CompanyDetails from "./pages/companyPages/CompanyDetails";
import JobDetails from "./pages/JobDetails";

import ProfileMenu from "./pages/profilePage/Profile";
import MyProfile from "./pages/profilePage/components/MyProfile";
import ProfileHome from "./pages/profilePage/components/ProfileHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>

        {/* Company */}
        <Route path="company/:companyId" element={<CompanyDetails />}>
          <Route path="job/:jobId" element={<JobDetails />} />
        </Route>

        {/* Profile */}
        <Route path="profile" element={<ProfileMenu />}>
  <Route index element={<ProfileHome />} />
  <Route path="me" element={<MyProfile />} />
</Route>

      </Route>
    </Routes>
  );
}

export default App;
