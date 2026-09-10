import { Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { useGlobalContext } from "../../context/GlobalContext";
import { motion } from "motion/react";

function ProfileMenu() {
  const navigate = useNavigate();
  const { logout, loading } = useGlobalContext();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-full
        max-w-[480px]
        flex-col
        overflow-y-auto
        bg-white
        shadow-2xl
      "
    >
      {/* Main Profile Content */}
      <Outlet />

      {/* Logout */}
      <div className="mt-auto p-6">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-200
            px-3
            py-2.5
            text-sm
            font-semibold
            text-gray-600
            transition
            hover:border-red-200
            hover:bg-red-50
            hover:text-red-600
            disabled:opacity-50
          "
        >
          <LogOut size={16} />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </motion.aside>
  );
}

export default ProfileMenu;