import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import CompanyDetails from "./pages/companyPages/CompanyDetails";
import JobDetails from "./pages/JobDetails";
import ProfileMenu from "./pages/profilePage/Profile";
import MyProfile from "./pages/profilePage/components/MyProfile";
import ProfileHome from "./pages/profilePage/components/ProfileHome";
import Applications from "./pages/profilePage/components/Applications";
import SavedJobs from "./pages/profilePage/components/SavedJobs";
import Settings from "./pages/profilePage/components/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import CompanyManage from "./pages/companyPages/CompanyManage";

function App() {
  return <Routes>
    <Route path="/" element={<Home />}>
      <Route path="company/:companyId" element={<CompanyDetails />}>
        <Route path="job/:jobId" element={<JobDetails />} />
      </Route>
      <Route path="job/:jobId" element={<JobDetails />} />
      <Route element={<ProtectedRoute />}>
        <Route path="company/:companyId/manage" element={<CompanyManage />} />
        <Route path="profile" element={<ProfileMenu />}>
          <Route index element={<ProfileHome />} />
          <Route path="me" element={<MyProfile />} />
          <Route path="applications" element={<Applications />} />
          <Route path="saved" element={<SavedJobs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Route>
  </Routes>;
}
export default App;
