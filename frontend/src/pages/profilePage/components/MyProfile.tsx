import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, User } from "lucide-react";
import { useGlobalContext } from "../../../context/GlobalContext";
import { updateUserProfile } from "../../../api/user.api";
import { useState } from "react";
import type { UserUpdateDataTyep } from "../../../types/user.type";

function MyProfile() {
  const { user, updateUser } = useGlobalContext();

  const [userUpdateData, setUserUpdateData] = useState({
    name: user?.name,
  });

  const [isEdit, setIsEdit] = useState(false);

  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const location = user?.location;

  const handleProfileNameClick = () => {
    setUserUpdateData({
      name: user?.name ?? "",
    });

    setIsEdit(true);
  };

  const handleUpdateFormSubmitt = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true)
      const response = await updateUserProfile(userUpdateData);
      updateUser(response.data);
      setIsEdit(false);
    } catch (err) {
      console.log(err);
    }
    finally{
      setLoading(false)
    }
  };

  const handleUpdateinputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

          {!isEdit ? (
            <>
              <p className="mt-2 text-sm font-semibold text-gray-800">
                {user?.name || "Not available"}
              </p>

              <button
                onClick={handleProfileNameClick}
                className="mt-2 text-sm font-medium text-blue-600"
              >
                Edit
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdateFormSubmitt} className="mt-3">
              <input
                type="text"
                name="name"
                id="name"
                value={userUpdateData.name}
                onChange={handleUpdateinputs}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />

              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                >
                  {loading === true ? <p aria-disabled>Saving....</p> : <p>Save</p>}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEdit(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
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
