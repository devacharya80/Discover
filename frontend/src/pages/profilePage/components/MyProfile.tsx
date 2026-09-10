import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, User } from "lucide-react";
import { useGlobalContext } from "../../../context/GlobalContext";

function MyProfile() {
  const navigate = useNavigate();
  const { user } = useGlobalContext();

  const location = user?.location;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-gray-600
              transition
              hover:bg-gray-100
              hover:text-gray-900
            "
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>
      </div>

      {/* Profile information */}
      <div className="mt-8 space-y-4">
        {/* Name */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />

            <p className="text-xs font-medium text-gray-400">Name</p>
          </div>

          <p className="mt-2 text-sm font-semibold text-gray-800">
            {user?.name || "Not available"}
          </p>
          <button className="hover:text-blue-500">Edit</button>
        </div>

        {/* Email */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />

            <p className="text-xs font-medium text-gray-400">Email</p>
          </div>

          <p className="mt-2 text-sm font-semibold text-gray-800">
            {user?.email || "Not available"}
          </p>
        </div>

        {/* Location */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />

            <p className="text-xs font-medium text-gray-400">Location</p>
          </div>

          {location ? (
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p>{location.address}</p>

              <p>
                {location.city}, {location.state}
              </p>

              <p>
                {location.country} - {location.pincode}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">No location added</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
