import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Briefcase, Bookmark, Settings } from "lucide-react";

function ProfileHome() {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <button onClick={() => navigate("/")} aria-label="Back to map" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <button onClick={() => navigate("/profile/me")} className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100">
          <User size={18} /> My Profile
        </button>
        <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400"><Briefcase size={18} /> Applications <span className="ml-auto text-xs">Coming soon</span></div>
        <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400"><Bookmark size={18} /> Saved Jobs <span className="ml-auto text-xs">Coming soon</span></div>
        <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-400"><Settings size={18} /> Settings <span className="ml-auto text-xs">Coming soon</span></div>
      </div>
    </div>
  );
}
export default ProfileHome;
